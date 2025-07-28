# Sistem Laporan Berkesinambungan - Update ke "Laporan ke-"

## Perubahan Konsep

Sistem telah diubah dari konsep "Triwulan" menjadi "Laporan ke-" untuk memberikan fleksibilitas yang lebih baik:

### Sebelum (Triwulan)

- Triwulan 1, 2, 3, 4 dengan batasan periode waktu
- Harus mengikuti siklus kalender (Jan-Mar, Apr-Jun, dll)
- Maksimal 4 triwulan per tahun

### Sesudah (Laporan ke-)

- Laporan ke-1 sampai ke-8 tanpa batasan periode waktu
- Fleksibel dalam penjadwalan
- Lebih mudah dipahami sebagai urutan laporan

## Cara Kerja Sistem

### 1. Laporan Pertama (Laporan ke-1)

- **Jumlah Awal**: Diambil dari data registrasi peternak
- **Jumlah Saat Ini**: Dihitung otomatis = Awal + Lahir - Mati - Dijual

### 2. Laporan Berikutnya (Laporan ke-2 s/d ke-8)

- **Jumlah Awal**: Otomatis diambil dari `jumlahTernakSaatIni` laporan sebelumnya
- **Jumlah Saat Ini**: Dihitung otomatis = Awal + Lahir - Mati - Dijual

## Database Schema

```javascript
{
  idPeternak: "string",
  reportNumber: 1-8,           // Menggantikan quarter
  year: 2024/2025,
  jumlahTernakAwal: number,
  jumlahLahir: number,
  jumlahKematian: number,
  jumlahTerjual: number,
  jumlahTernakSaatIni: number,
  displayPeriod: "Laporan ke-1 2025",
  // ... fields lainnya
}
```

## Perubahan UI

### Label dan Teks

- "Triwulan 1" → "Laporan ke-1"
- "Triwulan II" → "Laporan ke-2"
- "Filter Triwulan" → "Filter Laporan"

### Dropdown Filter

- Tidak lagi ada periode waktu (Jan-Mar, Apr-Jun)
- Fokus pada urutan laporan (ke-1, ke-2, dst)

### Notifikasi

- "Laporan Triwulan X berhasil dibuat" → "Laporan ke-X berhasil dibuat"

## Validasi

### 1. Duplikasi

- Tidak boleh ada 2 "Laporan ke-X" untuk peternak yang sama
- Lebih sederhana karena tidak perlu cek tahun

### 2. Urutan

- Sistem memastikan laporan dibuat berurutan
- Laporan ke-3 tidak bisa dibuat sebelum ada Laporan ke-2

### 3. Maksimal

- Tetap maksimal 8 laporan per peternak (2 tahun program)

## Keuntungan Perubahan

### 1. Fleksibilitas Waktu

- Tidak terikat periode kalendar
- Admin bisa membuat laporan kapan saja

### 2. Kemudahan Pemahaman

- "Laporan ke-3" lebih mudah dipahami daripada "Triwulan III"
- Urutan yang jelas dan linear

### 3. Konsistensi Data

- Tetap mempertahankan kontinuitas data
- Sistem berkesinambungan tetap berjalan

## Files yang Diubah

1. **LaporanForm.jsx** (renamed dari LaporanTriwulanForm.jsx)
2. **laporanService.js** - Validasi dan query database
3. **LaporanPeternak.jsx** - Interface utama
4. **LaporanTable.jsx** - Tampilan tabel laporan
5. **AllLaporanTable.jsx** - Tampilan semua laporan
6. **useLaporanNotification.js** - Pesan notifikasi

## Migrasi Data

Untuk data existing yang masih menggunakan `quarter`, sistem tetap compatible dengan:

```javascript
reportNumber: laporan.reportNumber || laporan.quarter || laporan.quarterNumber;
```

Ini memastikan backward compatibility selama masa transisi.
