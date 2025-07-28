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
import { getPeternakById } from "./peternakService";

const COLLECTION_LAPORAN = "laporan";

// CREATE
export const createLaporan = async (laporanData) => {
  try {
    // Validasi field wajib
    const requiredFields = [
      "idPeternak",
      "quarter",
      "year",
      "startDate",
      "endDate",
      "displayPeriod",
      "jumlahTernakAwal",
      "jumlahTernakSaatIni",
      "targetPengembalian",
      "tanggalLaporan",
    ];
    for (const field of requiredFields) {
      if (
        laporanData[field] === undefined ||
        laporanData[field] === null ||
        laporanData[field] === ""
      ) {
        throw new Error(`Field ${field} wajib diisi`);
      }
    }

    // Pastikan tanggal laporan menggunakan format yang benar
    const finalData = {
      ...laporanData,
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
    const laporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      orderBy("year", "desc"),
      orderBy("quarter", "desc"),
      orderBy("tanggalLaporan", "desc")
    );
    const querySnapshot = await getDocs(laporanQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting all laporan:", error);
    throw error;
  }
};

// READ ALL BY PETERNNAK
export const getLaporanByPeternak = async (idPeternak) => {
  try {
    const laporanQuery = query(
      collection(db, COLLECTION_LAPORAN),
      where("idPeternak", "==", idPeternak),
      orderBy("year", "asc"),
      orderBy("quarter", "asc")
    );
    const querySnapshot = await getDocs(laporanQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting laporan by peternak:", error);
    throw error;
  }
};

// READ BY ID
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
    const finalUpdateData = {
      ...updateData,
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

export const getNextAllowedQuarter = async (idPeternak) => {
  try {
    const laporanList = await getLaporanByPeternak(idPeternak);
    if (!laporanList.length) {
      // Belum ada laporan, mulai dari Q1 tahun sekarang
      const now = new Date();
      return { quarter: 1, year: now.getFullYear() };
    }
    // Cari laporan terakhir
    const last = laporanList[laporanList.length - 1];
    let nextQuarter = Number(last.quarter) + 1;
    let nextYear = Number(last.year);
    if (nextQuarter > 4) {
      nextQuarter = 1;
      nextYear += 1;
    }
    return { quarter: nextQuarter, year: nextYear };
  } catch (error) {
    console.error("Error getting next allowed quarter:", error);
    throw error;
  }
};

export const calculatePrefillData = async (idPeternak) => {
  try {
    const laporanList = await getLaporanByPeternak(idPeternak);
    if (!laporanList.length) {
      // Prefill dari data peternak
      const peternak = await getPeternakById(idPeternak);
      return {
        jumlahTernakAwal: peternak.jumlahTernakAwal || 0,
        jumlahTernakSaatIni: peternak.jumlahTernakSaatIni || 0,
        targetPengembalian: peternak.targetPengembalian || 0,
        jumlahKematian: 0,
        jumlahLahir: 0,
        jumlahTerjual: 0,
      };
    }
    // Prefill dari laporan terakhir
    const last = laporanList[laporanList.length - 1];
    return {
      jumlahTernakAwal: last.jumlahTernakSaatIni || 0,
      jumlahTernakSaatIni: last.jumlahTernakSaatIni || 0,
      targetPengembalian: last.targetPengembalian || 0,
      jumlahKematian: 0,
      jumlahLahir: 0,
      jumlahTerjual: 0,
    };
  } catch (error) {
    console.error("Error calculating prefill data:", error);
    throw error;
  }
};
