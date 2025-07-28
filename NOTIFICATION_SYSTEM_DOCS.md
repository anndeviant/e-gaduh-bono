# Sistem Notifikasi CRUD Laporan

## Komponen Notifikasi yang Dibuat

### 1. **NotificationToast.jsx** - Komponen UI Notifikasi

Komponen toast notification yang responsive dan dapat dikustomisasi dengan berbagai jenis:

- ✅ **Success** (hijau) - untuk operasi berhasil
- ❌ **Error** (merah) - untuk error/kesalahan
- ⚠️ **Warning** (kuning) - untuk peringatan
- ℹ️ **Info** (biru) - untuk informasi

**Fitur:**

- Auto-hide dengan timer yang bisa dikustomisasi
- Posisi yang bisa diatur (top-right, top-left, dll)
- Animasi masuk dan keluar yang smooth
- Tombol close manual
- Icon yang sesuai dengan jenis notifikasi

### 2. **useLaporanNotification.js** - Hook Khusus Laporan

Hook yang menyediakan notifikasi khusus untuk operasi CRUD laporan:

```javascript
const {
  notification,
  clearNotification,

  // CRUD Operations
  notifyCreateSuccess, // ✅ Laporan berhasil dibuat
  notifyCreateError, // ❌ Gagal membuat laporan
  notifyLoadSuccess, // ℹ️ Data berhasil dimuat
  notifyLoadError, // ❌ Gagal memuat data
  notifyUpdateSuccess, // ✅ Laporan berhasil diperbarui
  notifyUpdateError, // ❌ Gagal update laporan
  notifyDeleteSuccess, // ⚠️ Laporan berhasil dihapus
  notifyDeleteError, // ❌ Gagal hapus laporan

  // Validation & Confirmation
  notifyValidationError, // ⚠️ Data tidak valid
  notifyActionConfirm, // ℹ️ Konfirmasi aksi sedang berjalan

  // Program Status
  notifyProgramUpdate, // ✅ Status program diperbarui

  // Generic
  success,
  error,
  warning,
  info,
} = useLaporanNotification();
```

### 3. **NotificationContext.jsx** - Context Global (Opsional)

Provider untuk notifikasi global yang bisa digunakan di seluruh aplikasi.

## Implementasi di Komponen

### **LaporanTriwulanForm.jsx**

```jsx
// Import hook
import { useLaporanNotification } from "../../hooks/useLaporanNotification";
import NotificationToast from "../common/NotificationToast";

// Dalam komponen
const {
  notification,
  clearNotification,
  notifyCreateSuccess,
  notifyCreateError,
  notifyUpdateSuccess,
  notifyUpdateError,
  notifyValidationError,
  notifyActionConfirm,
} = useLaporanNotification();

// Validasi form
const validateForm = () => {
  // ... validasi logic
  if (Object.keys(newErrors).length > 0) {
    const firstError = Object.values(newErrors)[0];
    notifyValidationError(firstError); // ⚠️ Tampilkan error validasi
  }
  return Object.keys(newErrors).length === 0;
};

// Submit form
const handleSubmit = async (e) => {
  try {
    // Show processing notification
    notifyActionConfirm("Menyimpan", peternakData?.namaLengkap);

    // ... save logic

    if (laporan) {
      notifyUpdateSuccess(peternakName, quarter, year); // ✅ Update berhasil
    } else {
      notifyCreateSuccess(peternakName, quarter, year); // ✅ Create berhasil
    }
  } catch (error) {
    if (laporan) {
      notifyUpdateError(error.message); // ❌ Update gagal
    } else {
      notifyCreateError(error.message); // ❌ Create gagal
    }
  }
};

// Render notification
return (
  <div>
    {/* Form content */}

    <NotificationToast
      notification={notification}
      onClose={clearNotification}
      position="top-right"
      autoHideDuration={5000}
    />
  </div>
);
```

### **LaporanPeternak.jsx**

