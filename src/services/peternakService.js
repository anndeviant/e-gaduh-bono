import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Constants
const COLLECTION_PETERNAK = "peternak";

// CRUD Operations for Peternak
export const createPeternak = async (peternakData) => {
  try {
    // Validasi data required
    const requiredFields = [
      "namaLengkap",
      "nik",
      "alamat",
      "nomorTelepon",
      "email",
      "jenisKelamin",
      "tanggalDaftar",
    ];
    for (const field of requiredFields) {
      if (!peternakData[field]) {
        throw new Error(`Field ${field} wajib diisi`);
      }
    }

    // Cek NIK duplikat
    const nikQuery = query(
      collection(db, COLLECTION_PETERNAK),
      where("nik", "==", peternakData.nik)
    );
    const nikSnapshot = await getDocs(nikQuery);
    if (!nikSnapshot.empty) {
      throw new Error("NIK sudah terdaftar");
    }

    // Siapkan data peternak
    const dataToSave = {
      ...peternakData,
      jumlahTernakAwal: parseInt(peternakData.jumlahTernakAwal) || 5,
      statusKinerja: "Baru", // Status awal selalu "Baru" saat mendaftar
      programAktif: true,
      tanggalDibuat: new Date().toISOString(),
      tanggalUpdate: new Date().toISOString(),
    };

    // Simpan ke Firestore
    const docRef = await addDoc(
      collection(db, COLLECTION_PETERNAK),
      dataToSave
    );

    return {
      id: docRef.id,
      ...dataToSave,
    };
  } catch (error) {
    console.error("Error creating peternak:", error);
    throw error;
  }
};

export const updatePeternak = async (peternakId, updateData) => {
  try {
    const peternakRef = doc(db, COLLECTION_PETERNAK, peternakId);

    // Jika ada perubahan NIK, cek duplikat
    if (updateData.nik) {
      const nikQuery = query(
        collection(db, COLLECTION_PETERNAK),
        where("nik", "==", updateData.nik)
      );
      const nikSnapshot = await getDocs(nikQuery);
      const duplicateDoc = nikSnapshot.docs.find(
        (doc) => doc.id !== peternakId
      );
      if (duplicateDoc) {
        throw new Error("NIK sudah terdaftar");
      }
    }

    const dataToUpdate = {
      ...updateData,
      tanggalUpdate: new Date().toISOString(),
    };

    await updateDoc(peternakRef, dataToUpdate);

    return {
      id: peternakId,
      ...dataToUpdate,
    };
  } catch (error) {
    console.error("Error updating peternak:", error);
    throw error;
  }
};

export const deletePeternak = async (peternakId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_PETERNAK, peternakId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting peternak:", error);
    throw error;
  }
};

export const getAllPeternak = async (filters = {}) => {
  try {
    let peternakQuery = collection(db, COLLECTION_PETERNAK);

    // Apply filters if provided
    if (filters.statusKinerja) {
      peternakQuery = query(
        peternakQuery,
        where("statusKinerja", "==", filters.statusKinerja)
      );
    }

    if (filters.programAktif !== undefined) {
      peternakQuery = query(
        peternakQuery,
        where("programAktif", "==", filters.programAktif)
      );
    }

    // Order by creation date
    peternakQuery = query(peternakQuery, orderBy("tanggalDibuat", "desc"));

    const querySnapshot = await getDocs(peternakQuery);
    const peternak = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return peternak;
  } catch (error) {
    console.error("Error getting all peternak:", error);
    throw error;
  }
};

export const getPeternakById = async (peternakId) => {
  try {
    const peternakDoc = await getDoc(doc(db, COLLECTION_PETERNAK, peternakId));

    if (!peternakDoc.exists()) {
      throw new Error("Data peternak tidak ditemukan");
    }

    return {
      id: peternakDoc.id,
      ...peternakDoc.data(),
    };
  } catch (error) {
    console.error("Error getting peternak by id:", error);
    throw error;
  }
};

export const searchPeternak = async (searchTerm) => {
  try {
    // Firestore doesn't support full-text search, so we'll get all and filter
    const allPeternak = await getAllPeternak();

    if (!searchTerm) return allPeternak;

    const searchLower = searchTerm.toLowerCase();
    const filtered = allPeternak.filter(
      (peternak) =>
        peternak.namaLengkap?.toLowerCase().includes(searchLower) ||
        peternak.nik?.includes(searchTerm) ||
        peternak.alamat?.toLowerCase().includes(searchLower) ||
        peternak.nomorTelepon?.includes(searchTerm) ||
        peternak.email?.toLowerCase().includes(searchLower)
    );

    return filtered;
  } catch (error) {
    console.error("Error searching peternak:", error);
    throw error;
  }
};

// Fungsi untuk update status program peternak
export const updateStatusProgram = async (peternakId, statusBaru) => {
  try {
    return await updatePeternak(peternakId, { programAktif: statusBaru });
  } catch (error) {
    console.error("Error updating program status:", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan statistik peternak
export const getPeternakStats = async () => {
  try {
    const allPeternak = await getAllPeternak();

    const stats = {
      total: allPeternak.length,
      aktif: allPeternak.filter((p) => p.programAktif).length,
      nonAktif: allPeternak.filter((p) => !p.programAktif).length,
      statusKinerja: {
        baru: allPeternak.filter((p) => p.statusKinerja === "Baru").length,
        progress: allPeternak.filter((p) => p.statusKinerja === "Progress")
          .length,
        bagus: allPeternak.filter((p) => p.statusKinerja === "Bagus").length,
        biasa: allPeternak.filter((p) => p.statusKinerja === "Biasa").length,
        kurang: allPeternak.filter((p) => p.statusKinerja === "Kurang").length,
      },
    };

    return stats;
  } catch (error) {
    console.error("Error getting peternak stats:", error);
    throw error;
  }
};

// Fungsi untuk auto-update status kinerja berdasarkan progress laporan
export const updateStatusKinerjaOtomatis = async (
  peternakId,
  totalLaporan,
  programSelesai = false
) => {
  try {
    let statusBaru = "Baru";

    if (programSelesai) {
      // Program selesai (8 triwulan), statusnya ditentukan oleh admin atau sistem penilaian
      // Untuk sementara, kita biarkan manual update oleh admin
      return null;
    } else if (totalLaporan >= 1) {
      // Sudah ada laporan, status menjadi "Progress"
      statusBaru = "Progress";
    }

    // Update status jika berbeda
    const peternakData = await getPeternakById(peternakId);
    if (peternakData.statusKinerja !== statusBaru) {
      await updatePeternak(peternakId, { statusKinerja: statusBaru });
      return statusBaru;
    }

    return null;
  } catch (error) {
    console.error("Error updating status kinerja otomatis:", error);
    throw error;
  }
};

// Fungsi untuk update status kinerja final (manual oleh admin)
export const updateStatusKinerjaFinal = async (peternakId, statusFinal) => {
  try {
    const validStatusFinal = ["Bagus", "Biasa", "Kurang"];
    if (!validStatusFinal.includes(statusFinal)) {
      throw new Error("Status kinerja final harus: Bagus, Biasa, atau Kurang");
    }

    return await updatePeternak(peternakId, {
      statusKinerja: statusFinal,
      programAktif: false, // Program selesai
      tanggalSelesai: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating status kinerja final:", error);
    throw error;
  }
};
