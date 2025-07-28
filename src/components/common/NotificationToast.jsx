import { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Info as InfoIcon } from 'lucide-react';

const NotificationToast = ({
    notification,
    onClose,
    autoHideDuration = 5000,
    position = 'top-right'
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            setIsLeaving(false);

            if (autoHideDuration > 0) {
                const timer = setTimeout(() => {
                    setIsLeaving(true);
                    setTimeout(() => {
                        setIsVisible(false);
                        onClose();
                    }, 300);
                }, autoHideDuration);

                return () => clearTimeout(timer);
            }
        }
    }, [notification, autoHideDuration, onClose]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    if (!notification || !isVisible) return null;

    const getIcon = (type) => {
        const iconProps = {
            className: "h-4 w-4",
            strokeWidth: 2.5
        };

        switch (type) {
            case 'success':
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                        <Check {...iconProps} className="h-3.5 w-3.5 text-white" />
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                        <X {...iconProps} className="h-3.5 w-3.5 text-white" />
                    </div>
                );
            case 'warning':
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-amber-500 rounded-full">
                        <AlertTriangle {...iconProps} className="h-3.5 w-3.5 text-white" />
                    </div>
                );
            case 'info':
            default:
                return (
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                        <InfoIcon {...iconProps} className="h-3.5 w-3.5 text-white" />
                    </div>
                );
        }
    };

    const getColorClasses = (type) => {
        switch (type) {
            case 'success':
                return 'bg-white border-green-200 text-gray-800 shadow-lg ring-1 ring-green-100';
            case 'error':
                return 'bg-white border-red-200 text-gray-800 shadow-lg ring-1 ring-red-100';
            case 'warning':
                return 'bg-white border-amber-200 text-gray-800 shadow-lg ring-1 ring-amber-100';
            case 'info':
            default:
                return 'bg-white border-blue-200 text-gray-800 shadow-lg ring-1 ring-blue-100';
        }
    };

    const getPositionClasses = (position) => {
        switch (position) {
            case 'top-left':
                return 'top-4 left-4';
            case 'top-center':
                return 'top-4 left-1/2 transform -translate-x-1/2';
            case 'top-right':
            default:
                return 'top-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'bottom-center':
                return 'bottom-4 left-1/2 transform -translate-x-1/2';
            case 'bottom-right':
                return 'bottom-4 right-4';
        }
    };

    return (
        <div
            className={`fixed z-50 ${getPositionClasses(position)} transition-all duration-300 ease-in-out ${isLeaving
                ? 'opacity-0 transform translate-y-[-10px] scale-95'
                : 'opacity-100 transform translate-y-0 scale-100'
                }`}
            style={{ maxWidth: '400px', minWidth: '320px' }}
        >
            <div className={`
                flex items-center p-4 border rounded-xl backdrop-blur-sm
                ${getColorClasses(notification.type)}
                transform transition-all duration-200 hover:shadow-xl
            `}>
                <div className="flex-shrink-0 mr-3 flex items-center justify-center">
                    {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                    {notification.title && (
                        <h4 className="text-sm font-semibold mb-1 text-gray-900">
                            {notification.title}
                        </h4>
                    )}
                    <p className="text-sm leading-relaxed text-gray-700">
                        {notification.message}
                    </p>

                    {/* Tidak menampilkan details untuk layout yang lebih bersih */}
                </div>

                <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-3 p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center"
                    aria-label="Tutup notifikasi"
                >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
            </div>
        </div>
    );
};

// Hook untuk menggunakan notifikasi
export const useNotificationToast = () => {
    const [notification, setNotification] = useState(null);

    const showNotification = (type, message, title = null, details = null) => {
        setNotification({
            type,
            message,
            title,
            details,
            id: Date.now() // Unique identifier
        });
    };

    const clearNotification = () => {
        setNotification(null);
    };

    // Helper methods untuk berbagai jenis notifikasi
    const success = (message, title = 'Berhasil', details = null) => {
        showNotification('success', message, title, details);
    };

    const error = (message, title = 'Error', details = null) => {
        showNotification('error', message, title, details);
    };

    const warning = (message, title = 'Peringatan', details = null) => {
        showNotification('warning', message, title, details);
    };

    const info = (message, title = 'Informasi', details = null) => {
        showNotification('info', message, title, details);
    };

    return {
        notification,
        showNotification,
        clearNotification,
        success,
        error,
        warning,
        info
    };
};

export default NotificationToast;