```jsx
// Load data dengan notifikasi
const fetchData = async () => {
  try {
    // ... fetch logic

    notifyLoadSuccess(totalLaporan); // ℹ️ Data berhasil dimuat
  } catch (error) {
    notifyLoadError(error.message); // ❌ Gagal memuat data
  }
};

// Delete dengan notifikasi
const handleDeleteLaporan = async () => {
  try {
    notifyActionConfirm("Menghapus laporan", peternakName); // ℹ️ Proses hapus

    await deleteLaporan(deletingLaporan.id);

    notifyDeleteSuccess(peternakName, quarter, year); // ⚠️ Hapus berhasil
  } catch (error) {
    notifyDeleteError(error.message); // ❌ Hapus gagal
  }
};
```

## Jenis Notifikasi dan Kapan Menggunakannya

### ✅ **Success Notifications**

- Laporan berhasil dibuat/disimpan
- Laporan berhasil diperbarui
- Status program berhasil diubah
- Import/export berhasil

```javascript
notifyCreateSuccess("Budi Santoso", 2, 2025);
// "Laporan Triwulan 2 tahun 2025 berhasil dibuat"
```

### ❌ **Error Notifications**

- Gagal menyimpan karena error server
- Gagal memuat data dari database
- Validasi server gagal
- Network error

```javascript
notifyCreateError("Connection timeout");
// "Gagal menyimpan laporan. Silakan coba lagi."
// Details: "Connection timeout"
```

### ⚠️ **Warning Notifications**

- Data berhasil dihapus (konfirmasi)
- Validasi client-side gagal
- Operasi batch sebagian berhasil
- Data akan ditimpa

```javascript
notifyValidationError("Jumlah awal harus diisi");
// "Jumlah awal harus diisi"
// Title: "Data Tidak Valid"
```

### ℹ️ **Info Notifications**

- Data berhasil dimuat
- Proses sedang berjalan
- Status informasi
- Konfirmasi aksi

```javascript
notifyLoadSuccess(15);
// "15 laporan berhasil dimuat"
// Title: "Data Dimuat"
```

## Kustomisasi Notifikasi

### **Durasi Auto-Hide**

```jsx
<NotificationToast
  autoHideDuration={3000} // 3 detik
  // atau 0 untuk tidak auto-hide
/>
```

### **Posisi**

```jsx
<NotificationToast
  position="top-left" // top-left, top-center, top-right
  // position="bottom-left"  // bottom-left, bottom-center, bottom-right
/>
```

### **Custom Message**

```javascript
showNotification("success", "Pesan custom", "Judul Custom", "Detail tambahan");
```

## Testing Notifikasi

### **Test Cases**

1. ✅ Create laporan berhasil → Success notification
2. ❌ Create laporan gagal (network error) → Error notification
3. ⚠️ Validasi form gagal → Warning notification
4. ℹ️ Load data → Info notification
5. ✅ Update laporan → Success notification
6. ⚠️ Delete laporan → Warning notification
7. 🔄 Multiple notifications → Queue properly

### **Manual Testing**

1. Buat laporan dengan data valid → lihat success toast
2. Buat laporan tanpa isi field → lihat warning toast
3. Disconnect internet → coba save → lihat error toast
4. Delete laporan → lihat warning toast
5. Load halaman → lihat info toast

## Best Practices

### **1. Konsistensi Pesan**

- Gunakan pesan yang clear dan actionable
- Sertakan context (nama peternak, triwulan)
- Berikan detail error yang membantu troubleshooting

### **2. Timing**

- Show notification segera setelah aksi
- Auto-hide untuk success/info (5s)
- Manual close untuk error/warning (user decision)

### **3. User Experience**

- Jangan spam notifikasi
- Group similar notifications
- Provide clear next steps

### **4. Error Handling**

- Catch semua async operations
- Provide fallback messages
- Log errors for debugging

## Integrasi dengan Backend

Notifikasi terintegrasi dengan semua operasi CRUD:

```javascript
// laporanService.js sudah memiliki error handling
export const createLaporan = async (data) => {
  try {
    const result = await addDoc(collection(db, COLLECTION_LAPORAN), data);
    return result; // Success akan ditangani di komponen
  } catch (error) {
    throw error; // Error akan ditangkap dan dinotifikasi
  }
};
```

Sistem notifikasi ini memberikan feedback real-time kepada user untuk semua operasi CRUD laporan, meningkatkan user experience dan membantu debugging issues.
