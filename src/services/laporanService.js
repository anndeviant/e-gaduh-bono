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
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  incrementJumlahLaporan,
  decrementJumlahLaporan,
  syncJumlahLaporan,
  updatePeternak,
  syncStatusPeternakSelesai,
} from "./peternakService";

const COLLECTION_LAPORAN = "laporan";

// CREATE
export const createLaporan = async (laporanData) => {
  try {
    // Validasi field wajib
    const requiredFields = [
      "idPeternak",
      "displayPeriod",
      "jumlahTernakAwal",
      "jumlahTernakSaatIni",
      "tanggalLaporan",
    ];

    // Pastikan ada reportNumber
    if (!laporanData.reportNumber) {
      throw new Error("Field reportNumber wajib diisi");
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

    // Pastikan reportNumber diset
    const reportNumber = laporanData.reportNumber;

    // Validasi duplikasi laporan ke-N untuk peternak yang sama
    // Cek semua laporan peternak ini dan validasi manual
    const existingLaporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      where("idPeternak", "==", laporanData.idPeternak)
    );
    const existingSnapshot = await getDocs(existingLaporanQuery);

    // Cek duplikasi berdasarkan reportNumber
    const existingReports = existingSnapshot.docs.map((doc) => {
      const data = doc.data();
      return data.reportNumber;
    });

    if (existingReports.includes(reportNumber)) {
      throw new Error(
        `Laporan ke-${reportNumber} sudah ada untuk peternak ini`
      );
    }

    // Validasi maksimal 8 laporan
    if (existingSnapshot.docs.length >= 8) {
      throw new Error(
        "Peternak sudah mencapai maksimal 8 laporan (2 tahun program)"
      );
    }

    // Cek status peternak apakah sudah "Selesai"
    const peternakDoc = await getDoc(
      doc(db, "peternak", laporanData.idPeternak)
    );
    if (peternakDoc.exists()) {
      const peternakData = peternakDoc.data();
      if (peternakData.statusSiklus === "Selesai") {
        throw new Error("Program peternak ini sudah selesai");
      }
    }

    // Hapus field id dari laporanData jika ada (untuk menghindari duplikasi)
    const { id, ...dataWithoutId } = laporanData;

    // Pastikan data yang disimpan menggunakan format baru
    const finalData = {
      ...dataWithoutId,
      reportNumber: reportNumber, // Pastikan reportNumber tersimpan
      displayPeriod: `Laporan ke-${reportNumber}`, // Format displayPeriod yang disederhanakan
      tanggalLaporan:
        laporanData.tanggalLaporan || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_LAPORAN), finalData);

    // Update jumlah laporan di data peternak setelah berhasil membuat laporan
    try {
      await incrementJumlahLaporan(finalData.idPeternak);

      // Cek apakah sudah mencapai 8 laporan (program selesai)
      if (existingSnapshot.docs.length + 1 >= 8) {
        // Update status peternak menjadi "Selesai"
        await updatePeternak(finalData.idPeternak, {
          statusSiklus: "Selesai",
          tanggalSelesai: new Date().toISOString().split("T")[0],
        });
        console.log(
          `Program peternak ${finalData.idPeternak} telah diselesaikan (8 laporan tercapai)`
        );
      }
    } catch (error) {
      console.error("Error incrementing jumlahLaporan:", error);
      // Tidak throw error untuk menjaga konsistensi data laporan yang sudah berhasil dibuat
    }

    return { id: docRef.id, ...finalData };
  } catch (error) {
    console.error("Error creating laporan:", error);
    throw error;
  }
};

