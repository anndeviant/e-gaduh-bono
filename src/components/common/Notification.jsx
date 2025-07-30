import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({
    type = 'success',
    title,
    message,
    isVisible,
    onClose,
    autoClose = true,
    duration = 5000
}) => {
    const [isShowing, setIsShowing] = useState(false);

    const handleClose = useCallback(() => {
        setIsShowing(false);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for animation to complete
    }, [onClose]);

    useEffect(() => {
        if (isVisible) {
            setIsShowing(true);

            if (autoClose) {
                const timer = setTimeout(() => {
                    handleClose();
                }, duration);

                return () => clearTimeout(timer);
            }
        }
    }, [isVisible, autoClose, duration, handleClose]);

    const getIcon = () => {
        const iconClass = "h-4 w-4 sm:h-5 sm:w-5";
        switch (type) {
            case 'success':
                return <CheckCircle className={`${iconClass} text-green-500`} />;
            case 'error':
                return <XCircle className={`${iconClass} text-red-500`} />;
            case 'warning':
                return <AlertCircle className={`${iconClass} text-yellow-500`} />;
            case 'info':
                return <Info className={`${iconClass} text-blue-500`} />;
            default:
                return <CheckCircle className={`${iconClass} text-green-500`} />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-green-50 border-green-200';
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-xs sm:max-w-sm w-full px-2 sm:px-0">
            <div className={`
                ${getBackgroundColor()}
                border rounded-lg shadow-lg p-3 sm:p-4 
                transform transition-all duration-300 ease-in-out
                ${isShowing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-2 sm:ml-3 w-0 flex-1 min-w-0">
                        {title && (
                            <p className="text-xs sm:text-sm font-medium text-gray-900 leading-tight">
                                {title}
                            </p>
                        )}
                        {message && (
                            <p className={`text-xs sm:text-sm text-gray-700 leading-tight ${title ? 'mt-1' : ''}`}>
                                {message}
                            </p>
                        )}
                    </div>
                    <div className="ml-2 sm:ml-4 flex-shrink-0 flex">
                        <button
                            onClick={handleClose}
                            className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 p-1"
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
