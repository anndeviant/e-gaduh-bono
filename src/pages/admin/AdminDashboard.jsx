import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';
import StatsCard from '../../components/admin/StatsCard';
import LogoutModal from '../../components/admin/LogoutModal';
import { useLogoutModal } from '../../hooks/useLogoutModal';
import { Users, Heart, BarChart3, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getAllPeternak } from '../../services/peternakService';
import { getAllLaporan } from '../../services/laporanService';
import useNotification from '../../hooks/useNotification';
import Notification from '../../components/common/Notification';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [peternakData, setPeternakData] = useState([]);
    const [laporanData, setLaporanData] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);

    const {
        isLogoutModalOpen,
        userToLogout,
        openLogoutModal,
        closeLogoutModal,
        confirmLogout
    } = useLogoutModal();

    const { notification, showError, hideNotification } = useNotification();

    const generateRecentActivities = useCallback((peternak, laporan) => {
        const activities = [];

        // Get recent reports (last 5)
        const recentReports = laporan
            .sort((a, b) => new Date(b.tanggalLaporan) - new Date(a.tanggalLaporan))
            .slice(0, 5);

        recentReports.forEach(report => {
            const peternakName = peternak.find(p => p.id === report.idPeternak)?.namaLengkap || 'Unknown';
            const reportDate = new Date(report.tanggalLaporan);
            const timeAgo = getTimeAgo(reportDate);

            activities.push({
                type: 'laporan',
                message: `Laporan ke-${report.reportNumber} dari ${peternakName}`,
                time: timeAgo,
                date: reportDate
            });
        });

        // Get recent completed programs
        const completedPrograms = peternak
            .filter(p => p.statusSiklus === 'Selesai')
            .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
            .slice(0, 3);

        completedPrograms.forEach(p => {
            const completedDate = new Date(p.updatedAt || p.createdAt);
            activities.push({
                type: 'selesai',
                message: `Program ${p.namaLengkap} telah selesai`,
                time: getTimeAgo(completedDate),
                date: completedDate
            });
        });

        // Sort by date and take latest 6
        const sortedActivities = activities
            .sort((a, b) => b.date - a.date)
            .slice(0, 6);

        setRecentActivities(sortedActivities);
    }, []);

    const getTimeAgo = (date) => {
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            return `${diffDays} hari lalu`;
        } else if (diffHours > 0) {
            return `${diffHours} jam lalu`;
        } else {
            return 'Baru saja';
        }
    };

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);

            // Load data peternak dan laporan dari Firebase
            const [peternakResponse, laporanResponse] = await Promise.all([
                getAllPeternak(),
                getAllLaporan()
            ]);

            setPeternakData(peternakResponse);
            setLaporanData(laporanResponse);

            // Generate recent activities based on real data
            generateRecentActivities(peternakResponse, laporanResponse);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showError('Gagal memuat data dashboard', error.message);
        } finally {
            setLoading(false);
        }
    }, [showError, generateRecentActivities]);

    useEffect(() => {
        // Get current user from localStorage
        const user = localStorage.getItem('adminUser');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }

        loadDashboardData();
    }, [loadDashboardData]);

    const getCurrentLivestockCount = (peternakId) => {
        const peternakLaporan = laporanData.filter(l => l.idPeternak === peternakId);
        if (peternakLaporan.length === 0) return 0;

        const latestLaporan = peternakLaporan.sort((a, b) => b.reportNumber - a.reportNumber)[0];
        return latestLaporan ? latestLaporan.jumlahTernakSaatIni : 0;
    };

    // Calculate real statistics
    const totalStats = {
        totalPeternak: peternakData.length,
        totalTernak: peternakData.reduce((sum, peternak) => sum + getCurrentLivestockCount(peternak.id), 0),
        programProgress: peternakData.filter(peternak => peternak.statusSiklus === 'Progress' || peternak.statusSiklus === 'Mulai').length,
        programSelesai: peternakData.filter(peternak => peternak.statusSiklus === 'Selesai').length
    };

    const statsData = [
        {
            title: 'Total Peternak',
            value: totalStats.totalPeternak,
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Total Ternak',
            value: totalStats.totalTernak,
            icon: Heart,
            color: 'bg-red-500',
            bgColor: 'bg-red-50'
        },
        {
            title: 'Program Berjalan',
            value: totalStats.programProgress,
            icon: Activity,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Program Selesai',
            value: totalStats.programSelesai,
            icon: CheckCircle,
            color: 'bg-green-500',
            bgColor: 'bg-green-50'
        }
    ];

    if (loading) {
        return (
            <div className="h-screen w-full flex overflow-hidden bg-gray-100">
                <Sidebar
                    activeItem="dashboard"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    onLogout={openLogoutModal}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Memuat dashboard...</span>
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
                onLogout={openLogoutModal}
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
                                Selamat datang di sistem admin e-Gaduh Bono
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <StatsCard stats={statsData} />

                        {/* Quick Actions & Recent Activities */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                                    Aksi Cepat
                                </h3>
                                <div className="space-y-3">
                                    {currentUser?.role === 'Super Admin' && (
                                        <button
                                            onClick={() => navigate('/admin/management')}
                                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-green-300 transition-all"
                                        >
                                            <div className="font-medium text-gray-900">Kelola Admin</div>
                                            <div className="text-sm text-gray-600">Tambah, edit, atau hapus admin</div>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate('/admin/peternak')}
                                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-green-300 transition-all"
                                    >
                                        <div className="font-medium text-gray-900">Kelola Peternak</div>
                                        <div className="text-sm text-gray-600">Tambah, edit, atau lihat data peternak</div>
                                    </button>
                                    <button
                                        onClick={() => navigate('/admin/laporan')}
                                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-green-300 transition-all"
                                    >
                                        <div className="font-medium text-gray-900">Monitoring Laporan</div>
                                        <div className="text-sm text-gray-600">Lihat dan kelola laporan peternak</div>
                                    </button>
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                                    Aktivitas Terbaru
                                </h3>
                                <div className="space-y-3">
                                    {recentActivities.length > 0 ? (
                                        recentActivities.map((activity, index) => (
                                            <div key={index} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                                                <div className="flex items-start space-x-2">
                                                    {activity.type === 'laporan' ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    ) : (
                                                        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    )}
                                                    <span className="text-sm text-gray-600">{activity.message}</span>
                                                </div>
                                                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{activity.time}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <span className="text-sm text-gray-500">Belum ada aktivitas</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* System Overview */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Activity className="h-5 w-5 mr-2 text-purple-600" />
                                    Ringkasan Program
                                </h3>
                                <div className="space-y-4">
                                    {/* Program Stats */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Program Berjalan</span>
                                            <span className="text-lg font-bold text-purple-600">{totalStats.programProgress}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${totalStats.totalPeternak > 0 ? (totalStats.programProgress / totalStats.totalPeternak) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Program Selesai</span>
                                            <span className="text-lg font-bold text-green-600">{totalStats.programSelesai}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${totalStats.totalPeternak > 0 ? (totalStats.programSelesai / totalStats.totalPeternak) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Total Laporan */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                        <span className="text-sm text-gray-600">Total Laporan</span>
                                        <span className="text-sm font-medium text-gray-900">{laporanData.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

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

export default AdminDashboard;
