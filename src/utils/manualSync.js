// Manual sync utility untuk browser console
// Copy-paste kode ini ke browser console untuk menjalankan sync status peternak

async function manualSyncStatusPeternak() {
  try {
    // Import yang diperlukan (sudah tersedia di aplikasi)
    const { getAllPeternak, updatePeternak } = await import(
      "../services/peternakService"
    );

    console.log("🔄 Memulai sinkronisasi status peternak...");

    // Ambil semua data peternak
    const peternakList = await getAllPeternak();
    const updateResults = [];
    let totalUpdated = 0;

    for (const peternak of peternakList) {
      console.log(
        `🔍 Memeriksa peternak: ${peternak.namaLengkap} (${peternak.id})`
      );
      console.log(`   - Jumlah Laporan: ${peternak.jumlahLaporan || 0}`);
      console.log(`   - Status Saat Ini: ${peternak.statusSiklus}`);

      // Jika jumlahLaporan >= 8 tapi status bukan "Selesai"
      if (peternak.jumlahLaporan >= 8 && peternak.statusSiklus !== "Selesai") {
        try {
          await updatePeternak(peternak.id, {
            statusSiklus: "Selesai",
            tanggalSelesai:
              peternak.tanggalSelesai || new Date().toISOString().split("T")[0],
          });

          updateResults.push({
            id: peternak.id,
            nama: peternak.namaLengkap,
            jumlahLaporan: peternak.jumlahLaporan,
            statusLama: peternak.statusSiklus,
            statusBaru: "Selesai",
            status: "success",
          });

          totalUpdated++;
          console.log(`   ✅ Status berhasil diubah menjadi "Selesai"`);
        } catch (error) {
          console.error(`   ❌ Error updating peternak ${peternak.id}:`, error);
          updateResults.push({
            id: peternak.id,
            nama: peternak.namaLengkap,
            status: "error",
            error: error.message,
          });
        }
      } else if (peternak.statusSiklus === "Selesai") {
        console.log(`   ℹ️  Status sudah "Selesai" - tidak perlu diubah`);
      } else {
        console.log(
          `   ℹ️  Laporan belum mencapai 8 (${
            peternak.jumlahLaporan || 0
          }/8) - tidak perlu diubah`
        );
      }
    }

    console.log("\n📊 HASIL SINKRONISASI:");
    console.log(`Total peternak diperiksa: ${peternakList.length}`);
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
    alert(`Sinkronisasi selesai! ${totalUpdated} peternak diperbarui.`);

    // Refresh halaman untuk melihat perubahan
    window.location.reload();

    return updateResults;
  } catch (error) {
    console.error("❌ Error saat sinkronisasi:", error);
    alert("Error saat sinkronisasi: " + error.message);
    throw error;
  }
}

// Untuk menjalankan sync, panggil:
// manualSyncStatusPeternak();

console.log("📋 Manual sync utility loaded!");
console.log("Untuk menjalankan sync, ketik: manualSyncStatusPeternak()");