// READ ALL LAPORAN
export const getAllLaporan = async () => {
  try {
    // Query berdasarkan tanggalLaporan saja
    const laporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      orderBy("tanggalLaporan", "desc")
    );
    const querySnapshot = await getDocs(laporanQuery);

    // Transform data untuk backward compatibility
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Pastikan reportNumber tersedia
        reportNumber: data.reportNumber,
        // Update displayPeriod langsung ke format "Laporan ke-" tanpa tahun
        displayPeriod: `Laporan ke-${data.reportNumber}`,
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
    // Query berdasarkan tanggalLaporan saja
    const laporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      where("idPeternak", "==", idPeternak),
      orderBy("tanggalLaporan", "asc")
    );
    const querySnapshot = await getDocs(laporanQuery);

    // Transform data untuk backward compatibility dan sort manual
    const laporanData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Pastikan reportNumber tersedia
        reportNumber: data.reportNumber,
        // Update displayPeriod langsung ke format "Laporan ke-" tanpa tahun
        displayPeriod: `Laporan ke-${data.reportNumber}`,
      };
    });

    // Sort manual berdasarkan reportNumber
    return laporanData.sort((a, b) => {
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
    // Query berdasarkan tanggalLaporan saja
    const laporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      where("idPeternak", "==", idPeternak),
      orderBy("tanggalLaporan", "desc")
    );
    const querySnapshot = await getDocs(laporanQuery);

    // Transform data untuk backward compatibility
    const laporanData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Pastikan reportNumber tersedia
        reportNumber: data.reportNumber,
        // Update displayPeriod langsung ke format "Laporan ke-" tanpa tahun
        displayPeriod: `Laporan ke-${data.reportNumber}`,
      };
    });

    if (laporanData.length === 0) return null;

    // Sort manual berdasarkan reportNumber untuk mendapatkan yang terakhir
    const sortedData = laporanData.sort((a, b) => {
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

// UPDATE WITH CASCADING UPDATES
export const updateLaporan = async (laporanId, updateData) => {
  try {
    // Hapus field id dari updateData jika ada (untuk menghindari duplikasi)
    const { id, ...dataWithoutId } = updateData;

    // Generate reportNumber jika diperlukan
    const reportNumber = updateData.reportNumber;

    const finalUpdateData = {
      ...dataWithoutId,
      reportNumber: reportNumber, // Pastikan reportNumber tersimpan
      displayPeriod: `Laporan ke-${reportNumber}`, // Format displayPeriod yang disederhanakan
      updatedAt: new Date().toISOString(),
    };

    // Update laporan utama
    await updateDoc(doc(db, COLLECTION_LAPORAN, laporanId), finalUpdateData);

    let cascadeResult = { updatedCount: 0, reports: [] };

    // Cascading update: Update laporan-laporan berikutnya jika jumlahTernakSaatIni berubah
    if (finalUpdateData.jumlahTernakSaatIni !== undefined) {
      cascadeResult = await updateCascadingReports(
        updateData.idPeternak,
        reportNumber,
        finalUpdateData.jumlahTernakSaatIni
      );
    }

    return {
      id: laporanId,
      ...finalUpdateData,
      cascadeUpdate: cascadeResult,
    };
  } catch (error) {
    console.error("Error updating laporan:", error);
    throw error;
  }
};

// CASCADING UPDATE FUNCTION
const updateCascadingReports = async (
  idPeternak,
  fromReportNumber,
  newTernakSaatIni
) => {
  try {
    console.log(
      `Starting cascading update from report ${fromReportNumber} with new total: ${newTernakSaatIni}`
    );

    // Ambil semua laporan peternak ini yang reportNumber-nya lebih besar dari yang diupdate
    const nextReportsQuery = query(
      collection(db, COLLECTION_LAPORAN),
      where("idPeternak", "==", idPeternak)
    );
    const querySnapshot = await getDocs(nextReportsQuery);

    // Filter dan sort laporan yang perlu diupdate
    const allReports = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const reportsToUpdate = allReports
      .filter((report) => report.reportNumber > fromReportNumber)
      .sort((a, b) => a.reportNumber - b.reportNumber);

    if (reportsToUpdate.length === 0) {
      console.log("No subsequent reports to update");
      return { updatedCount: 0, reports: [] };
    }

    console.log(`Found ${reportsToUpdate.length} reports to cascade update`);

    // Gunakan batch untuk atomic transaction
    const batch = writeBatch(db);
    const updatedReports = [];

    // Update setiap laporan berikutnya secara berurutan
    let currentTernakAwal = newTernakSaatIni;

    for (let i = 0; i < reportsToUpdate.length; i++) {
      const report = reportsToUpdate[i];

      // Update jumlah awal ternak
      const updatedJumlahAwal = currentTernakAwal;

      // Hitung ulang jumlah saat ini berdasarkan jumlah awal yang baru
      const jumlahLahir = report.jumlahLahir || 0;
      const jumlahMati = report.jumlahKematian || 0;
      const jumlahDijual = report.jumlahTerjual || 0;

      const newJumlahSaatIni =
        updatedJumlahAwal + jumlahLahir - jumlahMati - jumlahDijual;

      const cascadeUpdateData = {
        jumlahTernakAwal: updatedJumlahAwal,
        jumlahTernakSaatIni: Math.max(0, newJumlahSaatIni), // Pastikan tidak negatif
        updatedAt: new Date().toISOString(),
        cascadedFrom: `Laporan ke-${fromReportNumber + 1}`, // Tracking untuk audit
        cascadedAt: new Date().toISOString(),
      };

      // Add to batch
      batch.update(doc(db, COLLECTION_LAPORAN, report.id), cascadeUpdateData);

      updatedReports.push({
        reportNumber: report.reportNumber,
        oldAwal: report.jumlahTernakAwal,
        newAwal: updatedJumlahAwal,
        oldSaatIni: report.jumlahTernakSaatIni,
        newSaatIni: Math.max(0, newJumlahSaatIni),
      });

      console.log(
        `Prepared update for Report ${report.reportNumber}: awal ${updatedJumlahAwal} -> saat ini ${newJumlahSaatIni}`
      );

      // Set currentTernakAwal untuk laporan berikutnya
      currentTernakAwal = Math.max(0, newJumlahSaatIni);
    }

    // Commit batch transaction
    await batch.commit();

    console.log(
      `Cascading update completed for ${updatedReports.length} reports`
    );

    return {
      updatedCount: updatedReports.length,
      reports: updatedReports,
    };
  } catch (error) {
    console.error("Error in cascading update:", error);
    // Jangan throw error agar update laporan utama tetap berhasil
    // Tapi return info error untuk monitoring
    return {
      updatedCount: 0,
      reports: [],
      error: error.message,
    };
  }
};

// DELETE WITH CASCADING UPDATES
export const deleteLaporan = async (laporanId) => {
  try {
    // Ambil data laporan terlebih dahulu untuk mendapatkan idPeternak dan reportNumber
    const laporanDoc = await getDoc(doc(db, COLLECTION_LAPORAN, laporanId));
    if (!laporanDoc.exists()) {
      throw new Error("Laporan tidak ditemukan");
    }

    const laporanData = laporanDoc.data();
    const idPeternak = laporanData.idPeternak;
    const reportNumber = laporanData.reportNumber;

    // Cari laporan sebelumnya untuk mendapatkan jumlah ternak saat ini yang akan menjadi awal untuk laporan berikutnya
    let newTernakAwalForNext = 5; // Default jika tidak ada laporan sebelumnya

    if (reportNumber > 1) {
      // Cari laporan sebelumnya
      const previousReportsQuery = query(
        collection(db, COLLECTION_LAPORAN),
        where("idPeternak", "==", idPeternak),
        where("reportNumber", "==", reportNumber - 1)
      );
      const previousSnapshot = await getDocs(previousReportsQuery);

      if (!previousSnapshot.empty) {
        const previousReport = previousSnapshot.docs[0].data();
        newTernakAwalForNext = previousReport.jumlahTernakSaatIni || 5;
      } else {
        // Jika tidak ada laporan sebelumnya, ambil dari data peternak
        const peternakDoc = await getDoc(doc(db, "peternak", idPeternak));
        if (peternakDoc.exists()) {
          const peternakData = peternakDoc.data();
          newTernakAwalForNext = peternakData.jumlahTernakAwal || 5;
        }
      }
    } else {
      // Jika yang dihapus adalah laporan ke-1, ambil dari data peternak
      const peternakDoc = await getDoc(doc(db, "peternak", idPeternak));
      if (peternakDoc.exists()) {
        const peternakData = peternakDoc.data();
        newTernakAwalForNext = peternakData.jumlahTernakAwal || 5;
      }
    }

    // Hapus laporan
    await deleteDoc(doc(db, COLLECTION_LAPORAN, laporanId));

    // Update jumlah laporan di data peternak setelah berhasil menghapus laporan
    if (idPeternak) {
      try {
        await decrementJumlahLaporan(idPeternak);
      } catch (error) {
        console.error("Error decrementing jumlahLaporan:", error);
        // Tidak throw error karena laporan sudah berhasil dihapus
      }
    }

    // Cascading update: Update laporan-laporan berikutnya
    const cascadeResult = await updateCascadingReports(
      idPeternak,
      reportNumber - 1,
      newTernakAwalForNext
    );

    return {
      success: true,
      cascadeUpdate: {
        ...cascadeResult,
        deletedReportNumber: reportNumber,
        action: "delete",
      },
    };
  } catch (error) {
    console.error("Error deleting laporan:", error);
    throw error;
  }
};

// SYNC JUMLAH LAPORAN - untuk sinkronisasi data yang sudah ada dengan perbaikan race condition
export const syncAllPeternakJumlahLaporan = async () => {
  try {
    console.log("Starting sync process for jumlahLaporan...");

    // Ambil semua laporan
    const laporanSnapshot = await getDocs(collection(db, COLLECTION_LAPORAN));

    // Kelompokkan laporan berdasarkan idPeternak
    const laporanByPeternak = {};
    laporanSnapshot.docs.forEach((doc) => {
      const laporan = doc.data();
      const idPeternak = laporan.idPeternak;

      if (!laporanByPeternak[idPeternak]) {
        laporanByPeternak[idPeternak] = [];
      }
      laporanByPeternak[idPeternak].push(laporan);
    });

    // Ambil semua peternak untuk memastikan yang tidak punya laporan juga di-sync
    const peternakSnapshot = await getDocs(collection(db, "peternak"));
    const allPeternakIds = peternakSnapshot.docs.map((doc) => doc.id);

    // Update jumlahLaporan untuk setiap peternak secara berurutan (menghindari race condition)
    const syncResults = [];

    for (const peternakId of allPeternakIds) {
      try {
        const laporanList = laporanByPeternak[peternakId] || [];
        const actualJumlahLaporan = laporanList.length;
        await syncJumlahLaporan(peternakId, actualJumlahLaporan);

        syncResults.push({
          idPeternak: peternakId,
          jumlahLaporan: actualJumlahLaporan,
          status: "success",
        });

        console.log(
          `Synced peternak ${peternakId}: ${actualJumlahLaporan} laporan`
        );
      } catch (error) {
        console.error(`Error syncing peternak ${peternakId}:`, error);
        syncResults.push({
          idPeternak: peternakId,
          status: "error",
          error: error.message,
        });
      }
    }

    console.log("Sync process completed:", syncResults);
    return syncResults;
  } catch (error) {
    console.error("Error syncing jumlahLaporan:", error);
    throw error;
  }
};

// Fungsi untuk auto-sync yang lebih reliable dengan interval waktu
export const shouldPerformSync = () => {
  const SYNC_INTERVAL = 6 * 60 * 60 * 1000; // 6 jam dalam milliseconds
  const lastSyncTime = localStorage.getItem("lastSyncTime");
  const currentTime = Date.now();

  // Jika tidak ada record sync sebelumnya atau sudah lebih dari 6 jam
  return !lastSyncTime || currentTime - parseInt(lastSyncTime) > SYNC_INTERVAL;
};

// Fungsi untuk auto-sync yang lebih reliable
export const performAutoSync = async () => {
  try {
    if (shouldPerformSync()) {
      console.log("Auto-sync triggered");
      const results = await syncAllPeternakJumlahLaporan();

      // Juga sync status peternak yang selesai
      await syncStatusPeternakSelesai();

      localStorage.setItem("lastSyncTime", Date.now().toString());
      return { performed: true, results };
    }

    return { performed: false, message: "Sync not needed yet" };
  } catch (error) {
    console.error("Auto-sync failed:", error);
    // Jangan simpan lastSyncTime jika gagal, agar dicoba lagi nanti
    throw error;
  }
};

// Fungsi untuk memaksa sync ulang (untuk tombol manual sync)
export const forceSync = async () => {
  try {
    console.log("Force sync triggered");
    const results = await syncAllPeternakJumlahLaporan();

    // Juga sync status peternak yang selesai
    await syncStatusPeternakSelesai();

    localStorage.setItem("lastSyncTime", Date.now().toString());
    return results;
  } catch (error) {
    console.error("Force sync failed:", error);
    throw error;
  }
};

// Export fungsi sync status peternak selesai untuk penggunaan manual
export { syncStatusPeternakSelesai };
