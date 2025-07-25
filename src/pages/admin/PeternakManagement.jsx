import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import ResponsiveTable from '../../components/common/ResponsiveTable';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import { Plus, User } from 'lucide-react';

const PeternakManagement = () => {
    const navigate = useNavigate();
    const [peternak, setPeternak] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPeternak, setEditingPeternak] = useState(null);
    const [selectedPeternakFilter, setSelectedPeternakFilter] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedPeternak, setSelectedPeternak] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Check authentication
        const user = localStorage.getItem('adminUser');
        if (!user) {
            navigate('/admin/login');
            return;
        }

        // Sample data peternak
        setTimeout(() => {
            setPeternak([
                {
                    id: 1,
                    namaLengkap: 'Ahmad Subarjo',
                    nik: '3401020304800001',
                    alamat: 'Dusun Ngaliyan RT 01/RW 02, Desa Bono',
                    nomorTelepon: '081234567890',
                    email: 'ahmad.subarjo@email.com',
                    jenisKelamin: 'Laki-laki',
                    statusKinerja: 'Baik',
                    tanggalDaftar: '2024-01-15',
                    programAktif: {
                        jumlahTernakAwal: 10,
                        jumlahTernakSaatIni: 15,
                        kewajibanPengembalian: 12,
                        statusSiklus: 'Aktif'
                    }
                },
                {
                    id: 2,
                    namaLengkap: 'Siti Aminah',
                    nik: '3401020304800002',
                    alamat: 'Dusun Krajan RT 02/RW 01, Desa Bono',
                    nomorTelepon: '081234567891',
                    email: 'siti.aminah@email.com',
                    jenisKelamin: 'Perempuan',
                    statusKinerja: 'Baik',
                    tanggalDaftar: '2024-02-01',
                    programAktif: {
                        jumlahTernakAwal: 8,
                        jumlahTernakSaatIni: 12,
                        kewajibanPengembalian: 10,
                        statusSiklus: 'Aktif'
                    }
                },
                {
                    id: 3,
                    namaLengkap: 'Budi Santoso',
                    nik: '3401020304800003',
                    alamat: 'Dusun Jetis RT 03/RW 02, Desa Bono',
                    nomorTelepon: '081234567892',
                    email: 'budi.santoso@email.com',
                    jenisKelamin: 'Laki-laki',
                    statusKinerja: 'Perhatian',
                    tanggalDaftar: '2024-03-10',
                    programAktif: null
                }
            ]);
            setLoading(false);
        }, 1000);
    }, [navigate]);

    const handleAddPeternak = () => {
        setEditingPeternak(null);
        setShowForm(true);
    };

    const handleEditPeternak = (peternak) => {
        setEditingPeternak(peternak);
        setShowForm(true);
    };

    const handleDeletePeternak = (peternakId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus peternak ini?')) {
            setPeternak(peternak.filter(p => p.id !== peternakId));
        }
    };

    const handleViewDetail = (peternakData) => {
        setSelectedPeternak(peternakData);
        setShowModal(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingPeternak(null);
    };

    // Create options for SearchableDropdown
    const defaultPeternakOption = {
        label: "Semua Peternak",
        value: "",
        subtitle: "Tampilkan semua data peternak"
    };

    const peternakOptions = [
        defaultPeternakOption,
        ...peternak.map(p => ({
            label: p.namaLengkap,
            value: p.id,
            subtitle: `NIK: ${p.nik} • ${p.alamat}`
        }))
    ];

    const filteredPeternak = selectedPeternakFilter ?
        peternak.filter(p => p.id === selectedPeternakFilter) :
        peternak;

    // Define table columns
    const peternakColumns = [
        {
            key: 'peternak',
            header: 'Peternak',
            minWidth: '300px',
            render: (peternak) => peternak // Will be handled by ResponsiveTable
        },
        {
            key: 'nomorTelepon',
            header: 'No. Telepon',
            accessor: 'nomorTelepon',
            minWidth: '150px'
        },
        {
            key: 'status',
            header: 'Status Kinerja',
            accessor: 'statusKinerja',
            minWidth: '140px'
        }
    ];

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

    if (loading) {
        return (
            <div className="h-screen w-full flex overflow-hidden bg-gray-100">
                <Sidebar
                    activeItem="peternak"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
                            <span className="text-sm sm:text-base text-gray-600">Memuat data peternak...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-100">
            <Sidebar
                activeItem="peternak"
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-3 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Peternak</h1>
                            <p className="text-gray-600 mt-2">
                                Kelola data peternak dan informasi program gaduh di e-Gaduh Bono
                            </p>
                        </div>

                        {/* Actions Bar */}
                        <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                <div className="flex-1 w-full sm:w-auto">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Filter Peternak
                                    </label>
                                    <SearchableDropdown
                                        options={peternakOptions}
                                        value={selectedPeternakFilter}
                                        onChange={setSelectedPeternakFilter}
                                        placeholder="Pilih peternak..."
                                        defaultOption={defaultPeternakOption}
                                        searchPlaceholder="Cari nama, NIK, atau alamat..."
                                        displayKey="label"
                                        valueKey="value"
                                        searchKeys={['label', 'subtitle']}
                                        noResultsText="Tidak ada peternak ditemukan"
                                    />
                                </div>
                                <button
                                    onClick={handleAddPeternak}
                                    className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto justify-center"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Peternak
                                </button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <ResponsiveTable
                            data={filteredPeternak}
                            columns={peternakColumns}
                            onEdit={handleEditPeternak}
                            onDelete={handleDeletePeternak}
                            onView={handleViewDetail}
                        />
                    </div>
                </main>
            </div>

            {/* Detail Modal */}
            {showModal && selectedPeternak && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
                        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Detail Peternak</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <User className="h-20 w-20 text-gray-400 bg-gray-100 rounded-full p-4" />
                                    <div>
                                        <h4 className="text-2xl font-semibold">{selectedPeternak.namaLengkap}</h4>
                                        <div className="mt-2">{getStatusBadge(selectedPeternak.statusKinerja)}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">NIK:</span>
                                            <p className="text-sm mt-1">{selectedPeternak.nik}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Jenis Kelamin:</span>
                                            <p className="text-sm mt-1">{selectedPeternak.jenisKelamin}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">No. Telepon:</span>
                                            <p className="text-sm mt-1">{selectedPeternak.nomorTelepon}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Email:</span>
                                            <p className="text-sm mt-1">{selectedPeternak.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Alamat:</span>
                                            <p className="text-sm mt-1">{selectedPeternak.alamat}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Tanggal Bergabung:</span>
                                            <p className="text-sm mt-1">{new Date(selectedPeternak.tanggalDaftar).toLocaleDateString('id-ID')}</p>
                                        </div>
                                        {selectedPeternak.programAktif && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Program Aktif:</span>
                                                <div className="text-sm mt-1 space-y-1">
                                                    <div>Jumlah Ternak Saat Ini: <strong>{selectedPeternak.programAktif.jumlahTernakSaatIni} ekor</strong></div>
                                                    <div>Kewajiban Pengembalian: <strong>{selectedPeternak.programAktif.kewajibanPengembalian} ekor</strong></div>
                                                    <div>Status: <span className="text-green-600 font-medium">{selectedPeternak.programAktif.statusSiklus}</span></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Tutup
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            handleEditPeternak(selectedPeternak);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                                    >
                                        Edit Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Modal Placeholder */}
            {showForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCancelForm}></div>
                        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {editingPeternak ? 'Edit Peternak' : 'Tambah Peternak Baru'}
                                </h3>
                                <button onClick={handleCancelForm} className="text-gray-400 hover:text-gray-600">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-center py-8">
                                <p className="text-gray-500">Form akan diimplementasi selanjutnya</p>
                                <div className="mt-4 space-x-3">
                                    <button
                                        onClick={handleCancelForm}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeternakManagement;
