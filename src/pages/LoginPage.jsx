import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import logoDomba from '../assets/icon/logo_domba.png';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
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
            // Sample users untuk testing
            const users = [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    name: 'Administrator',
                    role: 'Super Admin'
                },
                {
                    id: 2,
                    username: 'admin1',
                    password: 'Bx9#mK8$pQ2wR7!',
                    name: 'Budi Santoso',
                    role: 'Admin'
                }
            ];

            const user = users.find(u =>
                u.username === formData.username && u.password === formData.password
            );

            if (user) {
                // Simpan token di localStorage
                localStorage.setItem('adminToken', 'dummy-token');
                localStorage.setItem('adminUser', JSON.stringify({
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role
                }));

                // Redirect ke dashboard
                navigate('/admin/dashboard');
            } else {
                setError('Username atau password salah');
            }
        } catch (error) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <img
                            src={logoDomba}
                            alt="e-Gaduh Bono"
                            className="h-16 w-16"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Login Admin
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Masuk untuk mengakses dashboard admin e-Gaduh Bono
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Username/Email Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Email/Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Mail className="h-4 w-4 text-gray-600" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Masukkan email atau username"
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

                    {/* Demo Credentials */}
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
                        <p className="font-medium mb-2">Demo Credentials:</p>
                        <div className="space-y-1">
                            <div>
                                <p><strong>Super Admin:</strong></p>
                                <p>Username: <span className="font-mono">admin</span> | Password: <span className="font-mono">admin123</span></p>
                            </div>
                            <div>
                                <p><strong>Admin:</strong></p>
                                <p>Username: <span className="font-mono">admin1</span> | Password: <span className="font-mono">Bx9#mK8$pQ2wR7!</span></p>
                            </div>
                        </div>
                    </div>

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
