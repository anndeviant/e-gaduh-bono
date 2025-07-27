import { useState, useEffect } from 'react';
import { User, Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get user from localStorage
    const user = localStorage.getItem('adminUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-3 sm:px-6 py-4">
      <div className="flex items-center justify-between h-8 sm:h-12">
        {/* Left side - Mobile menu button and Time */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          {onToggleSidebar && (
            <button
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Time */}
          <div className="hidden sm:block">
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {formatTime(currentTime)}
            </p>
          </div>
        </div>

        {/* Right side - User info */}
        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
          {/* User info */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-24 sm:max-w-none">
                {currentUser?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {currentUser?.role || 'Administrator'}
              </p>
            </div>
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
