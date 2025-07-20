import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import StatsCard from '../../components/admin/StatsCard';
import { Users, Heart, BarChart3, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [stats, setStats] = useState({
        totalPeternak: 0,
        totalTernak: 0,
        programAktif: 0,
        tingkatKeberhasilan: 0
    });

    useEffect(() => {
        // Get current user from localStorage
        const user = localStorage.getItem('adminUser');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }

        // Simulasi loading data
        setTimeout(() => {
            setStats({
                totalPeternak: 156,
                totalTernak: 423,
                programAktif: 12,
                tingkatKeberhasilan: 89
            });
            setLoading(false);
        }, 1000);
    }, []);

    const statsData = [
        {
            title: 'Total Peternak',
            value: stats.totalPeternak,
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            change: '+12%',
            changeType: 'increase'
        },
        {
            title: 'Total Ternak',
            value: stats.totalTernak,
            icon: Heart,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            change: '+8%',
            changeType: 'increase'
        },
        {
            title: 'Program Aktif',
            value: stats.programAktif,
            icon: BarChart3,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            change: '+2',
            changeType: 'increase'
        },
        {
            title: 'Tingkat Keberhasilan',
            value: `${stats.tingkatKeberhasilan}%`,
            icon: TrendingUp,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50',
            change: '+5%',
            changeType: 'increase'
        }
    ];

    if (loading) {
        return (
            <div className="h-screen w-full flex overflow-hidden bg-gray-100">
                <Sidebar
                    activeItem="dashboard"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
                            <span className="text-sm sm:text-base text-gray-600">Memuat dashboard...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-100">
            <Sidebar
                activeItem="dashboard"
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-3 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600 mt-2">
                                Selamat datang di sistem pengelolaan e-Gaduh Bono
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <StatsCard stats={statsData} />

                        {/* Quick Actions */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Aksi Cepat
                                </h3>
                                <div className="space-y-3">
                                    {currentUser?.role === 'Super Admin' && (
                                        <button
                                            onClick={() => navigate('/admin/management')}
                                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="font-medium text-gray-900">Kelola Admin</div>
                                            <div className="text-sm text-gray-600">Tambah, edit, atau hapus admin</div>
                                        </button>
                                    )}
                                    <button
                                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed"
                                        disabled
                                    >
                                        <div className="font-medium text-gray-900">Kelola Peternak</div>
                                        <div className="text-sm text-gray-600">Segera hadir</div>
                                    </button>
                                    <button
                                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed"
                                        disabled
                                    >
                                        <div className="font-medium text-gray-900">Laporan Program</div>
                                        <div className="text-sm text-gray-600">Segera hadir</div>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Aktivitas Terbaru
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-600">Admin baru ditambahkan</span>
                                        <span className="text-gray-400">2 jam lalu</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-600">Data peternak diperbarui</span>
                                        <span className="text-gray-400">5 jam lalu</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-600">Laporan bulanan dibuat</span>
                                        <span className="text-gray-400">1 hari lalu</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Status Sistem
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Database</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Normal
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Server</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Normal
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Backup</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Terkini
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
