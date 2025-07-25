import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import ResponsiveTable from '../../components/common/ResponsiveTable';
import Modal from '../../components/admin/Modal';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import { Plus } from 'lucide-react';

const AdminManagement = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [selectedAdminFilter, setSelectedAdminFilter] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Check current user role
        const user = localStorage.getItem('adminUser');
        if (user) {
            const userData = JSON.parse(user);

            // Redirect if not Super Admin
            if (userData.role !== 'Super Admin') {
                navigate('/admin/dashboard');
                return;
            }
        }

        // Sample data
        setTimeout(() => {
            setAdmins([
                {
                    id: 1,
                    username: 'admin',
                    name: 'Administrator',
                    email: 'admin@desabono.com',
                    role: 'Super Admin',
                    status: 'active',
                    createdAt: '2025-01-15',
                    lastLogin: '2025-01-16 10:30',
                    generatedPassword: null
                },
                {
                    id: 2,
                    username: 'admin1',
                    name: 'Budi Santoso',
                    email: 'budi@desabono.com',
                    role: 'Admin',
                    status: 'active',
                    createdAt: '2025-01-10',
                    lastLogin: '2025-01-15 14:20',
                    generatedPassword: 'Bx9#mK8$pQ2wR7!'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, [navigate]);

    const handleAddAdmin = () => {
        setEditingAdmin(null);
        setShowForm(true);
    };

    const handleEditAdmin = (admin) => {
        setEditingAdmin(admin);
        setShowForm(true);
    };

    const handleDeleteAdmin = (adminId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus admin ini?')) {
            setAdmins(admins.filter(admin => admin.id !== adminId));
        }
    };

    const handleSaveAdmin = (adminData) => {
        if (editingAdmin) {
            // Update existing admin
            setAdmins(admins.map(admin =>
                admin.id === editingAdmin.id
                    ? { ...adminData, id: editingAdmin.id, createdAt: editingAdmin.createdAt }
                    : admin
            ));
        } else {
            // Add new admin
            const newAdmin = {
                ...adminData,
                id: Math.max(...admins.map(a => a.id)) + 1,
                createdAt: new Date().toISOString().split('T')[0],
                lastLogin: 'Belum pernah login',
                // Simpan generated password jika ada
                generatedPassword: adminData.generatedPassword || null
            };
            setAdmins([...admins, newAdmin]);
        }
        setShowForm(false);
        setEditingAdmin(null);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingAdmin(null);
    };

    const filteredAdmins = selectedAdminFilter
        ? admins.filter(admin => admin.id.toString() === selectedAdminFilter)
        : admins;

    // Prepare options for SearchableDropdown
    const adminOptions = admins.map(admin => ({
        value: admin.id.toString(),
        label: admin.name,
        subtitle: `${admin.role} • ${admin.email}`,
    }));

    const defaultAdminOption = {
        value: '',
        label: 'Tampilkan Semua Admin',
        subtitle: `${admins.length} admin total`
    };

    // Define table columns
    const adminColumns = [
        {
            key: 'admin',
            header: 'Admin',
            minWidth: '250px',
            render: (admin) => admin // Will be handled by ResponsiveTable
        },
        {
            key: 'status',
            header: 'Status',
            accessor: 'status',
            minWidth: '100px'
        },
        {
            key: 'password',
            header: 'Password',
            accessor: 'password',
            minWidth: '180px'
        },
        {
            key: 'lastLogin',
            header: 'Login Terakhir',
            accessor: 'lastLogin',
            minWidth: '150px'
        },
        {
            key: 'createdAt',
            header: 'Dibuat',
            accessor: 'createdAt',
            minWidth: '120px'
        }
    ];

    if (loading) {
        return (
            <div className="h-screen w-full flex overflow-hidden bg-gray-100">
                <Sidebar
                    activeItem="management"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
                            <span className="text-sm sm:text-base text-gray-600">Memuat data admin...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-100">
            <Sidebar
                activeItem="management"
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
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Admin</h1>
                            <p className="text-gray-600 mt-2">
                                Kelola akun Super Admin dan Admin sistem e-Gaduh Bono
                            </p>
                        </div>

                        {/* Actions Bar */}
                        <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                <div className="flex-1 w-full sm:w-auto">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Filter Admin
                                    </label>
                                    <SearchableDropdown
                                        options={adminOptions}
                                        value={selectedAdminFilter}
                                        onChange={setSelectedAdminFilter}
                                        placeholder="Pilih admin..."
                                        defaultOption={defaultAdminOption}
                                        searchPlaceholder="Cari nama atau email admin..."
                                        displayKey="label"
                                        valueKey="value"
                                        searchKeys={['label', 'subtitle']}
                                        noResultsText="Tidak ada admin ditemukan"
                                    />
                                </div>
                                <button
                                    onClick={handleAddAdmin}
                                    className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto justify-center"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Admin
                                </button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <ResponsiveTable
                            data={filteredAdmins}
                            columns={adminColumns}
                            onEdit={handleEditAdmin}
                            onDelete={handleDeleteAdmin}
                            showPasswordToggle={true}
                        />
                    </div>
                </main>
            </div>

            {/* Admin Form Modal */}
            {showForm && (
                <Modal
                    admin={editingAdmin}
                    onSave={handleSaveAdmin}
                    onCancel={handleCancelForm}
                />
            )}
        </div>
    );
};

export default AdminManagement;
