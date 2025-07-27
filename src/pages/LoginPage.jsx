import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';
import logoDomba from '../assets/icon/logo_domba.png';
import authService from '../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = await authService.login(formData.email, formData.password);

            if (user) {
                // Simpan token di localStorage
                localStorage.setItem('adminToken', user.accessToken);
                localStorage.setItem('adminUser', JSON.stringify({
                    id: user.uid,
                    email: user.email,
                    name: user.fullName,
                    role: user.role
                }));

                // Redirect ke dashboard
                navigate('/admin/dashboard');
            } else {
                setError('Email atau password salah');
            }
        } catch (error) {
            setError(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Arrow Back Button - Top Left */}
            <button
                onClick={handleBackToHome}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                title="Kembali ke Beranda"
            >
                <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-800" />
            </button>

            <div className="max-w-md w-full space-y-4">
                <div>
                    <div className="flex justify-center mb-4">
                        <img
                            src={logoDomba}
                            alt="e-Gaduh Bono"
                            className="h-20 w-20"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                    <h3 className="text-center text-2xl font-bold text-gray-900 mb-2">
                        Login Admin
                    </h3>
                    <h2 className="text-center text-3xl font-extrabold text-green-700 mb-2">
                        e-Gaduh Bono
                    </h2>
                    <p className="text-center text-sm text-gray-600">
                        Masuk untuk mengakses dashboard admin
                    </p>
                </div>

                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Username/Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Mail className="h-4 w-4 text-gray-600" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Masukkan email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Lock className="h-4 w-4 text-gray-600" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Masukkan password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 hover:bg-gray-50 hover:bg-opacity-50 rounded-r-lg transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Memproses...
                                </div>
                            ) : (
                                'Masuk'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleBackToHome}
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                            Kembali ke Beranda
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
