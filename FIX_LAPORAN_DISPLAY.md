# Fix: Laporan Terakhir Display Bug

## Masalah

Pada tabel "Laporan Monitoring Peternak", kolom "Laporan Terakhir" menampilkan data yang tidak akurat. Contoh:

- Database menunjukkan `jumlahLaporan: 8` untuk peternak "fff"
- Tabel menampilkan "Laporan ke-3" padahal seharusnya "Laporan ke-8"
- Status peternak masih "Mulai" padahal seharusnya "Selesai"

## Penyebab

1. **Display Logic Error**: Tabel menggunakan `getLatestLaporan()` yang mencari laporan terakhir berdasarkan tanggal dari collection `laporan`, bukan menggunakan field `jumlahLaporan` yang tersimpan di data peternak.

2. **Status Tidak Tersinkronisasi**: Peternak yang sudah mencapai 8 laporan belum memiliki status "Selesai" yang sesuai.

## Solusi

### 1. Perbaikan Display Logic (`LaporanPeternak.jsx`)

- **Sebelum**: Menggunakan `latestLaporan.reportNumber` dari query collection laporan
- **Sesudah**: Menggunakan `getTotalLaporanByPeternak()` yang mengambil field `jumlahLaporan` dari data peternak

```jsx
// SEBELUM
{latestLaporan ? (
    <div className="text-sm">
        <div className="font-medium text-gray-900">
            {getLaporanLabel(latestLaporan.reportNumber)}
        </div>
        // ...
    </div>
) : (...)}

// SESUDAH
{(() => {
    const totalLaporan = getTotalLaporanByPeternak(peternak.id);
    const latestLaporan = getLatestLaporan(peternak.id);

    if (totalLaporan > 0) {
        return (
            <div className="text-sm">
                <div className="font-medium text-gray-900">
                    {getLaporanLabel(totalLaporan)}
                </div>
                // ...
            </div>
        );
    }
    // ...
})()}
```

### 2. Auto Update Status Peternak (`laporanService.js`)

- Ditambahkan logic untuk mengubah status peternak menjadi "Selesai" ketika mencapai 8 laporan
- Ditambahkan validasi untuk mencegah pembuatan laporan jika status sudah "Selesai"

```javascript
// Setelah berhasil membuat laporan
if (existingSnapshot.docs.length + 1 >= 8) {
  await updatePeternak(finalData.idPeternak, {
    statusSiklus: "Selesai",
    tanggalSelesai: new Date().toISOString().split("T")[0],
  });
}
```

### 3. Sync Function untuk Data Existing (`peternakService.js`)

- Ditambahkan `syncStatusPeternakSelesai()` untuk mengupdate status peternak yang sudah mencapai 8 laporan
- Diintegrasikan dengan `syncJumlahLaporan()` untuk konsistensi data

### 4. Manual Sync Utility

- **File**: `src/utils/manualSync.js` - untuk sync manual dari browser console
- **File**: `sync-status.js` - untuk sync via Node.js script

## Testing

1. ✅ Tampilan tabel sekarang menampilkan "Laporan ke-8" untuk peternak dengan `jumlahLaporan: 8`
2. ✅ Status peternak otomatis berubah menjadi "Selesai" saat mencapai 8 laporan
3. ✅ Tidak dapat membuat laporan baru jika status sudah "Selesai"
4. ✅ Tanggal laporan terakhir tetap ditampilkan dengan benar

## Cara Menjalankan Sync Manual

### Via Browser Console:

1. Buka halaman admin di browser
2. Tekan F12 → Console
3. Copy-paste isi `src/utils/manualSync.js`
4. Jalankan `manualSyncStatusPeternak()`

### Via Node.js:

```bash
node sync-status.js
```

## Data Consistency

Sekarang data akan konsisten antara:

- Field `jumlahLaporan` di collection `peternak`
- Jumlah dokumen di collection `laporan` per peternak
- Status `statusSiklus` yang sesuai dengan progress program
- Tampilan UI yang akurat di dashboard admin
