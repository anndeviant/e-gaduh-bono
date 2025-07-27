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
import { updateStatusKinerjaOtomatis } from "./peternakService";

// Constants
const COLLECTION_LAPORAN = "laporan";
const COLLECTION_PETERNAK = "peternak";
const PROGRAM_DURATION_QUARTERS = 8; // 2 tahun = 8 triwulan
const DEFAULT_INITIAL_GOATS = 5; // Jumlah kambing awal default

// Helper functions untuk menghitung periode triwulan
export const calculateQuarterPeriods = (registrationDate) => {
  const startDate = new Date(registrationDate);
  const periods = [];

  for (let quarter = 1; quarter <= PROGRAM_DURATION_QUARTERS; quarter++) {
    const quarterStartDate = new Date(startDate);
    quarterStartDate.setMonth(startDate.getMonth() + (quarter - 1) * 3);

    const quarterEndDate = new Date(quarterStartDate);
    quarterEndDate.setMonth(quarterStartDate.getMonth() + 3);
    quarterEndDate.setDate(quarterEndDate.getDate() - 1); // Hari terakhir periode

    periods.push({
      quarter,
      year: quarterStartDate.getFullYear(),
      startDate: quarterStartDate.toISOString().split("T")[0],
      endDate: quarterEndDate.toISOString().split("T")[0],
      displayPeriod: `${quarterStartDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })} - ${quarterEndDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
    });
  }

  return periods;
};

export const getCurrentQuarterInfo = (
  registrationDate,
  quarterNumber = null
) => {
  const periods = calculateQuarterPeriods(registrationDate);

  if (quarterNumber) {
    return periods.find((p) => p.quarter === quarterNumber) || null;
  }

  // Jika tidak ada quarterNumber, return periode yang sedang aktif
  const today = new Date().toISOString().split("T")[0];
  const currentPeriod = periods.find(
    (p) => today >= p.startDate && today <= p.endDate
  );

  return currentPeriod || periods[0]; // fallback ke periode pertama
};

export const getNextAllowedQuarter = async (peternakId) => {
  try {
    // Mode development - menggunakan data dummy dari localStorage atau state
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      // Ambil data peternak dari state/localStorage (simulasi untuk development)
      const mockPeternakData = {
        tanggalDaftar: "2024-01-15", // Default tanggal registrasi
        jumlahTernakAwal: 5,
      };

      // Simulasi laporan yang sudah ada (untuk development)
      const mockExistingReports = [
        // Bisa kosong untuk peternak baru, atau ada beberapa untuk testing
      ];

      // Tentukan quarter berikutnya yang bisa dibuat
      let nextQuarter = 1;
      if (mockExistingReports.length > 0) {
        const lastQuarter = Math.max(
          ...mockExistingReports.map((r) => r.quarterNumber)
        );
        nextQuarter = lastQuarter + 1;
      }

      // Validasi maksimal 8 triwulan
      if (nextQuarter > PROGRAM_DURATION_QUARTERS) {
        return null; // Program sudah selesai
      }

      // Dapatkan info periode untuk quarter berikutnya
      const quarterInfo = getCurrentQuarterInfo(
        mockPeternakData.tanggalDaftar,
        nextQuarter
      );

      return {
        quarterNumber: nextQuarter,
        quarterInfo,
        canCreate: true,
        existingReports: mockExistingReports,
      };
    }

    // Mode production - menggunakan Firebase
    const peternakDoc = await getDoc(doc(db, COLLECTION_PETERNAK, peternakId));
    if (!peternakDoc.exists()) {
      throw new Error("Data peternak tidak ditemukan");
    }

    const peternakData = peternakDoc.data();
    const registrationDate = peternakData.tanggalDaftar;

    // Ambil semua laporan peternak yang sudah ada
    const laporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      where("peternakId", "==", peternakId),
      orderBy("quarterNumber", "asc")
    );

    const laporanSnapshot = await getDocs(laporanQuery);
    const existingReports = laporanSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Tentukan quarter berikutnya yang bisa dibuat
    let nextQuarter = 1;
    if (existingReports.length > 0) {
      const lastQuarter = Math.max(
        ...existingReports.map((r) => r.quarterNumber)
      );
      nextQuarter = lastQuarter + 1;
    }

    // Validasi maksimal 8 triwulan
    if (nextQuarter > PROGRAM_DURATION_QUARTERS) {
      return null; // Program sudah selesai
    }

    // Dapatkan info periode untuk quarter berikutnya
    const quarterInfo = getCurrentQuarterInfo(registrationDate, nextQuarter);

    return {
      quarterNumber: nextQuarter,
      quarterInfo,
      canCreate: true,
      existingReports,
    };
  } catch (error) {
    console.error("Error getting next allowed quarter:", error);
    throw error;
  }
};

export const calculatePrefillData = (previousReport) => {
  if (!previousReport) {
    return {
      jumlah_saat_ini: DEFAULT_INITIAL_GOATS,
      jumlah_awal: DEFAULT_INITIAL_GOATS,
    };
  }

  // Jumlah awal = jumlah saat ini dari laporan sebelumnya
  const jumlahAwal = previousReport.jumlah_saat_ini || 0;

  return {
    jumlah_awal: jumlahAwal,
    jumlah_saat_ini: jumlahAwal, // akan diupdate otomatis saat user input data lain
  };
};

export const validateReportSequence = (quarterNumber, existingReports) => {
  // Cek apakah quarter sudah ada
  const existingQuarter = existingReports.find(
    (r) => r.quarterNumber === quarterNumber
  );
  if (existingQuarter) {
    return {
      valid: false,
      message: `Laporan triwulan ${quarterNumber} sudah ada`,
    };
  }

  // Cek urutan - tidak boleh ada gap
  const existingQuarters = existingReports
    .map((r) => r.quarterNumber)
    .sort((a, b) => a - b);

  if (quarterNumber > 1) {
    const expectedPreviousQuarter = quarterNumber - 1;
    if (!existingQuarters.includes(expectedPreviousQuarter)) {
      return {
        valid: false,
        message: `Harus melengkapi laporan triwulan ${expectedPreviousQuarter} terlebih dahulu`,
      };
    }
  }

  return { valid: true };
};

// CRUD Operations
export const createLaporan = async (laporanData) => {
  try {
    // Mode development - simulasi tanpa Firebase
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      // Validasi data required
      const requiredFields = ["peternakId", "quarterNumber", "jumlah_saat_ini"];
      for (const field of requiredFields) {
        if (!laporanData[field]) {
          throw new Error(`Field ${field} wajib diisi`);
        }
      }

      // Simulasi delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate ID sederhana untuk development
      const mockId = "laporan_" + Date.now();

      // Siapkan data laporan untuk development
      const reportData = {
        id: mockId,
        ...laporanData,
        tanggalLaporan: new Date().toISOString().split("T")[0],
        quarterInfo: {
          quarter: laporanData.quarterNumber,
          year: new Date().getFullYear(),
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
          displayPeriod: `Triwulan ${
            laporanData.quarterNumber
          } ${new Date().getFullYear()}`,
        },
        tanggalDibuat: new Date().toISOString(),
        tanggalUpdate: new Date().toISOString(),
      };

      return reportData;
    }

    // Mode production - menggunakan Firebase
    // Validasi data required
    const requiredFields = ["peternakId", "quarterNumber", "jumlah_saat_ini"];
    for (const field of requiredFields) {
      if (!laporanData[field]) {
        throw new Error(`Field ${field} wajib diisi`);
      }
    }

    // Ambil info quarter berikutnya yang diizinkan
    const nextQuarterInfo = await getNextAllowedQuarter(laporanData.peternakId);
    if (!nextQuarterInfo || !nextQuarterInfo.canCreate) {
      throw new Error(
        "Tidak dapat membuat laporan baru. Program mungkin sudah selesai."
      );
    }

    // Validasi urutan
    const validation = validateReportSequence(
      laporanData.quarterNumber,
      nextQuarterInfo.existingReports
    );
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Siapkan data laporan
    const reportData = {
      ...laporanData,
      quarterInfo: nextQuarterInfo.quarterInfo,
      tanggalDibuat: new Date().toISOString(),
      tanggalUpdate: new Date().toISOString(),
    };

    // Simpan ke Firestore
    const docRef = await addDoc(collection(db, COLLECTION_LAPORAN), reportData);

    // Auto-update status kinerja peternak
    try {
      const totalLaporan = nextQuarterInfo.existingReports.length + 1; // +1 karena baru saja menambah
      const programSelesai = totalLaporan >= PROGRAM_DURATION_QUARTERS;
      await updateStatusKinerjaOtomatis(
        laporanData.peternakId,
        totalLaporan,
        programSelesai
      );
    } catch (statusError) {
      console.warn("Warning: Gagal update status kinerja:", statusError);
      // Tidak throw error karena laporan sudah berhasil disimpan
    }

    return {
      id: docRef.id,
      ...reportData,
    };
  } catch (error) {
    console.error("Error creating laporan:", error);
    throw error;
  }
};

export const updateLaporan = async (laporanId, updateData) => {
  try {
    const laporanRef = doc(db, COLLECTION_LAPORAN, laporanId);

    const dataToUpdate = {
      ...updateData,
      tanggalUpdate: new Date().toISOString(),
    };

    await updateDoc(laporanRef, dataToUpdate);

    return {
      id: laporanId,
      ...dataToUpdate,
    };
  } catch (error) {
    console.error("Error updating laporan:", error);
    throw error;
  }
};

export const deleteLaporan = async (laporanId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_LAPORAN, laporanId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting laporan:", error);
    throw error;
  }
};

export const getLaporanByPeternak = async (peternakId, filters = {}) => {
  try {
    let laporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      where("peternakId", "==", peternakId),
      orderBy("quarterNumber", "asc")
    );

    // Apply additional filters if provided
    if (filters.quarterNumber) {
      laporanQuery = query(
        laporanQuery,
        where("quarterNumber", "==", filters.quarterNumber)
      );
    }

    if (filters.year) {
      laporanQuery = query(
        laporanQuery,
        where("quarterInfo.year", "==", filters.year)
      );
    }

    const querySnapshot = await getDocs(laporanQuery);
    const laporan = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return laporan;
  } catch (error) {
    console.error("Error getting laporan by peternak:", error);
    throw error;
  }
};

export const getLaporanById = async (laporanId) => {
  try {
    const laporanDoc = await getDoc(doc(db, COLLECTION_LAPORAN, laporanId));

    if (!laporanDoc.exists()) {
      throw new Error("Laporan tidak ditemukan");
    }

    return {
      id: laporanDoc.id,
      ...laporanDoc.data(),
    };
  } catch (error) {
    console.error("Error getting laporan by id:", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan statistik laporan peternak
export const getLaporanStats = async (peternakId) => {
  try {
    const laporan = await getLaporanByPeternak(peternakId);

    const stats = {
      totalLaporan: laporan.length,
      progressPersentase: (laporan.length / PROGRAM_DURATION_QUARTERS) * 100,
      laporanTerakhir: laporan.length > 0 ? laporan[laporan.length - 1] : null,
      nextQuarter:
        laporan.length < PROGRAM_DURATION_QUARTERS ? laporan.length + 1 : null,
      programSelesai: laporan.length >= PROGRAM_DURATION_QUARTERS,
    };

    return stats;
  } catch (error) {
    console.error("Error getting laporan stats:", error);
    throw error;
  }
};
