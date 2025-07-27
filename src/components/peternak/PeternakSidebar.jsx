import { useNavigate } from 'react-router-dom';
import { Home, Eye, HelpCircle, LogIn, X } from 'lucide-react';

const PeternakSidebar = ({ activeItem, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            id: 'home',
            label: 'Beranda',
            icon: Home,
            path: '/'
        },
        {
            id: 'transparency',
            label: 'Data Peternak',
            icon: Eye,
            path: '/peternak/transparency'
        },
        {
            id: 'faq',
            label: 'FAQ Kendala & Solusi',
            icon: HelpCircle,
            path: '/peternak/faq'
        },
        {
            id: 'admin-login',
            label: 'Login Admin',
            icon: LogIn,
            path: '/admin/login'
        }
    ];

    const handleNavigation = (path) => {
        navigate(path, { replace: false });
        setIsMobileMenuOpen(false);
        // Auto scroll to top when navigating
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Dark Overlay - User Friendly (Only show on mobile/tablet) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Always from Right (Only show on mobile/tablet) */}
            <div className={`
                fixed inset-y-0 right-0 z-50 w-64 sm:w-72 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out shadow-lg lg:hidden
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Navigation Header - Consistent with Navbar */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 h-16 sm:h-20">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Navigasi
                            </h2>
                            <p className="text-xs text-gray-500 hidden sm:block">
                                Menu Halaman
                            </p>
                        </div>

                        {/* Tombol Close */}
                        <button
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                            title="Tutup menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 sm:px-4 py-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeItem === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`
                                        w-full flex items-center px-3 sm:px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                        ${isActive
                                            ? 'bg-green-100 text-green-700 border-r-2 border-green-500'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Simple Footer */}
                    <div className="px-3 sm:px-4 py-4 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                © 2025 Desa Bono
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PeternakSidebar;
