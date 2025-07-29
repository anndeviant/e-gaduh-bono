import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, MapPin, Phone, Users as UsersIcon, Heart, User, AlertCircle, CheckCircle } from 'lucide-react';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import PeternakSidebar from '../../components/peternak/PeternakSidebar';
import PeternakNavbar from '../../components/peternak/PeternakNavbar';

const PeternakTransparencyPage = () => {
    const [selectedPeternakFilter, setSelectedPeternakFilter] = useState('');
    const [peternakData, setPeternakData] = useState([]);
    const [laporanData, setLaporanData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState({});
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Sample data berdasarkan struktur database yang diusulkan
        setTimeout(() => {
            setPeternakData([
                {
                    id: 'aB1cDefG2hIjkL3mN4o',
                    namaLengkap: 'Ahmad Subarjo',
                    alamat: 'Dusun Ngaliyan RT 01/RW 02, Desa Bono',
                    nomorTelepon: '081234567890',
                    urlFotoPeternak: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                    statusKinerja: 'hijau',
                    tanggalDaftar: '2024-01-15',
                    programAktif: true,
                    targetPengembalian: 6
                },
                {
                    id: 'cD2eF3gH4iJkL5mN6o',
                    namaLengkap: 'Siti Aminah',
                    alamat: 'Dusun Krajan RT 02/RW 01, Desa Bono',
                    nomorTelepon: '081234567891',
                    urlFotoPeternak: 'https://images.unsplash.com/photo-1494790108755-2616c78e5eff?w=150',
                    statusKinerja: 'kuning',
                    tanggalDaftar: '2024-02-20',
                    programAktif: true,
                    targetPengembalian: 4
                },
                {
                    id: 'eF3gH4iJ5kL6mN7o8p',
                    namaLengkap: 'Bambang Wijaya',
                    alamat: 'Dusun Sawah RT 03/RW 02, Desa Bono',
                    nomorTelepon: '081234567892',
                    urlFotoPeternak: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                    statusKinerja: 'hijau',
                    tanggalDaftar: '2024-03-10',
                    programAktif: true,
                    targetPengembalian: 5
                }
            ]);

            // Data Laporan Per Pertemuan Rutin (sinkron dengan database admin)
            setLaporanData([
                {
                    id: 'laporan001',
                    peternakId: 'aB1cDefG2hIjkL3mN4o',
                    tanggalPertemuan: '2024-03-31',
                    periode: 'Laporan ke-1 2024',
                    reportNumber: 1,
                    tahun: 2024,
                    jumlahTernakAwal: 5,
                    jumlahLahir: 3,
                    jumlahMati: 0,
                    jumlahTerjual: 0,
                    jumlahAkhir: 8,
                    kendala: 'Domba sering batuk dan terlihat lemas',
                    solusi: 'Berikan obat batuk khusus ternak, pisahkan dari domba lain, dan konsultasi dengan petugas kesehatan hewan terdekat',
                    keterangan: 'Masalah ini sering terjadi saat pergantian musim. Perlu penanganan cepat untuk mencegah penyebaran.'
                },
                {
                    id: 'laporan002',
                    peternakId: 'aB1cDefG2hIjkL3mN4o',
                    tanggalPertemuan: '2024-06-30',
                    periode: 'Laporan ke-2 2024',
                    reportNumber: 2,
                    tahun: 2024,
                    jumlahTernakAwal: 8,
                    jumlahLahir: 2,
                    jumlahMati: 1,
                    jumlahTerjual: 1,
                    jumlahAkhir: 8,
                    kendala: 'Harga jual domba rendah, sulit mencari pembeli',
                    solusi: 'Bergabung dengan kelompok peternak untuk penjualan kolektif, manfaatkan media sosial untuk promosi, atau jual langsung ke pasar tradisional',
                    keterangan: 'Strategi pemasaran yang tepat bisa meningkatkan keuntungan peternak secara signifikan.'
                },
                {
                    id: 'laporan003',
                    peternakId: 'cD2eF3gH4iJkL5mN6o',
                    tanggalPertemuan: '2024-03-31',
                    periode: 'Laporan ke-1 2024',
                    reportNumber: 1,
                    tahun: 2024,
                    jumlahTernakAwal: 3,
                    jumlahLahir: 2,
                    jumlahMati: 1,
                    jumlahTerjual: 0,
                    jumlahAkhir: 4,
                    kendala: 'Sempat mengalami masalah pakan di musim kemarau',
                    solusi: 'Diberikan bantuan pakan tambahan dan penyuluhan manajemen pakan kering',
                    keterangan: 'Alternatif pakan saat musim kering sangat penting untuk menjaga kondisi ternak tetap sehat.'
                },
                {
                    id: 'laporan004',
                    peternakId: 'eF3gH4iJ5kL6mN7o8p',
                    tanggalPertemuan: '2024-03-31',
                    periode: 'Laporan ke-1 2024',
                    reportNumber: 1,
                    tahun: 2024,
                    jumlahTernakAwal: 4,
                    jumlahLahir: 3,
                    jumlahMati: 1,
                    jumlahTerjual: 0,
                    jumlahAkhir: 6,
                    kendala: 'Kandang bocor saat hujan, domba basah kuyup',
                    solusi: 'Perbaiki atap kandang dengan seng atau genting, pastikan ada saluran air yang baik di sekitar kandang',
                    keterangan: 'Kandang yang kering dan bersih sangat penting untuk kesehatan ternak, terutama saat musim hujan.'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const toggleRowExpansion = (peternakId) => {
        setExpandedRows(prev => ({
            ...prev,
            [peternakId]: !prev[peternakId]
        }));
    };

    // Close mobile menu when clicking outside - removed since using sidebar component
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (mobileMenuOpen && !event.target.closest('header')) {
    //             setMobileMenuOpen(false);
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => document.removeEventListener('mousedown', handleClickOutside);
    // }, [mobileMenuOpen]);

    const getPeternakLaporan = (peternakId) => {
        return laporanData.filter(laporan => laporan.peternakId === peternakId);
    };

    const getLatestLaporan = (peternakId) => {
        const laporan = getPeternakLaporan(peternakId);
        return laporan.length > 0 ? laporan[laporan.length - 1] : null;
    };

    const getCurrentLivestockCount = (peternakId) => {
        const latestLaporan = getLatestLaporan(peternakId);
        return latestLaporan ? latestLaporan.jumlahAkhir : 0;
    };

    // Filter data berdasarkan searchable dropdown
    const filteredPeternak = selectedPeternakFilter
        ? peternakData.filter(peternak => peternak.id === selectedPeternakFilter)
        : peternakData;

    // Prepare options for SearchableDropdown
    const peternakOptions = peternakData.map(peternak => {
        const laporanCount = getPeternakLaporan(peternak.id).length;
        return {
            value: peternak.id,
            label: peternak.namaLengkap,
            subtitle: `${peternak.alamat} • ${laporanCount} Laporan Pertemuan`,
        };
    });

    const defaultPeternakOption = {
        value: '',
        label: 'Tampilkan Semua Peternak',
        subtitle: `${peternakData.length} peternak total`
    };

    const totalStats = {
        totalPeternak: peternakData.length,
        totalTernak: peternakData.reduce((sum, peternak) => sum + getCurrentLivestockCount(peternak.id), 0),
        peternakAktif: peternakData.filter(peternak => peternak.programAktif).length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PeternakSidebar
                    activeItem="transparency"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <div className="min-h-screen">
                    <PeternakNavbar
                        onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Memuat data transparansi...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PeternakSidebar
                activeItem="transparency"
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <div className="min-h-screen">
                <PeternakNavbar
                    onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />

                {/* Main Content */}
                <main className="bg-gray-50">
                    {/* Page Header */}
                    <div className="bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="md:flex md:items-center md:justify-between">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        Transparansi Data Peternak
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Program e-Gaduh Desa Bono
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                            <div className="bg-white rounded-lg shadow p-2 sm:p-4 lg:p-6">
                                <div className="flex items-center justify-center sm:justify-start mb-1 sm:mb-2">
                                    <div className="p-1 sm:p-1.5 lg:p-2 bg-green-100 rounded-lg">
                                        <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6 text-green-600" />
                                    </div>
                                    <p className="text-sm sm:text-lg lg:text-2xl font-semibold text-gray-900 ml-2 sm:ml-3 lg:ml-4">{totalStats.totalPeternak}</p>
                                </div>
                                <p className="text-xs sm:text-xs lg:text-sm text-gray-600 text-center sm:text-left">Total Peternak</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-2 sm:p-4 lg:p-6">
                                <div className="flex items-center justify-center sm:justify-start mb-1 sm:mb-2">
                                    <div className="p-1 sm:p-1.5 lg:p-2 bg-blue-100 rounded-lg">
                                        <Heart className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6 text-blue-600" />
                                    </div>
                                    <p className="text-sm sm:text-lg lg:text-2xl font-semibold text-gray-900 ml-2 sm:ml-3 lg:ml-4">{totalStats.totalTernak}</p>
                                </div>
                                <p className="text-xs sm:text-xs lg:text-sm text-gray-600 text-center sm:text-left">Total Ternak</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-2 sm:p-4 lg:p-6">
                                <div className="flex items-center justify-center sm:justify-start mb-1 sm:mb-2">
                                    <div className="p-1 sm:p-1.5 lg:p-2 bg-purple-100 rounded-lg">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6 text-purple-600" />
                                    </div>
                                    <p className="text-sm sm:text-lg lg:text-2xl font-semibold text-gray-900 ml-2 sm:ml-3 lg:ml-4">{totalStats.peternakAktif}</p>
                                </div>
                                <p className="text-xs sm:text-xs lg:text-sm text-gray-600 text-center sm:text-left">Program Aktif</p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6">
                            <div className="w-full">
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                                            <th className="px-4 sm:px-6 py-3 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Peternak
                                            </th>
                                            <th className="px-4 sm:px-6 py-3 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jumlah Laporan
                                            </th>
                                            <th className="px-4 sm:px-6 py-3 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pertemuan Terakhir
                                            </th>
                                            <th className="px-4 sm:px-6 py-3 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">

                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredPeternak.map((peternak) => {
                                            const latestLaporan = getLatestLaporan(peternak.id);
                                            const isExpanded = expandedRows[peternak.id];

                                            return (
                                                <React.Fragment key={peternak.id}>
                                                    {/* Main Row */}
                                                    <tr
                                                        className="group hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer select-none"
                                                        onClick={() => toggleRowExpansion(peternak.id)}
                                                        title="Klik untuk melihat detail Laporan"
                                                    >
                                                        <td className="px-4 sm:px-6 py-4 sm:py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <img
                                                                    src={peternak.urlFotoPeternak}
                                                                    alt={peternak.namaLengkap}
                                                                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover mr-3 sm:mr-3 flex-shrink-0"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.nextElementSibling.style.display = 'block';
                                                                    }}
                                                                />
                                                                <User className="h-9 w-9 sm:h-10 sm:w-10 text-gray-400 bg-gray-100 rounded-full p-2 sm:p-2 mr-3 sm:mr-3 flex-shrink-0" style={{ display: 'none' }} />
                                                                <div>
                                                                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                                                                        {peternak.namaLengkap}
                                                                    </div>
                                                                    <div className="text-xs sm:text-sm text-gray-500">
                                                                        {peternak.alamat}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 sm:py-4 text-center">
                                                            <div className="text-xs text-gray-500 font-bold">
                                                                {getPeternakLaporan(peternak.id).length} Laporan
                                                            </div>
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 sm:py-4 text-center">
                                                            {latestLaporan ? (
                                                                <div className="text-xs sm:text-sm">
                                                                    <div className="font-medium text-gray-900">
                                                                        Laporan ke-{latestLaporan.reportNumber}
                                                                    </div>
                                                                    <div className="text-gray-500 text-xs">
                                                                        {new Date(latestLaporan.tanggalPertemuan).toLocaleDateString('id-ID')}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500 text-xs sm:text-sm">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 sm:py-4 text-center">
                                                            <div className="flex justify-center">
                                                                {isExpanded ? (
                                                                    <ChevronUp className="h-4 w-4 text-green-600 transition-colors" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Expanded Detail Row */}
                                                    {isExpanded && (
                                                        <tr className="bg-gray-50">
                                                            <td colSpan="4" className="px-4 sm:px-6 py-4 sm:py-4">
                                                                <div className="bg-white rounded-lg border p-4 sm:p-4 lg:p-6 animate-in slide-in-from-top-2 duration-300">
                                                                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6 border-b border-gray-200 pb-2">
                                                                        Riwayat Laporan Pertemuan - {peternak.namaLengkap}
                                                                    </h4>

                                                                    <div className="space-y-4 sm:space-y-6">
                                                                        {/* Info Ringkas Peternak dalam Format Tabel */}
                                                                        <div className="bg-blue-50 rounded-lg p-4">
                                                                            <h5 className="font-medium text-blue-900 mb-3 text-sm">Informasi Peternak</h5>
                                                                            <div className="overflow-x-auto">
                                                                                <table className="min-w-full bg-white rounded-lg shadow-sm">
                                                                                    <tbody className="divide-y divide-gray-200">
                                                                                        <tr className="hover:bg-gray-50">
                                                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 w-32 sm:w-40">
                                                                                                <div className="flex items-center">
                                                                                                    <MapPin className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                                                                                                    Alamat
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="px-4 py-3 text-sm text-gray-700 text-justify">
                                                                                                {peternak.alamat}
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr className="hover:bg-gray-50">
                                                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                                                                <div className="flex items-center">
                                                                                                    <Phone className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                                                                                                    No. Telepon
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                                {peternak.nomorTelepon}
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr className="hover:bg-gray-50">
                                                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                                                                <div className="flex items-center">
                                                                                                    <Calendar className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                                                                                                    Tanggal Bergabung
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                                {new Date(peternak.tanggalDaftar).toLocaleDateString('id-ID', {
                                                                                                    weekday: 'long',
                                                                                                    year: 'numeric',
                                                                                                    month: 'long',
                                                                                                    day: 'numeric'
                                                                                                })}
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr className="hover:bg-gray-50">
                                                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                                                                <div className="flex items-center">
                                                                                                    <Heart className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                                                                                                    Jumlah Ternak
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                                                                                    <span className="font-medium text-green-600">
                                                                                                        {getCurrentLivestockCount(peternak.id)} ekor (saat ini)
                                                                                                    </span>
                                                                                                    <span className="text-blue-600 text-xs sm:text-sm">
                                                                                                        Target pengembalian: {peternak.targetPengembalian} ekor
                                                                                                    </span>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr className="hover:bg-gray-50">
                                                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                                                                <div className="flex items-center">
                                                                                                    <CheckCircle className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                                                                                                    Status Program
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${peternak.programAktif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                                                    Program {peternak.programAktif ? 'Aktif' : 'Tidak Aktif'}
                                                                                                </span>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>

                                                                        {/* Tabel Laporan Per Pertemuan */}
                                                                        <div>
                                                                            <h5 className="font-medium text-gray-900 mb-3 text-sm">Riwayat Laporan Pertemuan Rutin</h5>
                                                                            {(() => {
                                                                                const laporanPeternak = getPeternakLaporan(peternak.id);
                                                                                return laporanPeternak.length > 0 ? (
                                                                                    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                                                                                        <div className="overflow-x-auto">
                                                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                                                <thead className="bg-gray-50">
                                                                                                    <tr>
                                                                                                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                                                                                            Periode
                                                                                                        </th>
                                                                                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                                                                                                            Awal
                                                                                                        </th>
                                                                                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                                                                                                            Lahir
                                                                                                        </th>
                                                                                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                                                                                                            Mati
                                                                                                        </th>
                                                                                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                                                                                                            Terjual
                                                                                                        </th>
                                                                                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                                                                                                            Akhir
                                                                                                        </th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                                                    {laporanPeternak.map((laporan) => (
                                                                                                        <React.Fragment key={laporan.id}>
                                                                                                            <tr className="hover:bg-gray-50 transition-colors">
                                                                                                                <td className="px-4 py-4 text-sm">
                                                                                                                    <div className="font-medium text-gray-900 mb-1">{laporan.periode}</div>
                                                                                                                    <div className="text-xs text-gray-500">
                                                                                                                        {new Date(laporan.tanggalPertemuan).toLocaleDateString('id-ID', {
                                                                                                                            day: '2-digit',
                                                                                                                            month: 'short',
                                                                                                                            year: 'numeric'
                                                                                                                        })}
                                                                                                                    </div>
                                                                                                                </td>
                                                                                                                <td className="px-4 py-4 text-center text-sm font-medium text-gray-900">
                                                                                                                    <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                                                                                                        {laporan.jumlahTernakAwal}
                                                                                                                    </div>
                                                                                                                </td>
                                                                                                                <td className="px-4 py-4 text-center">
                                                                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 min-w-[40px] justify-center">
                                                                                                                        +{laporan.jumlahLahir}
                                                                                                                    </span>
                                                                                                                </td>
                                                                                                                <td className="px-4 py-4 text-center">
                                                                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 min-w-[40px] justify-center">
                                                                                                                        -{laporan.jumlahMati}
                                                                                                                    </span>
                                                                                                                </td>
                                                                                                                <td className="px-4 py-4 text-center">
                                                                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 min-w-[40px] justify-center">
                                                                                                                        -{laporan.jumlahTerjual}
                                                                                                                    </span>
                                                                                                                </td>
                                                                                                                <td className="px-4 py-4 text-center text-sm font-medium text-gray-900">
                                                                                                                    <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-700 rounded-full font-semibold">
                                                                                                                        {laporan.jumlahAkhir}
                                                                                                                    </div>
                                                                                                                </td>
                                                                                                            </tr>

                                                                                                            {/* Row untuk Kendala-Solusi dan Keterangan */}
                                                                                                            {(laporan.kendala || laporan.solusi || laporan.keterangan) && (
                                                                                                                <tr className="bg-gray-50">
                                                                                                                    <td colSpan="6" className="px-4 py-4">
                                                                                                                        <div className="text-xs sm:text-sm space-y-2">
                                                                                                                            {laporan.kendala && (
                                                                                                                                <div className="flex items-start">
                                                                                                                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                                                                                                                    <div className="flex-1">
                                                                                                                                        <span className="font-medium text-yellow-700">Kendala: </span>
                                                                                                                                        <span className="text-yellow-600 text-justify leading-relaxed">{laporan.kendala}</span>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            )}
                                                                                                                            {laporan.solusi && (
                                                                                                                                <div className="flex items-start">
                                                                                                                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                                                                                                    <div className="flex-1">
                                                                                                                                        <span className="font-medium text-green-700">Solusi: </span>
                                                                                                                                        <span className="text-green-600 text-justify leading-relaxed">{laporan.solusi}</span>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            )}
                                                                                                                            {laporan.keterangan && (
                                                                                                                                <div className="bg-gray-100 p-2 sm:p-3 rounded border-l-4 border-gray-400">
                                                                                                                                    <span className="font-medium text-gray-900">Keterangan: </span>
                                                                                                                                    <span className="text-gray-800 text-justify leading-relaxed">{laporan.keterangan}</span>
                                                                                                                                </div>
                                                                                                                            )}
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            )}
                                                                                                        </React.Fragment>
                                                                                                    ))}
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                                                                                        <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                                                        <p className="text-sm text-gray-500">Belum ada Laporan Pertemuan</p>
                                                                                    </div>
                                                                                );
                                                                            })()}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
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
                                        Coba ubah kata kunci pencarian atau filter.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default PeternakTransparencyPage;
