import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Users, BarChart3, Heart, CheckCircle } from 'lucide-react';
import PeternakSidebar from '../components/peternak/PeternakSidebar';
import PeternakNavbar from '../components/peternak/PeternakNavbar';
import Footer from '../components/common/Footer';
import { getAllPeternak } from '../services/peternakService';
import { getAllLaporan } from '../services/laporanService';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [statistics, setStatistics] = useState({
        totalPeternak: 0,
        totalTernak: 0,
        programProgress: 0,
        programSelesai: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            setLoading(true);
            console.log('Loading statistics...');

            // Load data peternak dan laporan dari Firebase
            const [peternakResponse, laporanResponse] = await Promise.all([
                getAllPeternak(),
                getAllLaporan()
            ]);

            console.log('Peternak data:', peternakResponse);
            console.log('Laporan data:', laporanResponse);

            // Pastikan response adalah array
            const peternakData = Array.isArray(peternakResponse) ? peternakResponse : [];
            const laporanData = Array.isArray(laporanResponse) ? laporanResponse : [];

            // Hitung total ternak saat ini
            const totalTernak = peternakData.reduce((sum, peternak) => {
                const peternakLaporan = laporanData
                    .filter(laporan => laporan.idPeternak === peternak.id)
                    .sort((a, b) => (a.reportNumber || 0) - (b.reportNumber || 0));

                const latestLaporan = peternakLaporan.length > 0 ?
                    peternakLaporan[peternakLaporan.length - 1] : null;

                return sum + (latestLaporan ? (latestLaporan.jumlahTernakSaatIni || 0) : 0);
            }, 0);

            // Hitung program progress dan selesai
            const programProgress = peternakData.filter(peternak =>
                peternak.statusSiklus === 'Aktif' || peternak.statusSiklus === 'Mulai'
            ).length;

            const programSelesai = peternakData.filter(peternak =>
                peternak.statusSiklus === 'Selesai'
            ).length;

            const newStats = {
                totalPeternak: peternakData.length,
                totalTernak: totalTernak,
                programProgress: programProgress,
                programSelesai: programSelesai
            };

            console.log('Calculated statistics:', newStats);
            setStatistics(newStats);

        } catch (error) {
            console.error('Error loading statistics:', error);
            // Jika error, gunakan data default tapi tetap tampilkan 0 bukan loading
            setStatistics({
                totalPeternak: 0,
                totalTernak: 0,
                programProgress: 0,
                programSelesai: 0
            });
        } finally {
            setLoading(false);
            console.log('Loading finished');
        }
    };

    const handleAdminLogin = () => {
        navigate('/admin/login');
    };

    const handleViewStatistics = () => {
        navigate('/peternak/transparency');
    };

    const toggleSidebar = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Sidebar */}
            <PeternakSidebar
                activeItem="home"
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            {/* Navbar */}
            <PeternakNavbar onToggleSidebar={toggleSidebar} />

            {/* Hero Section */}
            <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Sistem Gaduh
                            <span className="block text-green-600">Desa Bono</span>
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                            Platform digital terpadu untuk mengelola program gaduh ternak di Desa Bono.
                            Transparansi, akuntabilitas, dan efisiensi dalam satu sistem.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                            <button
                                onClick={handleViewStatistics}
                                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                Lihat Data Peternak
                            </button>
                            <button
                                onClick={handleAdminLogin}
                                className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                            >
                                Masuk sebagai Admin
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Statistik Program Gaduh
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base px-4">
                            Data real-time program gaduh ternak di Desa Bono
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        <div className="text-center p-4 sm:p-6 bg-green-50 rounded-xl">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                                {loading ? (
                                    <div className="animate-pulse bg-gray-200 rounded w-8 h-8 mx-auto"></div>
                                ) : (
                                    statistics.totalPeternak
                                )}
                            </div>
                            <div className="text-gray-600 font-medium text-xs sm:text-sm">Total Peternak</div>
                        </div>

                        <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                                {loading ? (
                                    <div className="animate-pulse bg-gray-200 rounded w-8 h-8 mx-auto"></div>
                                ) : (
                                    statistics.totalTernak
                                )}
                            </div>
                            <div className="text-gray-600 font-medium text-xs sm:text-sm">Total Ternak</div>
                        </div>

                        <div className="text-center p-4 sm:p-6 bg-purple-50 rounded-xl">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                                {loading ? (
                                    <div className="animate-pulse bg-gray-200 rounded w-8 h-8 mx-auto"></div>
                                ) : (
                                    statistics.programProgress
                                )}
                            </div>
                            <div className="text-gray-600 font-medium text-xs sm:text-sm">Program Progress</div>
                        </div>

                        <div className="text-center p-4 sm:p-6 bg-emerald-50 rounded-xl">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                                {loading ? (
                                    <div className="animate-pulse bg-gray-200 rounded w-8 h-8 mx-auto"></div>
                                ) : (
                                    statistics.programSelesai
                                )}
                            </div>
                            <div className="text-gray-600 font-medium text-xs sm:text-sm">Program Selesai</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-12 sm:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                                Tentang Sistem Gaduh e-Gaduh Bono
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                                e-Gaduh adalah platform digital yang mengubah sistem gaduh tradisional menjadi modern,
                                efisien, dan transparan. Sistem ini membantu admin desa dalam:
                            </p>
                            <ul className="space-y-3 text-gray-600 text-sm sm:text-base">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                                    Mengelola data peternak dan ternak secara digital
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                                    Melacak siklus program dari awal hingga akhir
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                                    Membuat laporan perkembangan ternak secara berkala
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                                    Meningkatkan transparansi dan akuntabilitas program
                                </li>
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 relative">
                            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 sm:p-8 text-white text-center">
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Untuk Admin Desa</h3>
                                <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                                    Kelola seluruh aspek program gaduh dengan mudah dan efisien
                                </p>
                                <button
                                    onClick={handleAdminLogin}
                                    className="bg-white text-green-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
                                >
                                    Akses Dashboard Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
