import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import LogoutModal from '../../components/admin/LogoutModal';
import { useLogoutModal } from '../../hooks/useLogoutModal';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import LaporanTable from '../../components/admin/LaporanTable';
import AllLaporanTable from '../../components/admin/AllLaporanTable';
import LaporanForm from '../../components/admin/LaporanForm';
import CommonDeleteModal from '../../components/common/CommonDeleteModal';
import CascadeUpdateModal from '../../components/common/CascadeUpdateModal';
import { Plus, ArrowLeft, User, Eye } from 'lucide-react';
import { getAllPeternak } from '../../services/peternakService';
import {
    getAllLaporan,
    getLaporanByPeternak,
    createLaporan,
    updateLaporan,
    deleteLaporan,
    performAutoSync,
    forceSync
} from '../../services/laporanService';
import useNotification from '../../hooks/useNotification';
import Notification from '../../components/common/Notification';

const LaporanPeternak = () => {
    const navigate = useNavigate();
    const [peternakData, setPeternakData] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [laporanData, setLaporanData] = useState([]); // untuk detail view per-peternak (filtered data)
    const [allLaporanData, setAllLaporanData] = useState([]); // untuk calculation & AllLaporanTable (semua data)
    const [loading, setLoading] = useState(true);
    const [selectedPeternakFilter, setSelectedPeternakFilter] = useState(''); // untuk dropdown filter
    const [selectedPeternakId, setSelectedPeternakId] = useState(null);
    const [selectedLaporan, setSelectedLaporan] = useState('');
    const [showAllLaporan, setShowAllLaporan] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [viewMode, setViewMode] = useState('peternak'); // 'peternak', 'laporan', 'add', 'edit'
    const [editingLaporan, setEditingLaporan] = useState(null);
    const [deletingLaporan, setDeletingLaporan] = useState(null);
    const [showCascadeModal, setShowCascadeModal] = useState(false);
    const [cascadeInfo, setCascadeInfo] = useState(null);

    // Logout modal hook
    const {
        isLogoutModalOpen,
        userToLogout,
        openLogoutModal,
        closeLogoutModal,
        confirmLogout
    } = useLogoutModal();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);

    // Notification hook
    const {
        notification,
        showSuccess,
        showError,
        showInfo,
        hideNotification
    } = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Ambil semua peternak
                const peternakList = await getAllPeternak();
                setPeternakData(peternakList);

                // Selalu ambil semua laporan terlebih dahulu untuk menghitung total per peternak
                const allLaporanList = await getAllLaporan();
                setAllLaporanData(allLaporanList);

                // Auto-sync jumlahLaporan di background untuk memastikan data konsisten
                // Menggunakan sistem yang lebih reliable berdasarkan interval waktu
                try {
                    const syncResult = await performAutoSync();
                    if (syncResult.performed) {
                        console.log('Auto-sync completed successfully');
                        // Refresh data peternak setelah sync
                        const updatedPeternakList = await getAllPeternak();
                        setPeternakData(updatedPeternakList);
                        showInfo('Sinkronisasi Otomatis', 'Data peternak telah disinkronkan');
                    }
                } catch (syncError) {
                    console.error('Auto-sync failed, but continuing with normal flow:', syncError);
                    // Tidak menampilkan error ke user karena ini adalah background process
                }

                // Jika filter peternak dipilih, ambil laporan dari firebase
                if (selectedPeternakFilter) {
                    const laporanList = await getLaporanByPeternak(selectedPeternakFilter);
                    setLaporanData(laporanList);

                    // Show success notification untuk laporan yang difilter
                    showInfo('Data Dimuat', `Total: ${laporanList.length} laporan`);
                } else {
                    // Jika tidak ada filter, kosongkan laporanData
                    setLaporanData([]);

                    // Show success notification untuk semua laporan
                    showInfo('Data Dimuat', `Total: ${allLaporanList.length} laporan`);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                showError('Error Memuat Data', 'Gagal memuat data laporan');
            }
            setLoading(false);
        };

        // Check authentication
        const user = localStorage.getItem('adminUser');
        if (!user) {
            navigate('/admin/login');
            return;
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, selectedPeternakFilter, showAllLaporan]);

    const getPeternakById = (peternakId) => {
        return peternakData.find(p => p.id === peternakId);
    };

    const getPeternakLaporan = (peternakId) => {
        // Gunakan allLaporanData untuk mendapatkan semua laporan peternak, bukan laporanData yang mungkin difilter
        return allLaporanData.filter(laporan => laporan.idPeternak === peternakId);
    };

    const getLatestLaporan = (peternakId) => {
        const laporan = getPeternakLaporan(peternakId);
        return laporan.length > 0 ? laporan[laporan.length - 1] : null;
    };

    const getTotalLaporanByPeternak = (peternakId) => {
        // Ambil data peternak untuk mendapatkan jumlahLaporan dari database
        const peternakData = getPeternakById(peternakId);

        // Jika field jumlahLaporan ada di database, gunakan itu
        if (peternakData && typeof peternakData.jumlahLaporan === 'number') {
            return peternakData.jumlahLaporan;
        }

        // Fallback: hitung dari laporan yang ada (untuk data lama yang belum punya field jumlahLaporan)
        return getPeternakLaporan(peternakId).length;
    };

    const getLaporanLabel = (laporanNumber) => {
        return `Laporan ke-${laporanNumber}`;
    };

    // Filter data
    const filteredPeternak = selectedPeternakFilter
        ? peternakData.filter(peternak => peternak.id === selectedPeternakFilter)
        : peternakData;

    // Prepare options for SearchableDropdown
    const peternakOptions = peternakData.map(peternak => ({
        value: peternak.id,
        label: peternak.namaLengkap,
        subtitle: `${peternak.nomorTelepon || 'No. HP tidak tersedia'} • ${getTotalLaporanByPeternak(peternak.id)} laporan`,
    }));

    const defaultPeternakOption = {
        value: '',
        label: 'Tampilkan Semua Peternak',
        subtitle: `${peternakData.length} peternak total`
    };

    // Options for Laporan filter
    const laporanOptions = [
        { value: '', label: 'Semua Laporan', subtitle: 'Tampilkan semua laporan' },
        { value: '1', label: 'Laporan ke-1', subtitle: 'Laporan pertama' },
        { value: '2', label: 'Laporan ke-2', subtitle: 'Laporan kedua' },
        { value: '3', label: 'Laporan ke-3', subtitle: 'Laporan ketiga' },
        { value: '4', label: 'Laporan ke-4', subtitle: 'Laporan keempat' },
        { value: '5', label: 'Laporan ke-5', subtitle: 'Laporan kelima' },
        { value: '6', label: 'Laporan ke-6', subtitle: 'Laporan keenam' },
        { value: '7', label: 'Laporan ke-7', subtitle: 'Laporan ketujuh' },
        { value: '8', label: 'Laporan ke-8', subtitle: 'Laporan kedelapan' }
    ];

    // Options for Tahun filter - REMOVED karena sudah tidak menggunakan field year
    // const tahunOptions = [
    //     { value: '', label: 'Semua Tahun', subtitle: 'Tampilkan semua tahun' },
    //     { value: 2024, label: '2024', subtitle: 'Tahun 2024' },
    //     { value: 2025, label: '2025', subtitle: 'Tahun 2025' }
    // ];

    const getFilteredLaporanByPeternak = (peternakId) => {
        // Gunakan allLaporanData untuk filter, bukan laporanData
        const peternakLaporan = allLaporanData.filter(laporan => laporan.idPeternak === peternakId);

        return peternakLaporan.filter(laporan => {
            const matchLaporan = selectedLaporan === '' || laporan.reportNumber?.toString() === selectedLaporan;
            return matchLaporan;
        });
    };

    const handleToggleAllLaporan = () => {
        setShowAllLaporan(!showAllLaporan);
        if (!showAllLaporan) {
            // Ketika beralih ke mode semua laporan, reset filter
            setSelectedPeternakFilter('');
            setSelectedLaporan('');
        }
    };

    // Event handlers
    const handleViewPeternakDetail = (peternakId) => {
        setSelectedPeternakId(peternakId);
        setViewMode('laporan');
    };

    const handleBackToPeternak = () => {
        setSelectedPeternakId(null);
        setViewMode('peternak');
        setSelectedLaporan('');
        setEditingLaporan(null);
    };

    const handleBackToLaporan = () => {
        setViewMode('laporan');
        setEditingLaporan(null);
    };

    const handleAddLaporan = () => {
        // Validasi: Cek apakah status peternak sudah selesai
        const selectedPeternak = getPeternakById(selectedPeternakId);
        if (selectedPeternak?.statusSiklus === 'Selesai') {
            showError(
                'Tidak Dapat Menambah Laporan',
                'Peternak dengan status "Selesai" tidak dapat menambahkan laporan baru.'
            );
            return;
        }

        setEditingLaporan(null);
        setViewMode('add');
    };

    const handleEditLaporan = (laporan) => {
        // Validasi: Cek apakah status peternak sudah selesai
        const selectedPeternak = getPeternakById(selectedPeternakId);
        if (selectedPeternak?.statusSiklus === 'Selesai') {
            showError(
                'Tidak Dapat Mengedit Laporan',
                'Peternak dengan status "Selesai" tidak dapat mengedit laporan.'
            );
            return;
        }

        setEditingLaporan(laporan);
        setViewMode('edit');
    };

    const handleSaveLaporan = async (formData) => {
        try {
            // Pastikan idPeternak terisi
            if (!selectedPeternakId) {
                alert("Peternak belum dipilih. Tidak bisa menyimpan laporan.");
                return;
            }

            // Pastikan formData memiliki idPeternak
            const dataToSave = {
                ...formData,
                idPeternak: selectedPeternakId
            };

            let reportNumber = 1;
            let result;

            if (viewMode === 'edit' && editingLaporan) {
                // Update laporan yang ada
                reportNumber = editingLaporan.reportNumber;

                // Cek apakah jumlah ternak saat ini berubah untuk notifikasi cascading
                const oldJumlahSaatIni = editingLaporan.jumlahTernakSaatIni || editingLaporan.jumlah_saat_ini;
                const newJumlahSaatIni = dataToSave.jumlahTernakSaatIni;

                result = await updateLaporan(editingLaporan.id, dataToSave);

                // Cek cascading update result
                if (result.cascadeUpdate && result.cascadeUpdate.updatedCount > 0) {
                    setCascadeInfo({
                        ...result.cascadeUpdate,
                        reportNumber: reportNumber,
                        action: 'update'
                    });
                    setShowCascadeModal(true);

                    showSuccess(
                        'Laporan Berhasil Diperbarui!',
                        `Laporan ke-${reportNumber} diperbarui. ${result.cascadeUpdate.updatedCount} laporan berikutnya disesuaikan otomatis.`
                    );
                } else if (oldJumlahSaatIni !== newJumlahSaatIni) {
                    showSuccess(
                        'Laporan Berhasil Diperbarui!',
                        `Laporan ke-${reportNumber} diperbarui. Tidak ada laporan berikutnya yang perlu disesuaikan.`
                    );
                } else {
                    showSuccess(
                        'Laporan Berhasil Diperbarui!',
                        `Laporan ke-${reportNumber} berhasil diperbarui.`
                    );
                }
            } else {
                // Buat laporan baru
                reportNumber = dataToSave.reportNumber || 1;
                await createLaporan(dataToSave);
                showSuccess(
                    'Laporan Berhasil Dibuat!',
                    `Laporan ke-${reportNumber} berhasil dibuat.`
                );
            }

            // Refresh data laporan untuk peternak terpilih
            const laporanList = await getLaporanByPeternak(selectedPeternakId);
            setLaporanData(laporanList);

            // Refresh data keseluruhan untuk tabel AllLaporan
            const allLaporan = await getAllLaporan();
            setAllLaporanData(allLaporan);

            // Redirect kembali ke halaman laporan peternak
            setViewMode('laporan');
            setEditingLaporan(null);

        } catch (error) {
            console.error('Error saving laporan:', error);

            // Notifikasi error yang lebih informatif
            if (error.message.includes('cascading')) {
                showError(
                    'Error Sinkronisasi Data',
                    'Laporan berhasil disimpan, namun terjadi masalah saat memperbarui laporan terkait. Data mungkin perlu disinkronkan ulang.'
                );
            } else {
                showError(
                    'Gagal Menyimpan Laporan',
                    error.message || 'Terjadi kesalahan saat menyimpan laporan'
                );
            }
        }
    };


    const handleCancelForm = () => {
        setViewMode('laporan');
        setEditingLaporan(null);
    };

    const handleShowDeleteConfirm = (laporan) => {
        // Validasi: Cek apakah status peternak sudah selesai
        const selectedPeternak = getPeternakById(selectedPeternakId);
        if (selectedPeternak?.statusSiklus === 'Selesai') {
            showError(
                'Tidak Dapat Menghapus Laporan',
                'Peternak dengan status "Selesai" tidak dapat menghapus laporan.'
            );
            return;
        }

        setDeletingLaporan(laporan);
    };

    const handleDeleteLaporan = async () => {
        if (!deletingLaporan) return;

        setDeleteLoading(true);

        try {
            // Show processing notification
            const peternakName = getPeternakById(deletingLaporan.idPeternak)?.namaLengkap || 'Peternak';
            const reportNumber = deletingLaporan.reportNumber;

            showInfo('Memproses...', `Menghapus laporan untuk ${peternakName}`);

            const result = await deleteLaporan(deletingLaporan.id);

            // Refresh data laporan untuk peternak terpilih
            const laporanList = await getLaporanByPeternak(selectedPeternakId);
            setLaporanData(laporanList);

            // Refresh data keseluruhan untuk tabel AllLaporan
            const allLaporan = await getAllLaporan();
            setAllLaporanData(allLaporan);

            // Cek cascading update result
            if (result.cascadeUpdate && result.cascadeUpdate.updatedCount > 0) {
                setCascadeInfo({
                    ...result.cascadeUpdate,
                    reportNumber: reportNumber,
                    action: 'delete'
                });
                setShowCascadeModal(true);

                showSuccess(
                    'Laporan Berhasil Dihapus!',
                    `Laporan ke-${reportNumber} untuk ${peternakName} telah dihapus. ${result.cascadeUpdate.updatedCount} laporan berikutnya disesuaikan otomatis.`
                );
            } else {
                // Show success notification
                showSuccess(
                    'Laporan Berhasil Dihapus!',
                    `Laporan ke-${reportNumber} untuk ${peternakName} telah dihapus.`
                );
            }

            setDeletingLaporan(null);
        } catch (error) {
            console.error('Error deleting laporan:', error);

            if (error.message.includes('cascading')) {
                showError(
                    'Error Sinkronisasi Data',
                    'Laporan berhasil dihapus, namun terjadi masalah saat memperbarui laporan terkait. Data mungkin perlu disinkronkan ulang.'
                );
            } else {
                showError('Gagal Menghapus Laporan', 'Terjadi kesalahan saat menghapus laporan.');
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    // Manual sync function for admin
    const handleManualSync = async () => {
        setSyncLoading(true);
        try {
            showInfo('Memproses...', 'Melakukan sinkronisasi data jumlah laporan');

            await forceSync();

            // Refresh data peternak setelah sync
            const updatedPeternakList = await getAllPeternak();
            setPeternakData(updatedPeternakList);

            showSuccess('Sinkronisasi Berhasil!', 'Data peternak telah disinkronkan dengan laporan.');
        } catch (error) {
            console.error('Error during manual sync:', error);
            showError('Gagal Sinkronisasi', `Gagal melakukan sinkronisasi: ${error.message}`);
        } finally {
            setSyncLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex overflow-hidden bg-gray-100">
                <Sidebar
                    activeItem="laporan"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    onLogout={openLogoutModal}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Memuat data laporan...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-100">
            <Sidebar
                activeItem="laporan"
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                onLogout={openLogoutModal}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

                <main className="flex-1 overflow-auto p-3 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        {viewMode === 'peternak' ? (
                            // Tampilan List Peternak
                            <>
                                {/* Header */}
                                <div className="mb-6 sm:mb-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Laporan Monitoring Peternak</h1>
                                            <p className="text-gray-600 mt-2">
                                                {showAllLaporan
                                                    ? 'Tampilkan semua laporan dari seluruh peternak'
                                                    : 'Pilih peternak untuk melihat dan mengelola laporan mereka'
                                                }
                                            </p>
                                        </div>
                                        <div className="mt-4 sm:mt-0 flex gap-3">
                                            <button
                                                onClick={handleManualSync}
                                                disabled={syncLoading}
                                                className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                title="Sinkronisasi jumlah laporan dengan data aktual"
                                            >
                                                {syncLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600 mr-2"></div>
                                                        Sync...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        Sync Data
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={handleToggleAllLaporan}
                                                className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${showAllLaporan
                                                    ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                                                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                                    }`}
                                            >
                                                {showAllLaporan ? 'Lihat Per Peternak' : 'Lihat Semua Laporan'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {showAllLaporan ? (
                                    // Tampilan Semua Laporan
                                    <>
                                        <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-6">
                                            <div className="text-sm text-gray-500 mb-4">
                                                Menampilkan <span className="font-medium">{allLaporanData.length}</span> laporan dari seluruh peternak
                                            </div>
                                        </div>
                                        <AllLaporanTable
                                            laporan={allLaporanData}
                                            peternakData={peternakData}
                                        />
                                    </>
                                ) : (
                                    // Tampilan List Peternak (existing)
                                    <>
                                        {/* Search */}
                                        <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-6">
                                            <div className="w-full">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Filter Peternak
                                                </label>
                                                <SearchableDropdown
                                                    options={peternakOptions}
                                                    value={selectedPeternakFilter}
                                                    onChange={setSelectedPeternakFilter}
                                                    placeholder="Pilih peternak..."
                                                    defaultOption={defaultPeternakOption}
                                                    searchPlaceholder="Cari nama peternak..."
                                                    displayKey="label"
                                                    valueKey="value"
                                                    searchKeys={['label', 'subtitle']}
                                                    noResultsText="Tidak ada peternak ditemukan"
                                                />
                                            </div>
                                        </div>

                                        {/* Peternak Table */}
                                        <div className="bg-white rounded-lg shadow overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Peternak
                                                            </th>
                                                            <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Status
                                                            </th>
                                                            <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Laporan Terakhir
                                                            </th>
                                                            <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Detail
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {filteredPeternak.map((peternak) => {
                                                            const latestLaporan = getLatestLaporan(peternak.id);

                                                            return (
                                                                <tr
                                                                    key={peternak.id}
                                                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                                    onClick={() => handleViewPeternakDetail(peternak.id)}
                                                                    title="Klik untuk melihat detail laporan"
                                                                >
                                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <User className="h-9 w-9 sm:h-10 sm:w-10 text-gray-400 bg-gray-100 rounded-full p-2 mr-3 flex-shrink-0" />
                                                                            <div>
                                                                                <div className="text-sm font-medium text-gray-900">
                                                                                    {peternak.namaLengkap}
                                                                                </div>
                                                                                <div className="text-xs text-gray-500 mt-1">
                                                                                    {peternak.nomorTelepon || 'No. HP tidak tersedia'}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                                                                        <div className="flex items-center justify-center">
                                                                            {peternak.statusSiklus === 'Selesai' ? (
                                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                                    Selesai
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                                    Berjalan
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                                                                        {(() => {
                                                                            const totalLaporan = getTotalLaporanByPeternak(peternak.id);
                                                                            const latestLaporan = getLatestLaporan(peternak.id);

                                                                            // Jika ada field jumlahLaporan di database dan > 0, gunakan itu
                                                                            if (totalLaporan > 0) {
                                                                                return (
                                                                                    <div className="text-sm">
                                                                                        <div className="font-medium text-gray-900">
                                                                                            {getLaporanLabel(totalLaporan)}
                                                                                        </div>
                                                                                        <div className="text-gray-500 text-xs">
                                                                                            {latestLaporan ?
                                                                                                new Date(latestLaporan.tanggalLaporan).toLocaleDateString('id-ID') :
                                                                                                '-'
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }

                                                                            // Fallback: jika tidak ada data laporan sama sekali
                                                                            return <span className="text-gray-500 text-sm">-</span>;
                                                                        })()}
                                                                    </td>
                                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                                                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 mx-auto" />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Empty State */}
                                            {filteredPeternak.length === 0 && (
                                                <div className="text-center py-12">
                                                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                        Tidak ada peternak ditemukan
                                                    </h3>
                                                    <p className="text-gray-500">
                                                        Coba ubah kata kunci pencarian.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : viewMode === 'laporan' ? (
                            // Tampilan Detail Laporan Peternak
                            <>
                                {(() => {
                                    const selectedPeternak = getPeternakById(selectedPeternakId);
                                    const laporanPeternak = getFilteredLaporanByPeternak(selectedPeternakId);
                                    const latestLaporan = getLatestLaporan(selectedPeternakId);

                                    return (
                                        <>
                                            {/* Header dengan tombol back */}
                                            <div className="mb-6 sm:mb-8">
                                                <div className="mb-4 sm:mb-4">
                                                    <button
                                                        onClick={handleBackToPeternak}
                                                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-2"
                                                    >
                                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                                        Kembali ke Daftar Peternak
                                                    </button>
                                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                        Laporan {selectedPeternak?.namaLengkap}
                                                    </h1>
                                                    <p className="text-gray-600 mt-2">
                                                        Kelola laporan untuk peternak ini
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Filters and Actions */}
                                            <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-6">
                                                {/* Header Filter Laporan dan Laporan Terakhir */}
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6 mb-2 lg:mb-3 items-center">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">Filter Laporan</h3>
                                                    </div>
                                                    <div className="lg:text-right">
                                                        <div className="inline-block bg-gray-100 rounded-lg px-3 py-2">
                                                            {(() => {
                                                                const totalLaporan = getTotalLaporanByPeternak(selectedPeternakId);
                                                                const latestLaporan = getLatestLaporan(selectedPeternakId);

                                                                if (totalLaporan > 0) {
                                                                    return (
                                                                        <div className="text-sm text-gray-700">
                                                                            <span className="font-medium">Laporan Terakhir: </span>
                                                                            <span className="font-medium text-gray-900">
                                                                                {getLaporanLabel(totalLaporan)}
                                                                            </span>
                                                                            <span className="mx-1">•</span>
                                                                            <span>
                                                                                {latestLaporan ?
                                                                                    new Date(latestLaporan.tanggalLaporan).toLocaleDateString('id-ID', {
                                                                                        day: 'numeric',
                                                                                        month: 'long',
                                                                                        year: 'numeric'
                                                                                    }) : '-'
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                }

                                                                return (
                                                                    <div className="text-sm text-gray-500">
                                                                        <span className="font-medium">Laporan Terakhir: </span>
                                                                        <span>Belum ada laporan</span>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Filter Laporan */}
                                                <div className="mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Filter Laporan
                                                        </label>
                                                        <SearchableDropdown
                                                            options={laporanOptions}
                                                            value={selectedLaporan}
                                                            onChange={setSelectedLaporan}
                                                            placeholder="Pilih laporan..."
                                                            searchPlaceholder="Cari laporan..."
                                                            displayKey="label"
                                                            valueKey="value"
                                                            searchKeys={['label', 'subtitle']}
                                                            noResultsText="Laporan tidak ditemukan"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div className="text-sm text-gray-500">
                                                        Menampilkan <span className="font-medium">{laporanPeternak.length}</span> laporan
                                                        {selectedLaporan && ` untuk ${getLaporanLabel(selectedLaporan)}`}
                                                    </div>
                                                    {selectedPeternak?.statusSiklus === 'Selesai' ? (
                                                        <div className="flex flex-col items-center sm:items-end gap-2">
                                                            <button
                                                                disabled
                                                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed w-full sm:w-auto justify-center"
                                                                title="Tidak dapat menambah laporan karena status peternak sudah selesai"
                                                            >
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Tambah Laporan
                                                            </button>
                                                            <div className="text-xs text-orange-600 font-medium">
                                                                Status: Selesai - Tidak dapat menambah laporan baru
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={handleAddLaporan}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto justify-center"
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Tambah Laporan
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Laporan Table */}
                                            <LaporanTable
                                                laporan={laporanPeternak}
                                                onEdit={handleEditLaporan}
                                                onDelete={handleShowDeleteConfirm}
                                                isReadOnly={selectedPeternak?.statusSiklus === 'Selesai'}
                                            />
                                        </>
                                    );
                                })()}
                            </>
                        ) : (
                            // Tampilan Form Add/Edit Laporan
                            <>
                                {(() => {
                                    const selectedPeternak = getPeternakById(selectedPeternakId);
                                    return (
                                        <>
                                            {/* Header dengan tombol back */}
                                            <div className="mb-6 sm:mb-8">
                                                <div className="mb-4 sm:mb-4">
                                                    <button
                                                        onClick={handleBackToLaporan}
                                                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-2"
                                                    >
                                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                                        Kembali ke Laporan {selectedPeternak?.namaLengkap}
                                                    </button>
                                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                        {viewMode === 'edit' ? 'Edit Laporan' : 'Tambah Laporan Baru'}
                                                    </h1>
                                                    <p className="text-gray-600 mt-2">
                                                        {viewMode === 'edit'
                                                            ? `Mengubah ${getLaporanLabel(editingLaporan?.reportNumber)} untuk ${selectedPeternak?.namaLengkap}`
                                                            : `Buat laporan baru untuk ${selectedPeternak?.namaLengkap}`
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Form */}
                                            {(viewMode === 'add' || viewMode === 'edit') && selectedPeternakId && (
                                                <LaporanForm
                                                    laporan={editingLaporan}
                                                    peternakId={selectedPeternakId}
                                                    peternakData={selectedPeternak}
                                                    onSave={handleSaveLaporan}
                                                    onCancel={handleCancelForm}
                                                />
                                            )}
                                        </>
                                    );
                                })()}
                            </>
                        )}
                    </div>
                </main>
            </div>

            {deletingLaporan && (
                <CommonDeleteModal
                    item={deletingLaporan}
                    type="item"
                    title="Hapus Laporan"
                    customMessage={`Apakah Anda yakin ingin menghapus ${getLaporanLabel(deletingLaporan.reportNumber)}? Tindakan ini tidak dapat diurungkan.`}
                    onConfirm={handleDeleteLaporan}
                    onCancel={() => setDeletingLaporan(null)}
                    loading={deleteLoading}
                />
            )}

            {/* Cascade Update Modal */}
            <CascadeUpdateModal
                isOpen={showCascadeModal}
                onClose={() => {
                    setShowCascadeModal(false);
                    setCascadeInfo(null);
                }}
                cascadeInfo={cascadeInfo}
                action={cascadeInfo?.action || 'update'}
            />

            {/* Logout Modal */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={closeLogoutModal}
                onConfirm={confirmLogout}
                userName={userToLogout?.fullName}
            />

            {/* Notification Component */}
            <Notification
                type={notification.type}
                title={notification.title}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={hideNotification}
                autoClose={notification.autoClose}
                duration={notification.duration}
            />
        </div>
    );
};

export default LaporanPeternak;
