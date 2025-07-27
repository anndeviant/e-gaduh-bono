import { useState, useEffect } from 'react';
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
    }, [isVisible, autoClose, duration]);

    const handleClose = () => {
        setIsShowing(false);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for animation to complete
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-500" />;
            default:
                return <CheckCircle className="h-5 w-5 text-green-500" />;
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
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div className={`
                ${getBackgroundColor()}
                border rounded-lg shadow-lg p-4 
                transform transition-all duration-300 ease-in-out
                ${isShowing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        {title && (
                            <p className="text-sm font-medium text-gray-900">
                                {title}
                            </p>
                        )}
                        {message && (
                            <p className={`text-sm text-gray-700 ${title ? 'mt-1' : ''}`}>
                                {message}
                            </p>
                        )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            onClick={handleClose}
                            className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
