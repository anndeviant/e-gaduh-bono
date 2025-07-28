import React, { createContext, useContext, useState } from 'react';
import NotificationToast from '../components/common/NotificationToast';

const NotificationContext = createContext();

export const useGlobalNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useGlobalNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (type, message, title = null, details = null) => {
        setNotification({
            type,
            message,
            title,
            details,
            id: Date.now()
        });
    };

    const clearNotification = () => {
        setNotification(null);
    };

    // Helper methods
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

    const value = {
        notification,
        showNotification,
        clearNotification,
        success,
        error,
        warning,
        info
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationToast
                notification={notification}
                onClose={clearNotification}
                position="top-right"
                autoHideDuration={5000}
            />
        </NotificationContext.Provider>
    );
};
