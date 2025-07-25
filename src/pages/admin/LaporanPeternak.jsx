import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import LaporanTable from '../../components/admin/LaporanTable';
import { Plus, ArrowLeft, User, MapPin, Phone, Eye } from 'lucide-react';

function LaporanForm({ peternakId, initialData = {}, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        peternakId: peternakId || initialData.peternakId || '',
        tanggalLaporan: initialData.tanggalLaporan || '',
        triwulan: initialData.triwulan || '',
        tahun: initialData.tahun || new Date().getFullYear(),
        jumlahTernakAwal: initialData.jumlahTernakAwal || '',
        jumlahLahir: initialData.jumlahLahir || '',
        jumlahMati: initialData.jumlahMati || '',
        jumlahTerjual: initialData.jumlahTerjual || '',
        jumlahAkhirPeriode: initialData.jumlahAkhirPeriode || '',
        kendala: initialData.kendala || '',
        solusi: initialData.solusi || '',
        keterangan: initialData.keterangan || '',
    });

    const [error, setError] = useState('');

        useEffect(() => {
        const awal = parseInt(form.jumlahTernakAwal) || 0;
        const lahir = parseInt(form.jumlahLahir) || 0;
        const mati = parseInt(form.jumlahMati) || 0;
        const terjual = parseInt(form.jumlahTerjual) || 0;
        const hasil = awal + lahir - mati - terjual;
        setForm(f => ({
            ...f,
            jumlahAkhirPeriode: hasil >= 0 ? hasil : 0
        }));
    }, [form.jumlahTernakAwal, form.jumlahLahir, form.jumlahMati, form.jumlahTerjual]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validasi wajib
        if (!form.tanggalLaporan || !form.triwulan || !form.tahun || !form.jumlahTernakAwal || !form.jumlahLahir || !form.jumlahMati || !form.jumlahTerjual) {
            setError('Mohon isi semua field wajib.');
            return;
        }
        setError('');
        onSubmit(form);
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Laporan *</label>
                <input
                    type="date"
                    name="tanggalLaporan"
                    value={form.tanggalLaporan}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Triwulan *</label>
                    <select
                        name="triwulan"
                        value={form.triwulan}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        required
                    >
                        <option value="">Pilih Triwulan</option>
                        <option value="1">Triwulan I</option>
                        <option value="2">Triwulan II</option>
                        <option value="3">Triwulan III</option>
                        <option value="4">Triwulan IV</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun *</label>
                    <input
                        type="number"
                        name="tahun"
                        value={form.tahun}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        min="2024"
                        max="2100"
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Ternak Awal *</label>
                    <input
                        type="number"
                        name="jumlahTernakAwal"
                        value={form.jumlahTernakAwal}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Lahir *</label>
                    <input
                        type="number"
                        name="jumlahLahir"
                        value={form.jumlahLahir}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        min="0"
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Mati *</label>
                    <input
                        type="number"
                        name="jumlahMati"
                        value={form.jumlahMati}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Terjual *</label>
                    <input
                        type="number"
                        name="jumlahTerjual"
                        value={form.jumlahTerjual}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        min="0"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Akhir Periode</label>
                <input
                    type="number"
                    name="jumlahAkhirPeriode"
                    value={form.jumlahAkhirPeriode}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    min="0"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kendala</label>
                <textarea
                    name="kendala"
                    value={form.kendala}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows={2}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solusi</label>
                <textarea
                    name="solusi"
                    value={form.solusi}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows={2}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea
                    name="keterangan"
                    value={form.keterangan || ''}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows={2}
                />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 text-sm"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 text-white text-sm"
                >
                    Simpan
                </button>
            </div>
        </form>
    );
}
// ...existing code...

