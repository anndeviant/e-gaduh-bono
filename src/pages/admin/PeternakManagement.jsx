import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import LogoutModal from '../../components/admin/LogoutModal';
import { useLogoutModal } from '../../hooks/useLogoutModal';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import { Plus, User, ChevronDown, ChevronUp, Edit, Trash2, Mail, MapPin, Calendar, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import PeternakForm from '../../components/admin/PeternakForm';
import {
    getAllPeternak,
    createPeternak,
    updatePeternak,
    deletePeternak,
} from '../../services/peternakService';

const PeternakManagement = () => {
    const navigate = useNavigate();
    const [peternak, setPeternak] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list', 'add', 'edit'
    const [editingPeternak, setEditingPeternak] = useState(null);
    const [deletingPeternak, setDeletingPeternak] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedPeternakFilter, setSelectedPeternakFilter] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});

    // Logout modal hook
    const {
        isLogoutModalOpen,
        userToLogout,
        openLogoutModal,
        closeLogoutModal,
        confirmLogout
    } = useLogoutModal();

    useEffect(() => {
        const user = localStorage.getItem('adminUser');
        if (!user) {
            navigate('/admin/login');
            return;
        }

        const fetchPeternak = async () => {
            setLoading(true);
            try {
                const data = await getAllPeternak();
                setPeternak(data);
            } catch (error) {
                // handle error jika perlu
            }
            setLoading(false);
        };

        fetchPeternak();
    }, [navigate]);

    const toggleRowExpansion = (peternakId) => {
        setExpandedRows(prev => ({ ...prev, [peternakId]: !prev[peternakId] }));
    };

    const handleAddPeternak = () => {
        setEditingPeternak(null);
        setView('add');
    };

    const handleEditPeternak = (peternak) => {
        setEditingPeternak(peternak);
        setView('edit');
    };

    const handleShowDeleteConfirm = (peternak) => {
        setDeletingPeternak(peternak);
    };

    const handleDeletePeternak = async () => {
        if (!deletingPeternak) return;
        setDeleteLoading(true);
        try {
            await deletePeternak(deletingPeternak.id);
            const data = await getAllPeternak();
            setPeternak(data);
            setDeletingPeternak(null);
        } catch (error) {
            // handle error jika perlu
        }
        setDeleteLoading(false);
    };

    const handleSavePeternak = async (formData) => {
        setLoading(true);
        try {
            // Pastikan statusKinerja ada, jika tidak isi default
            if (!formData.statusKinerja) {
                formData.statusKinerja = "Baik";
            }
            // Pastikan statusSiklus ada, jika tidak isi default
            if (!formData.statusSiklus) {
                formData.statusSiklus = "Belum Dimulai"; // atau nilai default lain sesuai kebutuhan
            }

            // Logic ternak
            // jumlahTernakAwal dari form, jumlahTernakSaatIni = 0, targetPengembalian = jumlahTernakAwal + Math.floor(jumlahTernakAwal / 5)
            formData.jumlahTernakAwal = Number(formData.jumlahTernakAwal) || 0;
            formData.jumlahTernakSaatIni = 0; 
            formData.targetPengembalian = formData.jumlahTernakAwal + 1;

            if (view === 'edit' && editingPeternak) {
                await updatePeternak(editingPeternak.id, formData);
            } else {
                await createPeternak(formData);
            }
            // Refresh data
            const data = await getAllPeternak();
            setPeternak(data);
            setView('list');
            setEditingPeternak(null);
        } catch (error) {
            // handle error jika perlu
        }
        setLoading(false);
    };

    const handleCancelForm = () => {
        setView('list');
        setEditingPeternak(null);
    };

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
            subtitle: `NIK: ${p.nik}`
        }))
    ];

    const filteredPeternak = selectedPeternakFilter ?
        peternak.filter(p => p.id === selectedPeternakFilter) :
        peternak;

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Baik': 'bg-green-100 text-green-800',
            'Perhatian': 'bg-yellow-100 text-yellow-800',
            'Bermasalah': 'bg-red-100 text-red-800'
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex overflow-hidden bg-gray-100">
                <Sidebar activeItem="peternak" isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} onLogout={openLogoutModal} />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Memuat data peternak...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-100">
            <Sidebar activeItem="peternak" isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} onLogout={openLogoutModal} />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

                <main className="flex-1 overflow-auto p-3 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        {view === 'list' && (
                            <>
                                <div className="mb-6 sm:mb-8">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Peternak</h1>
                                    <p className="text-gray-600 mt-2">Kelola data peternak dan informasi program gaduh di e-Gaduh Bono</p>
                                </div>

                                <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                        <div className="flex-1 w-full sm:w-auto">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Peternak</label>
                                            <SearchableDropdown
                                                options={peternakOptions}
                                                value={selectedPeternakFilter}
                                                onChange={setSelectedPeternakFilter}
                                                placeholder="Pilih peternak..."
                                                defaultOption={defaultPeternakOption}
                                                searchPlaceholder="Cari nama atau NIK..."
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

                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peternak</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Telepon</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kinerja</th>
                                                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredPeternak.map((p) => {
                                                    const isExpanded = expandedRows[p.id];
                                                    return (
                                                        <>
                                                            <tr key={p.id} onClick={() => toggleRowExpansion(p.id)} className="cursor-pointer hover:bg-gray-50">
                                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="flex-shrink-0 h-10 w-10">
                                                                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                                                <User className="h-5 w-5 text-green-600" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <div className="text-sm font-medium text-gray-900">{p.namaLengkap}</div>
                                                                            <div className="text-sm text-gray-500">NIK: {p.nik} / {p.id ? p.id : '-'}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.nomorTelepon}</td>
                                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{getStatusBadge(p.statusKinerja)}</td>
                                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                                    <button className="text-gray-400 hover:text-green-600">
                                                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            {isExpanded && (
                                                                <tr key={`${p.id}-detail`}>
                                                                    <td colSpan={4} className="p-0">
                                                                        <div className="bg-gray-50 p-4 sm:p-6 animate-in slide-in-from-top-2 duration-300">
                                                                            <div className="bg-white rounded-lg border p-4 sm:p-6 relative">
                                                                                <div className="absolute top-4 right-4 flex items-center space-x-2">
                                                                                    <button onClick={() => handleEditPeternak(p)} className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors" title="Edit Peternak"><Edit size={16} /></button>
                                                                                    <button onClick={() => handleShowDeleteConfirm(p)} className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors" title="Hapus Peternak"><Trash2 size={16} /></button>
                                                                                </div>
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                                                    <div className="flex items-start space-x-3">
                                                                                        <Mail className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                                                                                        <div>
                                                                                            <p className="text-xs text-gray-500">Email</p>
                                                                                            <p className="text-sm font-medium text-gray-800">{p.email}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-start space-x-3">
                                                                                        <User className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                                                                                        <div>
                                                                                            <p className="text-xs text-gray-500">Jenis Kelamin</p>
                                                                                            <p className="text-sm font-medium text-gray-800">{p.jenisKelamin}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-start space-x-3 md:col-span-2">
                                                                                        <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                                                                                        <div className="min-w-0 flex-1">
                                                                                            <p className="text-xs text-gray-500">Alamat</p>
                                                                                            <p className="text-sm font-medium text-gray-800 break-words">{p.alamat}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-start space-x-3">
                                                                                        <Calendar className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                                                                                        <div>
                                                                                            <p className="text-xs text-gray-500">Tanggal Bergabung</p>
                                                                                            <p className="text-sm font-medium text-gray-800">{new Date(p.tanggalDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mt-6 pt-4 border-t">
                                                                                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Informasi Program</h4>
                                                                                    {p.statusSiklus ? (
                                                                                        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                                                                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                                                                <p className="text-xs text-blue-700">Ternak Awal</p>
                                                                                                <p className="text-lg font-bold text-blue-800">{p.jumlahTernakAwal}</p>
                                                                                            </div>
                                                                                            <div className="bg-green-50 p-3 rounded-lg">
                                                                                                <p className="text-xs text-green-700">Ternak Saat Ini</p>
                                                                                                <p className="text-lg font-bold text-green-800">{p.jumlahTernakSaatIni}</p>
                                                                                            </div>
                                                                                            <div className="bg-yellow-50 p-3 rounded-lg">
                                                                                                <p className="text-xs text-yellow-700">Wajib Kembali</p>
                                                                                                <p className="text-lg font-bold text-yellow-800">{p.targetPengembalian}</p>
                                                                                            </div>
                                                                                            <div className="col-span-3 mt-2">
                                                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                                                                    <CheckCircle className="h-4 w-4 mr-1.5" />
                                                                                                    Status Siklus: {p.statusSiklus}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="text-center py-4 bg-gray-100 rounded-lg">
                                                                                            <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                                                                            <p className="text-sm text-gray-600">Tidak ada program aktif</p>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {(view === 'add' || view === 'edit') && (
                            <div>
                                <div className="mb-4 sm:mb-4">
                                    <button onClick={handleCancelForm} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-2">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Kembali ke Daftar Peternak
                                    </button>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {view === 'edit' ? 'Edit Data Peternak' : 'Tambah Peternak Baru'}
                                    </h1>
                                    <p className="text-gray-600 mt-2">
                                        {view === 'edit' ? `Mengubah data untuk ${editingPeternak?.namaLengkap}` : 'Tambahkan data peternak baru ke sistem e-Gaduh Bono'}
                                    </p>
                                </div>
                                <PeternakForm
                                    initialData={editingPeternak}
                                    onSave={handleSavePeternak}
                                    onCancel={handleCancelForm}
                                />
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {deletingPeternak && (
                <DeleteConfirmModal
                    admin={deletingPeternak}
                    onConfirm={handleDeletePeternak}
                    onCancel={() => setDeletingPeternak(null)}
                    loading={deleteLoading}
                />
            )}

            {/* Logout Modal */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={closeLogoutModal}
                onConfirm={confirmLogout}
                userName={userToLogout?.fullName}
            />
        </div>
    );
};

export default PeternakManagement;