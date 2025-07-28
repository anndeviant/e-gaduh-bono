import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const CommonDeleteModal = ({
    item,
    onConfirm,
    onCancel,
    loading,
    type = 'item', // 'admin', 'peternak', atau 'item' generic
    title,
    confirmationField, // field yang harus diketik untuk konfirmasi (email, nik, nama, dll)
    confirmationValue, // nilai yang harus dicocokkan
    customMessage
}) => {
    const [confirmInput, setConfirmInput] = useState('');

    if (!item) return null;

    // Konfigurasi berdasarkan type
    const config = {
        admin: {
            title: 'Konfirmasi Hapus Admin',
            message: `Anda akan menghapus admin dengan nama <strong class="font-semibold">${item.name || item.fullName}</strong>. Tindakan ini tidak dapat diurungkan.`,
            confirmLabel: `Untuk melanjutkan, silakan ketik <strong class="font-semibold text-red-600">${item.email}</strong> di bawah ini.`,
            confirmValue: item.email,
            confirmField: 'email',
            buttonText: 'Hapus Admin',
            placeholder: 'Ketik email untuk konfirmasi'
        },
        peternak: {
            title: 'Konfirmasi Hapus Peternak',
            message: `Anda akan menghapus data peternak dengan nama <strong class="font-semibold">${item.namaLengkap}</strong>. Tindakan ini tidak dapat diurungkan.`,
            confirmLabel: `Untuk melanjutkan, silakan ketik <strong class="font-semibold text-red-600">${item.nik}</strong> di bawah ini.`,
            confirmValue: item.nik,
            confirmField: 'NIK',
            buttonText: 'Hapus Peternak',
            placeholder: 'Ketik NIK untuk konfirmasi'
        },
        item: {
            title: title || 'Konfirmasi Hapus',
            message: customMessage || `Anda akan menghapus item ini. Tindakan ini tidak dapat diurungkan.`,
            confirmLabel: confirmationField && confirmationValue ?
                `Untuk melanjutkan, silakan ketik <strong class="font-semibold text-red-600">${confirmationValue}</strong> di bawah ini.` :
                '',
            confirmValue: confirmationValue,
            confirmField: confirmationField,
            buttonText: 'Hapus',
            placeholder: `Ketik ${confirmationField || 'konfirmasi'} untuk melanjutkan`
        }
    };

    const currentConfig = config[type] || config.item;

    // Jika ada confirmationValue khusus yang diberikan, gunakan itu
    const finalConfirmValue = confirmationValue || currentConfig.confirmValue;
    const isConfirmMatch = finalConfirmValue ? confirmInput === finalConfirmValue : true;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay */}
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onCancel}></div>

                {/* Modal */}
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                            {currentConfig.title}
                        </h3>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="mt-4">
                        <div
                            className="text-sm text-gray-600"
                            dangerouslySetInnerHTML={{ __html: currentConfig.message }}
                        />

                        {finalConfirmValue && (
                            <>
                                <div
                                    className="text-sm text-gray-600 mt-2"
                                    dangerouslySetInnerHTML={{ __html: currentConfig.confirmLabel }}
                                />

                                <input
                                    type="text"
                                    value={confirmInput}
                                    onChange={(e) => setConfirmInput(e.target.value)}
                                    className="mt-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                    placeholder={currentConfig.placeholder}
                                />
                            </>
                        )}
                    </div>

                    <div className="flex space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={!isConfirmMatch || loading}
                            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Menghapus...' : currentConfig.buttonText}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommonDeleteModal;