const LaporanPeternak = () => {
    const navigate = useNavigate();
    const [peternakData, setPeternakData] = useState([]);
    const [laporanData, setLaporanData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeternakFilter, setSelectedPeternakFilter] = useState(''); // untuk dropdown filter
    const [selectedPeternakId, setSelectedPeternakId] = useState(null);
    const [selectedTriwulan, setSelectedTriwulan] = useState('');
    const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [viewMode, setViewMode] = useState('peternak'); // 'peternak' atau 'laporan'

    useEffect(() => {
        // Check authentication
        const user = localStorage.getItem('adminUser');
        if (!user) {
            navigate('/admin/login');
            return;
        }

        // Sample data (sinkron dengan transparansi)
        setTimeout(() => {
            setPeternakData([
                {
                    id: 'aB1cDefG2hIjkL3mN4o',
                    namaLengkap: 'Ahmad Subarjo',
                    nik: '3401020304800001',
                    alamat: 'Dusun Ngaliyan RT 01/RW 02, Desa Bono',
                    nomorTelepon: '081234567890',
                    email: 'ahmad.subarjo@email.com',
                    jenisKelamin: 'Laki-laki',
                    statusKinerja: 'Baik',
                    tanggalDaftar: '2024-01-15',
                    programAktif: true,
                    jumlahTernakSaatIni: 8,
                    targetPengembalian: 6,
                    totalLaporan: 2
                },
                {
                    id: 'cD2eF3gH4iJkL5mN6o',
                    namaLengkap: 'Siti Aminah',
                    nik: '3401020304800002',
                    alamat: 'Dusun Krajan RT 02/RW 01, Desa Bono',
                    nomorTelepon: '081234567891',
                    email: 'siti.aminah@email.com',
                    jenisKelamin: 'Perempuan',
                    statusKinerja: 'Perhatian',
                    tanggalDaftar: '2024-02-20',
                    programAktif: true,
                    jumlahTernakSaatIni: 4,
                    targetPengembalian: 4,
                    totalLaporan: 1
                },
                {
                    id: 'eF3gH4iJ5kL6mN7o8p',
                    namaLengkap: 'Bambang Wijaya',
                    nik: '3401020304800003',
                    alamat: 'Dusun Sawah RT 03/RW 02, Desa Bono',
                    nomorTelepon: '081234567892',
                    email: 'bambang.wijaya@email.com',
                    jenisKelamin: 'Laki-laki',
                    statusKinerja: 'Baik',
                    tanggalDaftar: '2024-03-10',
                    programAktif: true,
                    jumlahTernakSaatIni: 6,
                    targetPengembalian: 5,
                    totalLaporan: 1
                }
            ]);

            setLaporanData([
                {
                    id: 'laporan001',
                    peternakId: 'aB1cDefG2hIjkL3mN4o',
                    tanggalLaporan: '2024-03-31',
                    triwulan: 1,
                    tahun: 2024,
                    jumlahTernakAwal: 5,
                    jumlahLahir: 3,
                    jumlahMati: 0,
                    jumlahTerjual: 0,
                    jumlahAkhirPeriode: 8,
                    kendala: 'Domba sering batuk dan terlihat lemas',
                    solusi: 'Berikan obat batuk khusus ternak, pisahkan dari domba lain, dan konsultasi dengan petugas kesehatan hewan terdekat',
                    keterangan: 'Masalah ini sering terjadi saat pergantian musim. Perlu penanganan cepat untuk mencegah penyebaran.'
                },
                {
                    id: 'laporan002',
                    peternakId: 'aB1cDefG2hIjkL3mN4o',
                    tanggalLaporan: '2024-06-30',
                    triwulan: 2,
                    tahun: 2024,
                    jumlahTernakAwal: 8,
                    jumlahLahir: 2,
                    jumlahMati: 1,
                    jumlahTerjual: 1,
                    jumlahAkhirPeriode: 8,
                    kendala: 'Harga jual domba rendah, sulit mencari pembeli',
                    solusi: 'Bergabung dengan kelompok peternak untuk penjualan kolektif, manfaatkan media sosial untuk promosi, atau jual langsung ke pasar tradisional',
                    keterangan: 'Strategi pemasaran yang tepat bisa meningkatkan keuntungan peternak secara signifikan.'
                },
                {
                    id: 'laporan003',
                    peternakId: 'cD2eF3gH4iJkL5mN6o',
                    tanggalLaporan: '2024-03-31',
                    triwulan: 1,
                    tahun: 2024,
                    jumlahTernakAwal: 3,
                    jumlahLahir: 2,
                    jumlahMati: 1,
                    jumlahTerjual: 0,
                    jumlahAkhirPeriode: 4,
                    kendala: 'Sempat mengalami masalah pakan di musim kemarau',
                    solusi: 'Diberikan bantuan pakan tambahan dan penyuluhan manajemen pakan kering',
                    keterangan: 'Alternatif pakan saat musim kering sangat penting untuk menjaga kondisi ternak tetap sehat.'
                },
                {
                    id: 'laporan004',
                    peternakId: 'eF3gH4iJ5kL6mN7o8p',
                    tanggalLaporan: '2024-03-31',
                    triwulan: 1,
                    tahun: 2024,
                    jumlahTernakAwal: 4,
                    jumlahLahir: 3,
                    jumlahMati: 1,
                    jumlahTerjual: 0,
                    jumlahAkhirPeriode: 6,
                    kendala: 'Kandang bocor saat hujan, domba basah kuyup',
                    solusi: 'Perbaiki atap kandang dengan seng atau genting, pastikan ada saluran air yang baik di sekitar kandang',
                    keterangan: 'Kandang yang kering dan bersih sangat penting untuk kesehatan ternak, terutama saat musim hujan.'
                }
            ]);

            setLoading(false);
        }, 1000);
    }, [navigate]);

    // Helper functions
    const getPeternakById = (peternakId) => {
        return peternakData.find(p => p.id === peternakId);
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
            'Baik': 'bg-green-100 text-green-800',
            'Perhatian': 'bg-yellow-100 text-yellow-800',
            'Bermasalah': 'bg-red-100 text-red-800'
        };
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status] || statusConfig['Baik']}`}>
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
        subtitle: `${peternak.statusKinerja} • ${peternak.totalLaporan} laporan`,
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
        { value: 2024, label: '2024', subtitle: 'Tahun 2024' },
        { value: 2025, label: '2025', subtitle: 'Tahun 2025' }
    ];

    const getFilteredLaporanByPeternak = (peternakId) => {
        return laporanData.filter(laporan => {
            const matchPeternak = laporan.peternakId === peternakId;
            const matchTriwulan = selectedTriwulan === '' || laporan.triwulan.toString() === selectedTriwulan;
            const matchTahun = laporan.tahun === selectedTahun;
            return matchPeternak && matchTriwulan && matchTahun;
        });
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
    };

    const handleAddLaporan = () => {
        setModalData(null);
        setShowModal(true);
    };

    const handleEditLaporan = (laporan) => {
        setModalData(laporan);
        setShowModal(true);
    };

    const handleDeleteLaporan = (laporan) => {
        const peternak = getPeternakById(laporan.peternakId);
        if (window.confirm(`Hapus laporan ${getTriwulanLabel(laporan.triwulan)} ${laporan.tahun} dari ${peternak?.namaLengkap}?`)) {
            setLaporanData(prev => prev.filter(l => l.id !== laporan.id));
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex overflow-hidden bg-gray-100">
                <Sidebar
                    activeItem="laporan"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
                            <span className="text-sm sm:text-base text-gray-600">Memuat data laporan...</span>
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
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Laporan Monitoring Peternak</h1>
                                    <p className="text-gray-600 mt-2">
                                        Pilih peternak untuk melihat dan mengelola laporan triwulan mereka
                                    </p>
                                </div>

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
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredPeternak.map((peternak) => (
                                                    <tr key={peternak.id} className="hover:bg-gray-50">
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
                                                                {peternak.totalLaporan} laporan
                                                            </span>
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                                                            <button
                                                                onClick={() => handleViewPeternakDetail(peternak.id)}
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                Detail
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
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
                        ) : (
                            // Tampilan Detail Laporan Peternak
                            <>
                                {(() => {
                                    const selectedPeternak = getPeternakById(selectedPeternakId);
                                    const laporanPeternak = getFilteredLaporanByPeternak(selectedPeternakId);

                                    return (
                                        <>
                                            {/* Header dengan tombol back */}
                                            <div className="mb-6 sm:mb-8">
                                                <div className="flex items-center mb-4">
                                                    <button
                                                        onClick={handleBackToPeternak}
                                                        className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <ArrowLeft className="h-5 w-5" />
                                                    </button>
                                                    <div>
                                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                            Laporan {selectedPeternak?.namaLengkap}
                                                        </h1>
                                                        <p className="text-gray-600 mt-2">
                                                            Kelola laporan triwulan untuk peternak ini
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Filters and Actions */}
                                            <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                                    <div className="md:col-span-2">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Filter Laporan</h3>
                                                        <p className="text-sm text-gray-600">Filter laporan berdasarkan periode dan tahun</p>
                                                    </div>

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
                                                            defaultOption={triwulanOptions[0]}
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
                                                            defaultOption={tahunOptions[0]}
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
                                                onDelete={handleDeleteLaporan}
                                            />
                                        </>
                                    );
                                })()}
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal untuk Add/Edit Laporan */}
            {showModal && (
    <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-2 sm:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
            <div className="inline-block w-full max-w-md sm:max-w-2xl p-4 sm:p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {modalData ? 'Edit Laporan' : 'Tambah Laporan Baru'}
                    </h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* Form Tambah/Edit Laporan */}
                <LaporanForm
                    peternakId={selectedPeternakId}
                    initialData={modalData || {}} // pastikan selalu objek
                    onSubmit={(data) => {
                        if (modalData) {
                            setLaporanData(prev =>
                                prev.map(l => l.id === modalData.id ? { ...modalData, ...data } : l)
                            );
                        } else {
                            setLaporanData(prev => [
                                ...prev,
                                {
                                    id: `laporan${Math.floor(Math.random() * 100000)}`,
                                    ...data
                                }
                            ]);
                        }
                        setShowModal(false);
                    }}
                    onCancel={() => setShowModal(false)}
                />
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default LaporanPeternak;
