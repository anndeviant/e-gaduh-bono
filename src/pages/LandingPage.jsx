import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Users, BarChart3, Heart } from 'lucide-react';
import logoDomba from '../assets/icon/logo_domba.png';

const LandingPage = () => {
    const navigate = useNavigate();
    const [statistics] = useState({
        totalPeternak: 156,
        totalTernak: 423,
        totalProgram: 12,
        successRate: 89
    });

    const handleAdminLogin = () => {
        navigate('/admin/login');
    };

    const handleViewStatistics = () => {
        // Placeholder untuk view statistics peternak
        alert('Fitur statistik untuk peternak akan segera hadir!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <img
                                src={logoDomba}
                                alt="e-Gaduh Bono"
                                className="h-12 w-12"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <h1 className="text-2xl font-bold text-green-700">e-Gaduh Bono</h1>
                        </div>
                        <button
                            onClick={handleAdminLogin}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                            Login Admin
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Sistem Gaduh
                            <span className="block text-green-600">Desa Bono</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Platform digital terpadu untuk mengelola program gaduh ternak di Desa Bono.
                            Transparansi, akuntabilitas, dan efisiensi dalam satu sistem.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleViewStatistics}
                                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                Lihat Statistik Program
                            </button>
                            <button
                                onClick={handleAdminLogin}
                                className="inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                            >
                                Masuk sebagai Pengelola
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Statistik Program Gaduh
                        </h2>
                        <p className="text-gray-600">
                            Data real-time program gaduh ternak di Desa Bono
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-6 bg-green-50 rounded-xl">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{statistics.totalPeternak}</div>
                            <div className="text-gray-600 font-medium">Total Peternak</div>
                        </div>

                        <div className="text-center p-6 bg-blue-50 rounded-xl">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{statistics.totalTernak}</div>
                            <div className="text-gray-600 font-medium">Total Ternak</div>
                        </div>

                        <div className="text-center p-6 bg-purple-50 rounded-xl">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{statistics.totalProgram}</div>
                            <div className="text-gray-600 font-medium">Program Aktif</div>
                        </div>

                        <div className="text-center p-6 bg-yellow-50 rounded-xl">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="w-8 h-8 text-yellow-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{statistics.successRate}%</div>
                            <div className="text-gray-600 font-medium">Tingkat Keberhasilan</div>
                        </div>
                    </div>
                </div>``
            </section>

            {/* About Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Tentang Sistem Gaduh e-Gaduh Bono
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                e-Gaduh adalah platform digital yang mengubah sistem gaduh tradisional menjadi modern,
                                efisien, dan transparan. Sistem ini membantu pengelola desa dalam:
                            </p>
                            <ul className="space-y-3 text-gray-600">
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
                        <div className="relative">
                            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-8 text-white text-center">
                                <h3 className="text-2xl font-bold mb-4">Untuk Pengelola Desa</h3>
                                <p className="mb-6">
                                    Kelola seluruh aspek program gaduh dengan mudah dan efisien
                                </p>
                                <button
                                    onClick={handleAdminLogin}
                                    className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Akses Dashboard Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">e-Gaduh Bono</h3>
                        <p className="text-gray-400">
                            Sistem Gaduh Digital Desa Bono - Meningkatkan Kesejahteraan Peternak
                        </p>
                        <p className="text-gray-500 text-sm mt-4">
                            © 2025 Desa Bono. Semua hak cipta dilindungi.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
