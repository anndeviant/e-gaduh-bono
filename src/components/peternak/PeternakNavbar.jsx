import { Menu, Home, Eye, HelpCircle, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoDomba from '../../assets/icon/logo_domba.png';

const PeternakNavbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();

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
        // Auto scroll to top when navigating
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isActiveItem = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 px-3 sm:px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between h-8 sm:h-12">
                {/* Left side - Logo & Brand */}
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
                        <h1 className="text-lg sm:text-xl font-bold text-green-700 leading-tight m-0">
                            e-Gaduh Bono
                        </h1>
                        <p className="hidden sm:block text-xs text-gray-500 leading-tight m-0" style={{ marginBottom: '2px' }}>
                            Sistem Gaduh Digital
                        </p>
                    </div>
                </div>

                {/* Right side - Navigation Menu & Hamburger button */}
                <div className="flex items-center ml-auto">
                    {/* Desktop Navigation Menu - Hidden on mobile/tablet */}
                    <div className="hidden lg:flex items-center space-x-1 mr-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = isActiveItem(item.path);

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`
                                        flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                        ${isActive
                                            ? 'bg-green-100 text-green-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                    `}
                                    title={item.label}
                                >
                                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span className="whitespace-nowrap">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Hamburger Menu Button - Hidden on desktop */}
                    {onToggleSidebar && (
                        <button
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
                            onClick={onToggleSidebar}
                            title="Buka menu navigasi"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default PeternakNavbar;
