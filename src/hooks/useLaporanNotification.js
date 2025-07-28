import { useNotificationToast } from "../components/common/NotificationToast";

export const useLaporanNotification = () => {
  const { notification, clearNotification, success, error, warning, info } =
    useNotificationToast();

  // Notifikasi untuk CREATE laporan
  const notifyCreateSuccess = (peternakName, quarter, year) => {
    success(
      `Laporan Triwulan ${quarter} tahun ${year} berhasil dibuat`,
      "Laporan Tersimpan",
      `Data laporan untuk ${peternakName} telah disimpan ke database`
    );
  };

  const notifyCreateError = (errorMessage) => {
    error(
      "Gagal menyimpan laporan. Silakan coba lagi.",
      "Gagal Membuat Laporan",
      errorMessage
    );
  };

  // Notifikasi untuk READ/LOAD laporan
  const notifyLoadSuccess = (count) => {
    info(
      `${count} laporan berhasil dimuat`,
      "Data Dimuat",
      "Laporan terbaru telah diperbarui"
    );
  };

  const notifyLoadError = (errorMessage) => {
    error("Gagal memuat data laporan", "Error Memuat Data", errorMessage);
  };

  // Notifikasi untuk UPDATE laporan
  const notifyUpdateSuccess = (peternakName, quarter, year) => {
    success(
      `Laporan Triwulan ${quarter} tahun ${year} berhasil diperbarui`,
      "Laporan Diperbarui",
      `Perubahan data laporan ${peternakName} telah disimpan`
    );
  };

  const notifyUpdateError = (errorMessage) => {
    error(
      "Gagal memperbarui laporan. Silakan coba lagi.",
      "Gagal Update Laporan",
      errorMessage
    );
  };

  // Notifikasi untuk DELETE laporan
  const notifyDeleteSuccess = (peternakName, quarter, year) => {
    warning(
      `Laporan Triwulan ${quarter} tahun ${year} telah dihapus`,
      "Laporan Dihapus",
      `Data laporan ${peternakName} telah dihapus dari database`
    );
  };

  const notifyDeleteError = (errorMessage) => {
    error(
      "Gagal menghapus laporan. Silakan coba lagi.",
      "Gagal Hapus Laporan",
      errorMessage
    );
  };

  // Notifikasi untuk validasi
  const notifyValidationError = (message) => {
    warning(
      message,
      "Data Tidak Valid",
      "Mohon periksa kembali data yang diinput"
    );
  };

  // Notifikasi untuk konfirmasi aksi
  const notifyActionConfirm = (action, peternakName) => {
    info(
      `Aksi ${action} sedang diproses untuk ${peternakName}`,
      "Memproses...",
      "Harap tunggu sebentar"
    );
  };

  // Notifikasi untuk status program
  const notifyProgramUpdate = (peternakName, status) => {
    success(
      `Status program ${peternakName} diperbarui menjadi "${status}"`,
      "Status Program Diperbarui",
      "Perubahan status kinerja telah disimpan"
    );
  };

  // Notifikasi khusus untuk batch operations
  const notifyBatchSuccess = (operation, count) => {
    success(
      `${operation} berhasil untuk ${count} laporan`,
      "Operasi Batch Berhasil",
      "Semua data telah diproses"
    );
  };

  const notifyBatchError = (operation, successCount, errorCount) => {
    warning(
      `${operation}: ${successCount} berhasil, ${errorCount} gagal`,
      "Operasi Batch Sebagian Berhasil",
      "Beberapa data mungkin perlu diproses ulang"
    );
  };

  return {
    notification,
    clearNotification,

    // CRUD Operations
    notifyCreateSuccess,
    notifyCreateError,
    notifyLoadSuccess,
    notifyLoadError,
    notifyUpdateSuccess,
    notifyUpdateError,
    notifyDeleteSuccess,
    notifyDeleteError,

    // Validation & Confirmation
    notifyValidationError,
    notifyActionConfirm,

    // Program Status
    notifyProgramUpdate,

    // Batch Operations
    notifyBatchSuccess,
    notifyBatchError,

    // Generic notifications
    success,
    error,
    warning,
    info,
  };
};
