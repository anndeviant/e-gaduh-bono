import React from 'react';
import { useLaporanNotification } from '../hooks/useLaporanNotification';
import NotificationToast from '../components/common/NotificationToast';

const NotificationTestPage = () => {
    const {
        notification,
        clearNotification,
        notifyCreateSuccess,
        notifyCreateError,
        notifyUpdateSuccess,
        notifyUpdateError,
        notifyDeleteSuccess,
        notifyDeleteError,
        notifyValidationError,
        notifyActionConfirm,
        notifyLoadSuccess,
        notifyLoadError,
        success,
        error,
        warning,
        info
    } = useLaporanNotification();

    const testNotifications = [
        {
            title: 'Create Success',
            action: () => notifyCreateSuccess('Budi Santoso', 2, 2025),
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            title: 'Create Error',
            action: () => notifyCreateError('Network connection failed'),
            color: 'bg-red-500 hover:bg-red-600'
        },
        {
            title: 'Update Success',
            action: () => notifyUpdateSuccess('Siti Aminah', 3, 2025),
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            title: 'Update Error',
            action: () => notifyUpdateError('Validation failed: Required fields missing'),
            color: 'bg-red-500 hover:bg-red-600'
        },
        {
            title: 'Delete Success',
            action: () => notifyDeleteSuccess('Ahmad Rahman', 1, 2025),
            color: 'bg-yellow-500 hover:bg-yellow-600'
        },
        {
            title: 'Delete Error',
            action: () => notifyDeleteError('Cannot delete: Laporan is referenced by other records'),
            color: 'bg-red-500 hover:bg-red-600'
        },
        {
            title: 'Validation Error',
            action: () => notifyValidationError('Jumlah awal harus diisi dan berupa angka positif'),
            color: 'bg-yellow-500 hover:bg-yellow-600'
        },
        {
            title: 'Action Confirm',
            action: () => notifyActionConfirm('Menyimpan laporan', 'Budi Santoso'),
            color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
            title: 'Load Success',
            action: () => notifyLoadSuccess(15),
            color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
            title: 'Load Error',
            action: () => notifyLoadError('Failed to fetch data from server'),
            color: 'bg-red-500 hover:bg-red-600'
        },
        {
            title: 'Generic Success',
            action: () => success('This is a generic success message', 'Success!', 'Additional details here'),
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            title: 'Generic Error',
            action: () => error('This is a generic error message', 'Error!', 'Error details for debugging'),
            color: 'bg-red-500 hover:bg-red-600'
        },
        {
            title: 'Generic Warning',
            action: () => warning('This is a generic warning message', 'Warning!', 'Warning details'),
            color: 'bg-yellow-500 hover:bg-yellow-600'
        },
        {
            title: 'Generic Info',
            action: () => info('This is a generic info message', 'Info', 'Information details'),
            color: 'bg-blue-500 hover:bg-blue-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Notification System Test Page
                    </h1>

                    <p className="text-gray-600 mb-8">
                        Click the buttons below to test different types of notifications for the CRUD Laporan system.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {testNotifications.map((test, index) => (
                            <button
                                key={index}
                                onClick={test.action}
                                className={`${test.color} text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 text-sm`}
                            >
                                {test.title}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions:</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• <strong>Green buttons:</strong> Success notifications</li>
                            <li>• <strong>Red buttons:</strong> Error notifications</li>
                            <li>• <strong>Yellow buttons:</strong> Warning notifications</li>
                            <li>• <strong>Blue buttons:</strong> Info notifications</li>
                            <li>• Notifications will auto-hide after 5 seconds</li>
                            <li>• You can manually close them using the X button</li>
                            <li>• Check the console for any error logs</li>
                        </ul>
                    </div>

                    {notification && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-900">Current Notification Data:</h4>
                            <pre className="text-xs text-blue-800 mt-2 overflow-x-auto">
                                {JSON.stringify(notification, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Toast */}
            <NotificationToast
                notification={notification}
                onClose={clearNotification}
                position="top-right"
                autoHideDuration={5000}
            />
        </div>
    );
};

export default NotificationTestPage;
