import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, UserCheck, Settings, LogOut, ArrowLeft, FileText } from 'lucide-react';
import logoDomba from '../../assets/icon/logo_domba.png';

const Sidebar = ({ activeItem, isMobileMenuOpen, setIsMobileMenuOpen, onLogout }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Get current user from localStorage
        const user = localStorage.getItem('adminUser');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const getAllMenuItems = () => [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            path: '/admin/dashboard'
        },
        {
            id: 'management',
            label: 'Kelola Admin',
            icon: Users,
            path: '/admin/management',
            superAdminOnly: true // Hanya untuk Super Admin
        },
        {
            id: 'peternak',
            label: 'Kelola Peternak',
            icon: UserCheck,
            path: '/admin/peternak'
            // Bisa diakses Super Admin dan Admin
        },
        {
            id: 'laporan',
            label: 'Laporan Peternak',
            icon: FileText,
            path: '/admin/laporan'
            // Bisa diakses Super Admin dan Admin
        },
        {
            id: 'settings',
            label: 'Pengaturan',
            icon: Settings,
            path: '/admin/settings',
            disabled: true
        }
    ];

    // Filter menu items berdasarkan role user
    const menuItems = getAllMenuItems().filter(item => {
        if (item.superAdminOnly && currentUser?.role !== 'Super Admin') {
            return false;
        }
        return true;
    });

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout(currentUser);
        }
    };

    return (
        <>
            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Header dengan Logo dan Tombol Back */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 h-16 sm:h-20">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <img
                                    src={logoDomba}
                                    alt="e-Gaduh Bono"
                                    className="h-8 w-8 sm:h-10 sm:w-10"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="text-lg sm:text-xl font-bold text-green-700 leading-tight m-0">
                                    e-Gaduh Bono
                                </h2>
                                <p className="hidden sm:block text-xs text-gray-500 leading-tight m-0" style={{ marginBottom: '2px' }}>
                                    Sistem Gaduh Digital
                                </p>
                            </div>
                        </div>

                        {/* Tombol Back untuk Mobile */}
                        <button
                            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                            title="Tutup menu"
                        >
                            <ArrowLeft className="h-5 w-5" />
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
                                    onClick={() => !item.disabled && handleNavigation(item.path)}
                                    disabled={item.disabled}
                                    className={`
                    w-full flex items-center px-3 sm:px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-green-100 text-green-700 border-r-2 border-green-500'
                                            : item.disabled
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                  `}
                                >
                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                    {item.disabled && (
                                        <span className="ml-auto text-xs text-gray-400">Soon</span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="px-3 sm:px-4 py-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-3 sm:px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                            <span className="truncate">Keluar</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
