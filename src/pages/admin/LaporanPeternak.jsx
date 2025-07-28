import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import LogoutModal from '../../components/admin/LogoutModal';
import { useLogoutModal } from '../../hooks/useLogoutModal';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import LaporanTable from '../../components/admin/LaporanTable';
import AllLaporanTable from '../../components/admin/AllLaporanTable';
import LaporanTriwulanForm from '../../components/admin/LaporanTriwulanForm';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import ProgramProgressIndicator from '../../components/admin/ProgramProgressIndicator';
import StatusKinerjaManager from '../../components/admin/StatusKinerjaManager';
import { Plus, ArrowLeft, User, MapPin, Phone, Eye } from 'lucide-react';
import { getAllPeternak } from '../../services/peternakService';
import {
    getAllLaporan,
    getLaporanByPeternak,
    createLaporan,
    updateLaporan,
    deleteLaporan
} from '../../services/laporanService';
import { useLaporanNotification } from '../../hooks/useLaporanNotification';
import NotificationToast from '../../components/common/NotificationToast';

const LaporanPeternak = () => {
    const navigate = useNavigate();
    const [peternakData, setPeternakData] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [laporanData, setLaporanData] = useState([]); // untuk detail view per-peternak (filtered data)
    const [allLaporanData, setAllLaporanData] = useState([]); // untuk calculation & AllLaporanTable (semua data)
    const [loading, setLoading] = useState(true);
    const [selectedPeternakFilter, setSelectedPeternakFilter] = useState(''); // untuk dropdown filter
    const [selectedPeternakId, setSelectedPeternakId] = useState(null);
    const [selectedTriwulan, setSelectedTriwulan] = useState('');
    const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());
    const [showAllLaporan, setShowAllLaporan] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [viewMode, setViewMode] = useState('peternak'); // 'peternak', 'laporan', 'add', 'edit'
    const [editingLaporan, setEditingLaporan] = useState(null);
    const [deletingLaporan, setDeletingLaporan] = useState(null);

    // Logout modal hook
    const {
        isLogoutModalOpen,
        userToLogout,
        openLogoutModal,
        closeLogoutModal,
        confirmLogout
    } = useLogoutModal();
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Notification hook
    const {
        notification,
        clearNotification,
        notifyLoadSuccess,
        notifyLoadError,
        notifyDeleteSuccess,
        notifyDeleteError,
        notifyActionConfirm
    } = useLaporanNotification();

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
                console.log('All laporan data:', allLaporanList);

                // Jika filter peternak dipilih, ambil laporan dari firebase
                if (selectedPeternakFilter) {
                    const laporanList = await getLaporanByPeternak(selectedPeternakFilter);
                    setLaporanData(laporanList);
                    console.log('Laporan data for selected peternak:', laporanList);

                    // Show success notification untuk laporan yang difilter
                    notifyLoadSuccess(laporanList.length);
                } else {
                    // Jika tidak ada filter, kosongkan laporanData
                    setLaporanData([]);

                    // Show success notification untuk semua laporan
                    notifyLoadSuccess(allLaporanList.length);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                notifyLoadError(error.message);
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
        return getPeternakLaporan(peternakId).length;
    };

    const getTriwulanLabel = (triwulan) => {
        const labels = {
            1: 'Triwulan I (Jan-Mar)',
            2: 'Triwulan II (Apr-Jun)',
            3: 'Triwulan III (Jul-Sep)',
            4: 'Triwulan IV (Okt-Des)'
        };
        return labels[triwulan] || `Triwulan ${triwulan}`;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Baru': 'bg-gray-100 text-gray-800',
            'Progress': 'bg-blue-100 text-blue-800',
            'Bagus': 'bg-green-100 text-green-800',
            'Biasa': 'bg-yellow-100 text-yellow-800',
            'Kurang': 'bg-red-100 text-red-800'
        };
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status] || statusConfig['Baru']}`}>
                {status}
            </span>
        );
    };

    // Filter data
    const filteredPeternak = selectedPeternakFilter
        ? peternakData.filter(peternak => peternak.id === selectedPeternakFilter)
        : peternakData;

    // Prepare options for SearchableDropdown
    const peternakOptions = peternakData.map(peternak => ({
        value: peternak.id,
        label: peternak.namaLengkap,
        subtitle: `${peternak.statusKinerja} • ${getTotalLaporanByPeternak(peternak.id)} laporan`,
    }));

    const defaultPeternakOption = {
        value: '',
        label: 'Tampilkan Semua Peternak',
        subtitle: `${peternakData.length} peternak total`
    };

    // Options for Triwulan filter
    const triwulanOptions = [
        { value: '', label: 'Semua Triwulan', subtitle: 'Tampilkan semua periode' },
        { value: '1', label: 'Triwulan I', subtitle: 'Januari - Maret' },
        { value: '2', label: 'Triwulan II', subtitle: 'April - Juni' },
        { value: '3', label: 'Triwulan III', subtitle: 'Juli - September' },
        { value: '4', label: 'Triwulan IV', subtitle: 'Oktober - Desember' }
    ];

    // Options for Tahun filter
    const tahunOptions = [
        { value: '', label: 'Semua Tahun', subtitle: 'Tampilkan semua tahun' },
        { value: 2024, label: '2024', subtitle: 'Tahun 2024' },
        { value: 2025, label: '2025', subtitle: 'Tahun 2025' }
    ];

    const getFilteredLaporanByPeternak = (peternakId) => {
        // Gunakan allLaporanData untuk filter, bukan laporanData
        const peternakLaporan = allLaporanData.filter(laporan => laporan.idPeternak === peternakId);

        return peternakLaporan.filter(laporan => {
            const matchTriwulan = selectedTriwulan === '' || laporan.quarter?.toString() === selectedTriwulan;
            const matchTahun = selectedTahun === '' || laporan.year === selectedTahun;
            return matchTriwulan && matchTahun;
        });
    };

    const handleToggleAllLaporan = () => {
        setShowAllLaporan(!showAllLaporan);
        if (!showAllLaporan) {
            // Ketika beralih ke mode semua laporan, reset filter
            setSelectedPeternakFilter('');
            setSelectedTriwulan('');
            setSelectedTahun('');
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
        setSelectedTriwulan('');
        setSelectedTahun('');
        setEditingLaporan(null);
    };

    const handleBackToLaporan = () => {
        setViewMode('laporan');
        setEditingLaporan(null);
    };

    const handleAddLaporan = () => {
        setEditingLaporan(null);
        setViewMode('add');
    };

    const handleEditLaporan = (laporan) => {
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

            let result;
            if (viewMode === 'edit' && editingLaporan) {
                // Update laporan yang ada
                result = await updateLaporan(editingLaporan.id, dataToSave);
                console.log('Laporan berhasil diupdate:', result);
            } else {
                // Buat laporan baru
                result = await createLaporan(dataToSave);
                console.log('Laporan berhasil dibuat:', result);
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

            console.log('Redirect berhasil ke halaman laporan');
        } catch (error) {
            console.error('Error saving laporan:', error);
            alert(`Gagal menyimpan laporan: ${error.message}`);
        }
    };


    const handleCancelForm = () => {
        setViewMode('laporan');
        setEditingLaporan(null);
    };

    const handleShowDeleteConfirm = (laporan) => {
        setDeletingLaporan(laporan);
    };

    const handleStatusKinerjaUpdate = (newStatus) => {
        // Update status kinerja di state lokal
        setPeternakData(prev => prev.map(p =>
            p.id === selectedPeternakId
                ? { ...p, statusKinerja: newStatus, programAktif: false, tanggalSelesai: new Date().toISOString() }
                : p
        ));
    };

    const handleDeleteLaporan = async () => {
        if (!deletingLaporan) return;

        setDeleteLoading(true);

        try {
            // Show processing notification
            const peternakName = getPeternakById(deletingLaporan.idPeternak)?.namaLengkap || 'Peternak';
            notifyActionConfirm('Menghapus laporan', peternakName);

            await deleteLaporan(deletingLaporan.id);

            // Refresh data laporan untuk peternak terpilih
            const laporanList = await getLaporanByPeternak(selectedPeternakId);
            setLaporanData(laporanList);

            // Refresh data keseluruhan untuk tabel AllLaporan
            const allLaporan = await getAllLaporan();
            setAllLaporanData(allLaporan);

            // Show success notification
            notifyDeleteSuccess(
                peternakName,
                deletingLaporan.quarter || deletingLaporan.quarterNumber || deletingLaporan.triwulan,
                deletingLaporan.year || deletingLaporan.quarterInfo?.year || deletingLaporan.tahun
            );

            setDeletingLaporan(null);
            console.log('Laporan berhasil dihapus dan data direfresh');
        } catch (error) {
            console.error('Error deleting laporan:', error);
            notifyDeleteError(error.message);
        } finally {
            setDeleteLoading(false);
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
                                                    : 'Pilih peternak untuk melihat dan mengelola laporan triwulan mereka'
                                                }
                                            </p>
                                        </div>
                                        <div className="mt-4 sm:mt-0">
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
                                                                Total Laporan
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
                                                            const totalLaporanPeternak = getTotalLaporanByPeternak(peternak.id);

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
                                                                                <div className="mt-1">
                                                                                    {getStatusBadge(peternak.statusKinerja)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {totalLaporanPeternak} laporan
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                                                                        {latestLaporan ? (
                                                                            <div className="text-sm">
                                                                                <div className="font-medium text-gray-900">
                                                                                    Triwulan {['', 'I', 'II', 'III', 'IV'][latestLaporan.quarter || latestLaporan.quarterNumber || latestLaporan.triwulan]}
                                                                                </div>
                                                                                <div className="text-gray-500 text-xs">
                                                                                    {new Date(latestLaporan.tanggalLaporan).toLocaleDateString('id-ID')}
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-gray-500 text-sm">-</span>
                                                                        )}
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
                                                        Kelola laporan triwulan untuk peternak ini
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
                                                            {latestLaporan ? (
                                                                <div className="text-sm text-gray-700">
                                                                    <span className="font-medium">Laporan Terakhir: </span>
                                                                    <span className="font-medium text-gray-900">
                                                                        Triwulan {['', 'I', 'II', 'III', 'IV'][latestLaporan.quarter || latestLaporan.quarterNumber || latestLaporan.triwulan]} {latestLaporan.year || latestLaporan.quarterInfo?.year || latestLaporan.tahun}
                                                                    </span>
                                                                    <span className="mx-1">•</span>
                                                                    <span>
                                                                        {new Date(latestLaporan.tanggalLaporan).toLocaleDateString('id-ID', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-gray-500">
                                                                    <span className="font-medium">Laporan Terakhir: </span>
                                                                    <span>Belum ada laporan</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Filter Triwulan dan Tahun */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                    {/* Filter Triwulan */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Filter Triwulan
                                                        </label>
                                                        <SearchableDropdown
                                                            options={triwulanOptions}
                                                            value={selectedTriwulan}
                                                            onChange={setSelectedTriwulan}
                                                            placeholder="Pilih triwulan..."
                                                            searchPlaceholder="Cari triwulan..."
                                                            displayKey="label"
                                                            valueKey="value"
                                                            searchKeys={['label', 'subtitle']}
                                                            noResultsText="Triwulan tidak ditemukan"
                                                        />
                                                    </div>

                                                    {/* Filter Tahun */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Filter Tahun
                                                        </label>
                                                        <SearchableDropdown
                                                            options={tahunOptions}
                                                            value={selectedTahun}
                                                            onChange={setSelectedTahun}
                                                            placeholder="Pilih tahun..."
                                                            searchPlaceholder="Cari tahun..."
                                                            displayKey="label"
                                                            valueKey="value"
                                                            searchKeys={['label']}
                                                            noResultsText="Tahun tidak ditemukan"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div className="text-sm text-gray-500">
                                                        Menampilkan <span className="font-medium">{laporanPeternak.length}</span> laporan
                                                        {selectedTriwulan && ` untuk Triwulan ${selectedTriwulan}`}
                                                        {` tahun ${selectedTahun}`}
                                                    </div>
                                                    <button
                                                        onClick={handleAddLaporan}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto justify-center"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Tambah Laporan
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Progress Indicator */}
                                            <ProgramProgressIndicator
                                                peternakData={selectedPeternak}
                                                laporanData={laporanPeternak}
                                            />

                                            {/* Status Kinerja Manager */}
                                            <StatusKinerjaManager
                                                peternakData={selectedPeternak}
                                                laporanData={laporanPeternak}
                                                onStatusUpdate={handleStatusKinerjaUpdate}
                                            />

                                            {/* Info Peternak - Subcard */}
                                            <div className="bg-white rounded-lg shadow mb-6 p-5 sm:p-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-5">Informasi Peternak</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                                    <div className="flex items-center">
                                                        <User className="h-9 w-9 sm:h-8 sm:w-8 text-gray-400 bg-gray-100 rounded-full p-2 mr-4 sm:mr-3 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {selectedPeternak?.namaLengkap}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                NIK: {selectedPeternak?.nik}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 text-gray-400 mr-3 sm:mr-2 flex-shrink-0" />
                                                        <div className="text-sm text-gray-900">
                                                            {selectedPeternak?.alamat}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Phone className="h-4 w-4 text-gray-400 mr-3 sm:mr-2 flex-shrink-0" />
                                                        <div className="text-sm text-gray-900">
                                                            {selectedPeternak?.nomorTelepon}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Laporan Table */}
                                            <LaporanTable
                                                laporan={laporanPeternak}
                                                onEdit={handleEditLaporan}
                                                onDelete={handleShowDeleteConfirm}
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
                                    const laporanPeternak = getFilteredLaporanByPeternak(selectedPeternakId);
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
                                                            ? `Mengubah laporan ${getTriwulanLabel(editingLaporan?.triwulan)} ${editingLaporan?.tahun} untuk ${selectedPeternak?.namaLengkap}`
                                                            : `Buat laporan baru untuk ${selectedPeternak?.namaLengkap}`
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Form */}
                                            {(viewMode === 'add' || viewMode === 'edit') && selectedPeternakId && (
                                                <LaporanTriwulanForm
                                                    laporan={editingLaporan}
                                                    peternakId={selectedPeternakId}
                                                    peternakData={selectedPeternak}
                                                    triwulan={laporanPeternak.length > 0 ? laporanPeternak.length : 0}
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
                <DeleteConfirmModal
                    admin={deletingLaporan}
                    onConfirm={handleDeleteLaporan}
                    onCancel={() => setDeletingLaporan(null)}
                    loading={deleteLoading}
                    title="Hapus Laporan"
                    message={`Apakah Anda yakin ingin menghapus laporan Triwulan ${deletingLaporan.quarterNumber || deletingLaporan.triwulan} ${deletingLaporan.quarterInfo?.year || deletingLaporan.tahun}?`}
                    confirmText="Hapus Laporan"
                />
            )}

            {/* Logout Modal */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={closeLogoutModal}
                onConfirm={confirmLogout}
                userName={userToLogout?.fullName}
            />

            {/* Notification Toast */}
            <NotificationToast
                notification={notification}
                onClose={clearNotification}
                position="top-right"
                autoHideDuration={5000}
            />
        </div>
    );
};

export default LaporanPeternak;
