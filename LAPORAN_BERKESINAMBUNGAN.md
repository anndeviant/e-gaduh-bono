# Sistem Laporan Berkesinambungan

## Deskripsi

Sistem laporan berkesinambungan memungkinkan data jumlah ternak mengalir secara otomatis dari satu triwulan ke triwulan berikutnya, menciptakan kontinuitas data yang akurat sepanjang periode program gaduhan.

## Cara Kerja

### 1. Laporan Pertama (Triwulan 1)

- **Jumlah Awal**: Diambil dari data registrasi peternak (`jumlahTernakAwal`)
- **Jumlah Saat Ini**: Dihitung otomatis = Awal + Lahir - Mati - Dijual

### 2. Laporan Berikutnya (Triwulan 2-8)

- **Jumlah Awal**: Otomatis diambil dari `jumlahTernakSaatIni` triwulan sebelumnya
- **Jumlah Saat Ini**: Dihitung otomatis = Awal + Lahir - Mati - Dijual

## Contoh Flow Data

```
Registrasi Peternak: 5 kambing

Triwulan 1:
├── Awal: 5 (dari registrasi)
├── Lahir: 2
├── Mati: 0
├── Dijual: 1
└── Saat Ini: 6

Triwulan 2:
├── Awal: 6 (dari Triwulan 1)
├── Lahir: 3
├── Mati: 1
├── Dijual: 0
└── Saat Ini: 8

Triwulan 3:
├── Awal: 8 (dari Triwulan 2)
├── Lahir: 4
├── Mati: 2
├── Dijual: 2
└── Saat Ini: 8

... dan seterusnya sampai Triwulan 8
```

## Fitur Validasi

### 1. Batas Maksimal Triwulan

- Program gaduhan maksimal 8 triwulan (2 tahun)
- Sistem otomatis mencegah pembuatan laporan ke-9

### 2. Validasi Duplikasi

- Tidak boleh ada 2 laporan untuk triwulan dan tahun yang sama
- Sistem akan menolak duplikasi dengan pesan error

### 3. Validasi Logika Bisnis

- Total kambing mati + dijual tidak boleh melebihi awal + lahir
- Tanggal laporan tidak boleh di masa depan

## Manfaat Sistem

### 1. Akurasi Data

- Eliminasi kesalahan input manual
- Data konsisten antar periode

### 2. Efisiensi

- Peternak tidak perlu mengingat jumlah ternak periode sebelumnya
- Admin tidak perlu mengecek data manual

### 3. Audit Trail

- Jejak data yang jelas dari awal hingga akhir program
- Mudah melacak perkembangan ternak

## Implementasi Teknis

### File yang Terlibat

1. `LaporanTriwulanForm.jsx` - Form laporan dengan logika berkesinambungan
2. `laporanService.js` - Validasi dan CRUD operations
3. `LaporanPeternak.jsx` - Interface manajemen laporan

### Fungsi Utama

- `getLaporanByPeternak()` - Ambil semua laporan peternak
- `createLaporan()` - Buat laporan baru dengan validasi
- Auto-calculate jumlah saat ini dengan `useEffect`

### Database Schema

```javascript
{
  idPeternak: "string",
  quarter: 1-4,
  year: 2024/2025,
  jumlahTernakAwal: number,     // Auto dari laporan sebelumnya
  jumlahLahir: number,
  jumlahKematian: number,
  jumlahTerjual: number,
  jumlahTernakSaatIni: number,  // Auto calculated
  // ... fields lainnya
}
```

## Troubleshooting

### Error: "Sudah mencapai maksimal 8 triwulan"

- Solusi: Program peternak sudah selesai, tidak bisa menambah laporan lagi

### Error: "Laporan untuk triwulan X tahun Y sudah ada"

- Solusi: Edit laporan yang sudah ada atau pilih triwulan lain

### Jumlah awal tidak sesuai

- Periksa laporan triwulan sebelumnya
- Pastikan `jumlahTernakSaatIni` laporan sebelumnya benar
