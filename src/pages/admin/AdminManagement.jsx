import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import ResponsiveTable from '../../components/common/ResponsiveTable';
import AdminForm from '../../components/admin/AdminForm';
import CommonDeleteModal from '../../components/common/CommonDeleteModal';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import Notification from '../../components/common/Notification';
import LogoutModal from '../../components/admin/LogoutModal';
import useNotification from '../../hooks/useNotification';
import { useLogoutModal } from '../../hooks/useLogoutModal';
import { Plus, ArrowLeft } from 'lucide-react';
import adminService from '../../services/adminService';
import authService from '../../services/authService';

const AdminManagement = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list', 'add', 'edit'
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [deletingAdmin, setDeletingAdmin] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedAdminFilter, setSelectedAdminFilter] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Hooks
    const {
        isLogoutModalOpen,
        userToLogout,
        openLogoutModal,
        closeLogoutModal,
        confirmLogout
    } = useLogoutModal();

    // Notification hook
    const {
        notification,
        showSuccess,
        showError,
        showWarning,
        hideNotification
    } = useNotification();

    useEffect(() => {
        const user = localStorage.getItem('adminUser');
        if (user) {
            const userData = JSON.parse(user);
            setCurrentUser(userData);

            if (userData.role !== 'Super Admin') {
                navigate('/admin/dashboard');
                return;
            }
        } else {
            navigate('/login');
            return;
        }

        const fetchAdmins = async () => {
            try {
                const adminsData = await adminService.getAdmins();
                setAdmins(adminsData.map(admin => ({
                    ...admin,
                    createdAt: admin.createdAt?.toDate().toISOString().split('T')[0] || 'N/A',
                    lastLogin: admin.lastLogin?.toDate().toLocaleString() || 'Belum pernah login'
                })));
            } catch (error) {
                console.error("Failed to fetch admins:", error);
                showError(
                    'Gagal Memuat Data',
                    'Tidak dapat memuat data admin. Silakan refresh halaman.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, [navigate, showError]);

    const handleAddAdmin = () => {
        setEditingAdmin(null);
        setView('add');
    };

    const handleEditAdmin = (admin) => {
        setEditingAdmin(admin);
        setView('edit');
    };

    const handleShowDeleteConfirm = (admin) => {
        if (currentUser && currentUser.email === admin.email) {
            alert("Anda tidak dapat menghapus akun Anda sendiri.");
            return;
        }
        setDeletingAdmin(admin);
    };

    const handleDeleteAdmin = async () => {
        if (!deletingAdmin) return;

        setDeleteLoading(true);
        try {
            const adminName = deletingAdmin.fullName;
            const adminRole = deletingAdmin.role;

            if (deletingAdmin.role === 'Super Admin') {
                // Use authService for Super Admin deletion
                await authService.deleteSuperAdmin(deletingAdmin.id);
            } else {
                // Use adminService for regular Admin deletion
                await adminService.deleteAdmin(deletingAdmin.id);
            }

            setAdmins(admins.filter(admin => admin.id !== deletingAdmin.id));
            setDeletingAdmin(null);

            // Show success notification
            showSuccess(
                'Admin Berhasil Dihapus!',
                `${adminRole} ${adminName} telah dihapus dari sistem.`
            );

        } catch (error) {
            console.error("Failed to delete admin:", error);

            // Show error notification
            showError(
                'Gagal Menghapus Admin',
                'Terjadi kesalahan saat menghapus admin. Silakan coba lagi.'
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSaveAdmin = async (adminData) => {
        try {
            if (editingAdmin) {
                // Update existing admin
                if (editingAdmin.role === 'Super Admin') {
                    // Use authService for Super Admin updates
                    const updatedAdmin = await authService.updateSuperAdmin(editingAdmin.id, adminData, adminData.password);
                    setAdmins(admins.map(admin =>
                        admin.id === editingAdmin.id ? { ...admin, ...updatedAdmin } : admin
                    ));
                    showSuccess(
                        'Admin Berhasil Diperbarui!',
                        `Super Admin ${adminData.fullName} telah diperbarui.`
                    );
                } else {
                    // Use adminService for regular Admin updates
                    await adminService.updateAdmin(editingAdmin.id, adminData);
                    setAdmins(admins.map(admin =>
                        admin.id === editingAdmin.id ? { ...admin, ...adminData } : admin
                    ));
                    showSuccess(
                        'Admin Berhasil Diperbarui!',
                        `Admin ${adminData.fullName} telah diperbarui.`
                    );
                }
            } else {
                // Create new admin
                if (adminData.role === 'Super Admin') {
                    const newSuperAdmin = await authService.registerSuperAdmin(adminData);
                    const displayAdmin = {
                        ...newSuperAdmin,
                        createdAt: new Date().toISOString().split('T')[0],
                        lastLogin: 'Belum pernah login'
                    };
                    setAdmins([...admins, displayAdmin]);
                    showSuccess(
                        'Super Admin Berhasil Ditambahkan!',
                        `Super Admin ${adminData.fullName} telah berhasil dibuat.`
                    );
                } else {
                    const newAdminFromDb = await adminService.addAdmin(adminData);
                    const displayAdmin = {
                        ...newAdminFromDb,
                        password: adminData.password,
                        createdAt: new Date().toISOString().split('T')[0],
                        lastLogin: 'Belum pernah login'
                    };
                    setAdmins([...admins, displayAdmin]);
                    showSuccess(
                        'Admin Berhasil Ditambahkan!',
                        `Admin ${adminData.fullName} telah berhasil dibuat.`
                    );
                }
            }

            // Redirect back to list view after successful operation
            setTimeout(() => {
                setView('list');
                setEditingAdmin(null);
            }, 1500); // Give time for user to see the notification

        } catch (error) {
            console.error("Gagal menyimpan admin:", error);

            // Show error notification
            if (editingAdmin) {
                showError(
                    'Gagal Memperbarui Admin',
                    'Terjadi kesalahan saat memperbarui data admin. Silakan coba lagi.'
                );
            } else {
                showError(
                    'Gagal Menambahkan Admin',
                    'Terjadi kesalahan saat menambahkan admin baru. Silakan coba lagi.'
                );
            }
        }
    };

    const handleCancelForm = () => {
        // Show warning if user is leaving without saving
        showWarning(
            'Form Dibatalkan',
            editingAdmin ? 'Perubahan tidak disimpan.' : 'Penambahan admin dibatalkan.'
        );

        setTimeout(() => {
            setView('list');
            setEditingAdmin(null);
        }, 1000);
    };

    const filteredAdmins = selectedAdminFilter
        ? admins.filter(admin => admin.id.toString() === selectedAdminFilter)
        : admins;

    const adminOptions = admins.map(admin => ({
        value: admin.id.toString(),
        label: admin.fullName,
        subtitle: `${admin.role} • ${admin.email}`,
    }));

    const defaultAdminOption = {
        value: '',
        label: 'Tampilkan Semua Admin',
        subtitle: `${admins.length} admin total`
    };

    const adminColumns = [
        {
            key: 'admin',
            header: 'Admin',
            minWidth: '200px',
            render: (admin) => ({
                name: admin.fullName,
                email: admin.email
            })
        },
        {
            key: 'role',
            header: 'Role',
            accessor: 'role',
            minWidth: '120px',
            render: (admin) => (
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${admin.role === 'Super Admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                    }`}>
                    {admin.role}
                </span>
            )
        },
        { key: 'password', header: 'Password', accessor: 'password', minWidth: '180px' },
        { key: 'lastLogin', header: 'Login Terakhir', accessor: 'lastLogin', minWidth: '150px' },
        { key: 'createdAt', header: 'Dibuat', accessor: 'createdAt', minWidth: '120px' }
    ];

    if (loading) {
        return (
            <div className="h-screen w-full flex overflow-hidden bg-gray-100">
                <Sidebar activeItem="management" isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} onLogout={openLogoutModal} />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Memuat data admin...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-100">
            <Sidebar activeItem="management" isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} onLogout={openLogoutModal} />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

                <main className="flex-1 overflow-auto p-3 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        {view === 'list' ? (
                            <>
                                <div className="mb-6 sm:mb-8">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Admin</h1>
                                    <p className="text-gray-600 mt-2">Kelola akun Super Admin dan Admin sistem e-Gaduh Bono</p>
                                </div>
                                <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                        <div className="flex-1 w-full sm:w-auto">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Admin</label>
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
                                <ResponsiveTable
                                    data={filteredAdmins}
                                    columns={adminColumns}
                                    onEdit={handleEditAdmin}
                                    onDelete={handleShowDeleteConfirm}
                                    showPasswordToggle={true}
                                    currentUserEmail={currentUser?.email}
                                />
                            </>
                        ) : (
                            <div>
                                <div className="mb-4 sm:mb-4">
                                    <button onClick={handleCancelForm} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-2">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Kembali ke Daftar Admin
                                    </button>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {view === 'edit' ? 'Edit Admin' : 'Tambah Admin Baru'}
                                    </h1>
                                    <p className="text-gray-600 mt-2">
                                        {view === 'edit' ? `Mengubah data untuk ${editingAdmin?.fullName}` : 'Buat akun admin atau super admin baru'}
                                    </p>
                                </div>
                                <AdminForm
                                    admin={editingAdmin}
                                    onSave={handleSaveAdmin}
                                    onCancel={handleCancelForm}
                                    currentUserRole={currentUser?.role}
                                />
                            </div>
                        )}
                    </div>
                </main>
            </div>

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

            {deletingAdmin && (
                <CommonDeleteModal
                    item={deletingAdmin}
                    type="admin"
                    onConfirm={handleDeleteAdmin}
                    onCancel={() => setDeletingAdmin(null)}
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

export default AdminManagement;