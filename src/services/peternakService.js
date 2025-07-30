import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
  writeBatch,
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
    // Menggunakan batch untuk memastikan konsistensi data dan menghindari race condition
    const batch = writeBatch(db);

    // Ambil semua laporan yang terkait dengan peternak ini
    const laporanQuery = query(
      collection(db, "laporan"),
      where("idPeternak", "==", peternakId)
    );
    const laporanSnapshot = await getDocs(laporanQuery);

    // Tambahkan operasi delete untuk semua laporan ke batch
    laporanSnapshot.docs.forEach((laporanDoc) => {
      batch.delete(doc(db, "laporan", laporanDoc.id));
    });

    // Tambahkan operasi delete untuk peternak ke batch
    batch.delete(doc(db, COLLECTION_PETERNAK, peternakId));

    // Commit semua operasi sekaligus untuk konsistensi data
    await batch.commit();

    console.log(
      `Successfully deleted peternak ${peternakId} and ${laporanSnapshot.docs.length} related laporan`
    );
    return {
      success: true,
      deletedLaporan: laporanSnapshot.docs.length,
    };
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
  const peternakRef = doc(db, COLLECTION_PETERNAK, peternakId);
  const peternakDoc = await getDoc(peternakRef);

  if (!peternakDoc.exists()) {
    console.warn(`Peternak dengan ID ${peternakId} tidak ditemukan.`);
    return;
  }

  const peternakData = peternakDoc.data();
  const updatePayload = { jumlahLaporan: actualJumlahLaporan };

  // Jika sudah mencapai 8 laporan, update status menjadi "Selesai"
  if (actualJumlahLaporan >= 8 && peternakData.statusSiklus !== "Selesai") {
    updatePayload.statusSiklus = "Selesai";
    updatePayload.tanggalSelesai =
      peternakData.tanggalSelesai || new Date().toISOString().split("T")[0];
    console.log(
      `Status peternak ${peternakId} diubah menjadi Selesai (8 laporan tercapai)`
    );
  }

  await updateDoc(peternakRef, updatePayload);
};

// Fungsi untuk mengecek dan memperbarui status semua peternak yang sudah selesai
export const syncStatusPeternakSelesai = async () => {
  try {
    console.log("Starting sync status peternak selesai...");

    // Ambil semua peternak
    const peternakSnapshot = await getDocs(collection(db, COLLECTION_PETERNAK));
    const updateResults = [];

    for (const peternakDoc of peternakSnapshot.docs) {
      const peternakData = peternakDoc.data();
      const peternakId = peternakDoc.id;

      // Jika jumlahLaporan >= 8 tapi status bukan "Selesai"
      if (
        peternakData.jumlahLaporan >= 8 &&
        peternakData.statusSiklus !== "Selesai"
      ) {
        try {
          await updatePeternak(peternakId, {
            statusSiklus: "Selesai",
            tanggalSelesai:
              peternakData.tanggalSelesai ||
              new Date().toISOString().split("T")[0],
          });

          updateResults.push({
            id: peternakId,
            nama: peternakData.namaLengkap,
            jumlahLaporan: peternakData.jumlahLaporan,
            status: "updated",
          });

          console.log(
            `Status peternak ${peternakData.namaLengkap} (${peternakId}) diubah menjadi Selesai`
          );
        } catch (error) {
          console.error(`Error updating status peternak ${peternakId}:`, error);
          updateResults.push({
            id: peternakId,
            nama: peternakData.namaLengkap,
            status: "error",
            error: error.message,
          });
        }
      }
    }

    console.log("Sync status peternak selesai completed:", updateResults);
    return updateResults;
  } catch (error) {
    console.error("Error syncing status peternak selesai:", error);
    throw error;
  }
};
