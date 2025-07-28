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

const COLLECTION_LAPORAN = "laporan";

// CREATE
export const createLaporan = async (laporanData) => {
  try {
    // Validasi field wajib
    const requiredFields = [
      "idPeternak",
      "year",
      "startDate",
      "endDate",
      "displayPeriod",
      "jumlahTernakAwal",
      "jumlahTernakSaatIni",
      "targetPengembalian",
      "tanggalLaporan",
    ];

    // Pastikan ada reportNumber atau quarter
    if (!laporanData.reportNumber && !laporanData.quarter) {
      throw new Error("Field reportNumber atau quarter wajib diisi");
    }

    for (const field of requiredFields) {
      if (
        laporanData[field] === undefined ||
        laporanData[field] === null ||
        laporanData[field] === ""
      ) {
        throw new Error(`Field ${field} wajib diisi`);
      }
    }

    // Pastikan reportNumber diset dengan fallback ke quarter
    const reportNumber = laporanData.reportNumber || laporanData.quarter || 1;

    // Validasi duplikasi laporan ke-N untuk peternak yang sama
    // Cek semua laporan peternak ini dan validasi manual
    const existingLaporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      where("idPeternak", "==", laporanData.idPeternak)
    );
    const existingSnapshot = await getDocs(existingLaporanQuery);

    // Cek duplikasi berdasarkan reportNumber atau quarter
    const existingReports = existingSnapshot.docs.map((doc) => {
      const data = doc.data();
      return data.reportNumber || data.quarter || 1;
    });

    if (existingReports.includes(reportNumber)) {
      throw new Error(
        `Laporan ke-${reportNumber} sudah ada untuk peternak ini`
      );
    }

    // Validasi maksimal 8 laporan
    console.log("DEBUG idPeternak:", laporanData.idPeternak);
    console.log(
      "DEBUG existingSnapshot.docs.length:",
      existingSnapshot.docs.length
    );
    console.log(
      "DEBUG existingSnapshot.docs:",
      existingSnapshot.docs.map((doc) => doc.data())
    );
    if (existingSnapshot.docs.length >= 8) {
      throw new Error(
        "Peternak sudah mencapai maksimal 8 laporan (2 tahun program)"
      );
    }

    // Hapus field id dari laporanData jika ada (untuk menghindari duplikasi)
    const { id, ...dataWithoutId } = laporanData;

    // Pastikan data yang disimpan menggunakan format baru
    const finalData = {
      ...dataWithoutId,
      reportNumber: reportNumber, // Pastikan reportNumber tersimpan
      displayPeriod: `Laporan ke-${reportNumber} ${
        dataWithoutId.year || new Date().getFullYear()
      }`, // Format displayPeriod yang benar
      tanggalLaporan:
        laporanData.tanggalLaporan || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_LAPORAN), finalData);
    return { id: docRef.id, ...finalData };
  } catch (error) {
    console.error("Error creating laporan:", error);
    throw error;
  }
};

// READ ALL LAPORAN
export const getAllLaporan = async () => {
  try {
    // Query tanpa orderBy reportNumber karena mungkin belum ada di data lama
    const laporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      orderBy("year", "desc"),
      orderBy("tanggalLaporan", "desc")
    );
    const querySnapshot = await getDocs(laporanQuery);

    // Transform data untuk backward compatibility
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Pastikan reportNumber tersedia dengan fallback ke quarter
        reportNumber: data.reportNumber || data.quarter || 1,
        // Update displayPeriod langsung ke format "Laporan ke-"
        displayPeriod: `Laporan ke-${data.reportNumber || data.quarter || 1} ${
          data.year || new Date().getFullYear()
        }`,
      };
    });
  } catch (error) {
    console.error("Error getting all laporan:", error);
    throw error;
  }
};

// READ ALL BY PETERNNAK
export const getLaporanByPeternak = async (idPeternak) => {
  try {
    // Query tanpa orderBy reportNumber karena mungkin belum ada di data lama
    const laporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      where("idPeternak", "==", idPeternak),
      orderBy("year", "asc"),
      orderBy("tanggalLaporan", "asc")
    );
    const querySnapshot = await getDocs(laporanQuery);

    // Transform data untuk backward compatibility dan sort manual
    const laporanData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Pastikan reportNumber tersedia dengan fallback ke quarter
        reportNumber: data.reportNumber || data.quarter || 1,
        // Update displayPeriod langsung ke format "Laporan ke-"
        displayPeriod: `Laporan ke-${data.reportNumber || data.quarter || 1} ${
          data.year || new Date().getFullYear()
        }`,
      };
    });

    // Sort manual berdasarkan reportNumber
    return laporanData.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.reportNumber - b.reportNumber;
    });
  } catch (error) {
    console.error("Error getting laporan by peternak:", error);
    throw error;
  }
};

// READ LATEST BY PETERNAK - untuk mendapatkan laporan terakhir peternak
export const getLatestLaporanByPeternak = async (idPeternak) => {
  try {
    // Query tanpa orderBy reportNumber karena mungkin belum ada di data lama
    const laporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      where("idPeternak", "==", idPeternak),
      orderBy("year", "desc"),
      orderBy("tanggalLaporan", "desc")
    );
    const querySnapshot = await getDocs(laporanQuery);

    // Transform data untuk backward compatibility
    const laporanData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Pastikan reportNumber tersedia dengan fallback ke quarter
        reportNumber: data.reportNumber || data.quarter || 1,
        // Update displayPeriod langsung ke format "Laporan ke-"
        displayPeriod: `Laporan ke-${data.reportNumber || data.quarter || 1} ${
          data.year || new Date().getFullYear()
        }`,
      };
    });

    if (laporanData.length === 0) return null;

    // Sort manual berdasarkan reportNumber untuk mendapatkan yang terakhir
    const sortedData = laporanData.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return b.reportNumber - a.reportNumber;
    });

    return sortedData[0];
  } catch (error) {
    console.error("Error getting latest laporan by peternak:", error);
    throw error;
  }
}; // READ BY ID
export const getLaporanById = async (laporanId) => {
  try {
    const laporanDoc = await getDoc(doc(db, COLLECTION_LAPORAN, laporanId));
    if (!laporanDoc.exists()) {
      throw new Error("Laporan tidak ditemukan");
    }
    return { id: laporanDoc.id, ...laporanDoc.data() };
  } catch (error) {
    console.error("Error getting laporan by id:", error);
    throw error;
  }
};

// UPDATE
export const updateLaporan = async (laporanId, updateData) => {
  try {
    // Hapus field id dari updateData jika ada (untuk menghindari duplikasi)
    const { id, ...dataWithoutId } = updateData;

    // Generate reportNumber jika diperlukan
    const reportNumber = updateData.reportNumber || updateData.quarter || 1;

    const finalUpdateData = {
      ...dataWithoutId,
      reportNumber: reportNumber, // Pastikan reportNumber tersimpan
      displayPeriod: `Laporan ke-${reportNumber} ${
        dataWithoutId.year || updateData.year || new Date().getFullYear()
      }`, // Format displayPeriod yang benar
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(doc(db, COLLECTION_LAPORAN, laporanId), finalUpdateData);
    return { id: laporanId, ...finalUpdateData };
  } catch (error) {
    console.error("Error updating laporan:", error);
    throw error;
  }
};

// DELETE
export const deleteLaporan = async (laporanId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_LAPORAN, laporanId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting laporan:", error);
    throw error;
  }
};
