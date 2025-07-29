import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION_PETERNAK = "peternak";

// CREATE
export const createPeternak = async (peternakData) => {
  try {
    const requiredFields = [
      "namaLengkap",
      "nik",
      "alamat",
      "nomorTelepon",
      "jenisKelamin",
      "statusSiklus",
      "tanggalDaftar",
      "jumlahTernakAwal",
      "targetPengembalian",
    ];

    for (const field of requiredFields) {
      if (!peternakData[field]) {
        throw new Error(`Field ${field} wajib diisi`);
      }
    }

    // Cek duplikasi NIK
    const nikQuery = query(
      collection(db, COLLECTION_PETERNAK),
      where("nik", "==", peternakData.nik)
    );
    const nikSnapshot = await getDocs(nikQuery);
    if (!nikSnapshot.empty) {
      throw new Error("NIK sudah terdaftar");
    }

    const finalData = {
      ...peternakData,
      jumlahLaporan: 0, // Inisialisasi jumlah laporan
      tanggalSelesai: null, // Inisialisasi tanggal selesai
    };

    const docRef = await addDoc(collection(db, COLLECTION_PETERNAK), finalData);
    return { id: docRef.id, ...finalData };
  } catch (error) {
    console.error("Error creating peternak:", error);
    throw error;
  }
};

// READ ALL
export const getAllPeternak = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_PETERNAK));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all peternak:", error);
    throw error;
  }
};

// READ BY ID
export const getPeternakById = async (peternakId) => {
  try {
    const peternakDoc = await getDoc(doc(db, COLLECTION_PETERNAK, peternakId));
    if (!peternakDoc.exists()) {
      throw new Error("Data peternak tidak ditemukan");
    }
    return { id: peternakDoc.id, ...peternakDoc.data() };
  } catch (error) {
    console.error("Error getting peternak by id:", error);
    throw error;
  }
};

// UPDATE
export const updatePeternak = async (peternakId, updateData) => {
  try {
    // Jika status diubah menjadi "Selesai", tambahkan tanggal selesai
    if (updateData.statusSiklus === "Selesai" && !updateData.tanggalSelesai) {
      updateData.tanggalSelesai = new Date().toISOString().split("T")[0];
    }

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

    await updateDoc(doc(db, COLLECTION_PETERNAK, peternakId), updateData);
    return { id: peternakId, ...updateData };
  } catch (error) {
    console.error("Error updating peternak:", error);
    throw error;
  }
};

// DELETE
export const deletePeternak = async (peternakId) => {
  try {
    // Tambahan: Hapus juga semua laporan yang terkait dengan peternak ini (opsional)
    const laporanQuery = query(
      collection(db, "laporan"),
      where("idPeternak", "==", peternakId)
    );
    const laporanSnapshot = await getDocs(laporanQuery);
    laporanSnapshot.forEach(async (laporanDoc) => {
      await deleteDoc(doc(db, "laporan", laporanDoc.id));
    });

    await deleteDoc(doc(db, COLLECTION_PETERNAK, peternakId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting peternak:", error);
    throw error;
  }
};

// FUNGSI UNTUK MENGELOLA JUMLAH LAPORAN
export const updateJumlahLaporan = async (peternakId, jumlahLaporan) => {
  try {
    const peternakRef = doc(db, COLLECTION_PETERNAK, peternakId);
    await updateDoc(peternakRef, { jumlahLaporan });
  } catch (error) {
    console.error("Error updating jumlah laporan:", error);
    throw error;
  }
};

export const incrementJumlahLaporan = async (peternakId) => {
  const peternakDoc = await getDoc(doc(db, COLLECTION_PETERNAK, peternakId));
  if (!peternakDoc.exists()) throw new Error("Data peternak tidak ditemukan");

  const currentJumlah = peternakDoc.data().jumlahLaporan || 0;
  await updateJumlahLaporan(peternakId, currentJumlah + 1);
};

export const decrementJumlahLaporan = async (peternakId) => {
  const peternakDoc = await getDoc(doc(db, COLLECTION_PETERNAK, peternakId));
  if (!peternakDoc.exists()) throw new Error("Data peternak tidak ditemukan");

  const currentJumlah = peternakDoc.data().jumlahLaporan || 0;
  await updateJumlahLaporan(peternakId, Math.max(0, currentJumlah - 1));
};

export const syncJumlahLaporan = async (peternakId, actualJumlahLaporan) => {
  await updateJumlahLaporan(peternakId, actualJumlahLaporan);
};
