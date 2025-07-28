import { useNotificationToast } from "../components/common/NotificationToast";

export const useLaporanNotification = () => {
  const { notification, clearNotification, success, error, warning, info } =
    useNotificationToast();

  // Notifikasi untuk CREATE laporan
  const notifyCreateSuccess = (peternakName, reportNumber, year) => {
    success(
      `Laporan ke-${reportNumber} tahun ${year} berhasil dibuat`,
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
    info(`Total: ${count} Laporan`, "Data Dimuat");
  };

  const notifyLoadError = (errorMessage) => {
    error("Gagal memuat data laporan", "Error Memuat Data", errorMessage);
  };

  // Notifikasi untuk UPDATE laporan
  const notifyUpdateSuccess = (peternakName, reportNumber, year) => {
    success(
      `Laporan ke-${reportNumber} tahun ${year} berhasil diperbarui`,
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
  const notifyDeleteSuccess = (peternakName, reportNumber, year) => {
    warning(
      `Laporan ke-${reportNumber} tahun ${year} telah dihapus`,
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

    // Generic notifications
    success,
    error,
    warning,
    info,
  };
};
