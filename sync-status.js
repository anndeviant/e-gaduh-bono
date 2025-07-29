// Script untuk sync status peternak yang sudah selesai
// Jalankan dengan: node sync-status.js

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// Konfigurasi Firebase (sesuaikan dengan config Anda)
const firebaseConfig = {
  // Ganti dengan konfigurasi Firebase Anda
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function syncStatusPeternakSelesai() {
  try {
    console.log("🔄 Memulai sinkronisasi status peternak...");

    // Ambil semua data peternak
    const peternakSnapshot = await getDocs(collection(db, "peternak"));
    const updateResults = [];
    let totalUpdated = 0;

    for (const peternakDoc of peternakSnapshot.docs) {
      const peternakData = peternakDoc.data();
      const peternakId = peternakDoc.id;

      console.log(
        `🔍 Memeriksa peternak: ${peternakData.namaLengkap} (${peternakId})`
      );
      console.log(`   - Jumlah Laporan: ${peternakData.jumlahLaporan || 0}`);
      console.log(`   - Status Saat Ini: ${peternakData.statusSiklus}`);

      // Jika jumlahLaporan >= 8 tapi status bukan "Selesai"
      if (
        peternakData.jumlahLaporan >= 8 &&
        peternakData.statusSiklus !== "Selesai"
      ) {
        try {
          const updateData = {
            statusSiklus: "Selesai",
            tanggalSelesai:
              peternakData.tanggalSelesai ||
              new Date().toISOString().split("T")[0],
          };

          await updateDoc(doc(db, "peternak", peternakId), updateData);

          updateResults.push({
            id: peternakId,
            nama: peternakData.namaLengkap,
            jumlahLaporan: peternakData.jumlahLaporan,
            statusLama: peternakData.statusSiklus,
            statusBaru: "Selesai",
            status: "success",
          });

          totalUpdated++;
          console.log(`   ✅ Status berhasil diubah menjadi "Selesai"`);
        } catch (error) {
          console.error(`   ❌ Error updating peternak ${peternakId}:`, error);
          updateResults.push({
            id: peternakId,
            nama: peternakData.namaLengkap,
            status: "error",
            error: error.message,
          });
        }
      } else if (peternakData.statusSiklus === "Selesai") {
        console.log(`   ℹ️  Status sudah "Selesai" - tidak perlu diubah`);
      } else {
        console.log(
          `   ℹ️  Laporan belum mencapai 8 (${
            peternakData.jumlahLaporan || 0
          }/8) - tidak perlu diubah`
        );
      }
    }

    console.log("\n📊 HASIL SINKRONISASI:");
    console.log(`Total peternak diperiksa: ${peternakSnapshot.docs.length}`);
    console.log(`Total status yang diubah: ${totalUpdated}`);

    if (updateResults.length > 0) {
      console.log("\n📋 Detail Perubahan:");
      updateResults.forEach((result, index) => {
        console.log(`${index + 1}. ${result.nama} (${result.id})`);
        if (result.status === "success") {
          console.log(`   Status: ${result.statusLama} → ${result.statusBaru}`);
          console.log(`   Jumlah Laporan: ${result.jumlahLaporan}`);
        } else {
          console.log(`   Error: ${result.error}`);
        }
      });
    }

    console.log("\n✅ Sinkronisasi selesai!");
    return updateResults;
  } catch (error) {
    console.error("❌ Error saat sinkronisasi:", error);
    throw error;
  }
}

// Jalankan script
if (import.meta.url === `file://${process.argv[1]}`) {
  syncStatusPeternakSelesai()
    .then(() => {
      console.log("🎉 Script selesai dijalankan!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Script gagal:", error);
      process.exit(1);
    });
}

export { syncStatusPeternakSelesai };
