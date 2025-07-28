import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

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
        const iconProps = { className: "h-5 w-5", strokeWidth: 2 };

        switch (type) {
            case 'success':
                return <CheckCircle {...iconProps} className="h-5 w-5 text-green-600" />;
            case 'error':
                return <XCircle {...iconProps} className="h-5 w-5 text-red-600" />;
            case 'warning':
                return <AlertCircle {...iconProps} className="h-5 w-5 text-yellow-600" />;
            case 'info':
            default:
                return <Info {...iconProps} className="h-5 w-5 text-blue-600" />;
        }
    };

    const getColorClasses = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
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
                    ? 'opacity-0 transform translate-y-[-10px]'
                    : 'opacity-100 transform translate-y-0'
                }`}
            style={{ maxWidth: '400px', minWidth: '300px' }}
        >
            <div className={`
                flex items-start p-4 border rounded-lg shadow-lg backdrop-blur-sm
                ${getColorClasses(notification.type)}
            `}>
                <div className="flex-shrink-0 mr-3">
                    {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                    {notification.title && (
                        <h4 className="text-sm font-semibold mb-1">
                            {notification.title}
                        </h4>
                    )}
                    <p className="text-sm leading-relaxed">
                        {notification.message}
                    </p>

                    {notification.details && (
                        <p className="text-xs mt-2 opacity-75">
                            {notification.details}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-3 p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
                    aria-label="Tutup notifikasi"
                >
                    <X className="h-4 w-4" />
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
