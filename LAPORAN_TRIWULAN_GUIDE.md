# Sistem Laporan Triwulan E-Gaduh Bono

## Overview

Sistem laporan triwulan untuk program peminjaman kambing kepada peternak dengan siklus 2 tahun (8 triwulan).

## Fitur Utama

### 1. Registrasi Peternak dengan Periode Otomatis

- Setiap peternak saat mendaftar otomatis memulai siklus laporan triwulan selama 2 tahun (8 triwulan)
- Tanggal pendaftaran menjadi acuan untuk menghitung periode triwulan
- Default jumlah kambing awal: 5 ekor

### 2. Periode Triwulan Otomatis

- Sistem otomatis menghitung periode berdasarkan tanggal pendaftaran
- Contoh: Daftar 10 Mei 2024
  - Triwulan 1: 10 Mei - 9 Agustus 2024
  - Triwulan 2: 10 Agustus - 9 November 2024
  - Dan seterusnya...

### 3. Validasi Urutan Laporan

- Input laporan tidak boleh lompat ke belakang
- Laporan hanya bisa ditambahkan ke periode triwulan berikutnya dari yang terakhir
- Sistem mencegah pembuatan laporan yang tidak sesuai urutan

### 4. Auto-fill Data Berdasarkan Laporan Sebelumnya

- Jumlah awal periode otomatis diisi dari jumlah_saat_ini laporan sebelumnya
- Untuk triwulan pertama, jumlah awal = jumlahTernakAwal dari registrasi

### 5. Kolom Input Laporan

- **jumlah_awal**: Auto-fill dari laporan sebelumnya (readonly)
- **jumlah_lahir**: Input manual jumlah kambing lahir selama periode
- **jumlah_mati**: Input manual jumlah kambing mati selama periode
- **jumlah_dijual**: Input manual jumlah kambing dijual selama periode
- **jumlah_saat_ini**: Auto-calculate (awal + lahir - mati - dijual)
- **kendala**: Text area untuk kendala yang dihadapi
- **solusi**: Text area untuk solusi yang diambil
- **keterangan**: Text area untuk catatan tambahan

### 6. Sistem Status Kinerja Otomatis

- **Baru**: Status awal saat peternak mendaftar
- **Progress**: Otomatis berubah setelah laporan triwulan pertama dibuat
- **Bagus/Biasa/Kurang**: Status final yang dinilai admin setelah program 2 tahun selesai
- Auto-update status berdasarkan progress laporan
- Admin dapat memberikan penilaian akhir setelah 8 triwulan selesai
- Visual progress bar menampilkan kemajuan program (x/8 triwulan)
- Timeline triwulan dengan status: Selesai, Aktif, Terlewat, Belum Aktif
- Indikator status program: Belum Dimulai, Berjalan, Selesai

## Struktur Data

### Peternak

```javascript
{
  id: string,
  namaLengkap: string,
  nik: string,
  alamat: string,
  nomorTelepon: string,
  email: string,
  jenisKelamin: string,
  statusKinerja: 'Baru' | 'Progress' | 'Bagus' | 'Biasa' | 'Kurang',
  tanggalDaftar: string, // YYYY-MM-DD
  jumlahTernakAwal: number, // default 5
  programAktif: boolean,
  tanggalDibuat: string,
  tanggalUpdate: string
}
```

### Laporan

```javascript
{
  id: string,
  peternakId: string,
  quarterNumber: number, // 1-8
  quarterInfo: {
    quarter: number,
    year: number,
    startDate: string,
    endDate: string,
    displayPeriod: string
  },
  tanggalLaporan: string,
  jumlah_awal: number,
  jumlah_lahir: number,
  jumlah_mati: number,
  jumlah_dijual: number,
  jumlah_saat_ini: number,
  kendala: string,
  solusi: string,
  keterangan: string,
  tanggalDibuat: string,
  tanggalUpdate: string
}
```

## API Services

### LaporanService

- `calculateQuarterPeriods(registrationDate)`: Hitung semua periode triwulan
- `getCurrentQuarterInfo(registrationDate, quarterNumber)`: Info periode tertentu
- `getNextAllowedQuarter(peternakId)`: Quarter berikutnya yang bisa dibuat
- `calculatePrefillData(previousReport)`: Hitung data prefill
- `validateReportSequence(quarterNumber, existingReports)`: Validasi urutan
- `createLaporan(laporanData)`: Buat laporan baru
- `updateLaporan(laporanId, updateData)`: Update laporan
- `deleteLaporan(laporanId)`: Hapus laporan
- `getLaporanByPeternak(peternakId, filters)`: Ambil laporan by peternak
- `getLaporanStats(peternakId)`: Statistik laporan peternak

### PeternakService

- `createPeternak(peternakData)`: Daftar peternak baru
- `updatePeternak(peternakId, updateData)`: Update data peternak
- `deletePeternak(peternakId)`: Hapus peternak
- `getAllPeternak(filters)`: Ambil semua peternak
- `getPeternakById(peternakId)`: Ambil peternak by ID
- `searchPeternak(searchTerm)`: Cari peternak
- `updateStatusProgram(peternakId, statusBaru)`: Update status program
- `updateStatusKinerjaOtomatis(peternakId, totalLaporan, programSelesai)`: Auto-update status
- `updateStatusKinerjaFinal(peternakId, statusFinal)`: Set status final
- `getPeternakStats()`: Statistik peternak

## Komponen UI

### LaporanTriwulanForm

- Form input laporan dengan validasi otomatis
- Auto-fill dan auto-calculate
- Real-time validation

### ProgramProgressIndicator

- Progress bar program 2 tahun
- Timeline visual triwulan
- Status indicators

### StatusKinerjaManager

- Interface penilaian kinerja akhir
- Status progression indicator
- Admin assessment form

### LaporanTable

- Tabel laporan dengan detail
- Action buttons (Edit, Delete)
- Expandable detail sections

## Validasi Bisnis

1. **Status Progression**: Baru → Progress → Bagus/Biasa/Kurang
2. **Auto-Update**: Status berubah otomatis berdasarkan progress laporan
3. **Final Assessment**: Admin menilai setelah program selesai
4. **Periode Maksimal**: Maksimal 8 triwulan per peternak
5. **NIK Unik**: Tidak boleh duplikat NIK
6. **Data Required**: Validasi field wajib

## Penggunaan

### Mendaftarkan Peternak Baru

1. Isi form peternak dengan tanggal daftar
2. Jumlah kambing awal (default 5)
3. Status otomatis diset ke "Baru"
4. Sistem otomatis menghitung periode triwulan

### Membuat Laporan Triwulan

1. Pilih peternak
2. Klik "Tambah Laporan"
3. Sistem otomatis menentukan triwulan berikutnya
4. Isi data dengan prefill otomatis
5. Status otomatis berubah ke "Progress" setelah laporan pertama

### Menilai Kinerja Akhir

1. Tunggu hingga program 2 tahun selesai (8 triwulan)
2. Interface penilaian akan muncul otomatis
3. Pilih status final: Bagus, Biasa, atau Kurang
4. Status peternak menjadi final dan program selesai

### Monitoring Progress

1. Lihat progress indicator di halaman detail peternak
2. Timeline visual menampilkan status setiap triwulan
3. Filter laporan by triwulan/tahun

## Database (Firebase Firestore)

### Collections

- `peternak`: Data peternak
- `laporan`: Data laporan triwulan

### Indexes (Recommended)

- `laporan`: `peternakId`, `quarterNumber`
- `laporan`: `peternakId`, `quarterInfo.year`
- `peternak`: `nik`
- `peternak`: `statusKinerja`

## Error Handling

- Validation errors dengan pesan user-friendly
- Network error handling
- Data consistency checks
- Loading states untuk UX yang baik

## Future Enhancements

1. Notifikasi deadline laporan
2. Export/import data
3. Dashboard analytics
4. Mobile responsiveness
5. Offline support
6. Backup/restore system
