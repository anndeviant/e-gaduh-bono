import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ admin, onConfirm, onCancel, loading }) => {
    const [confirmEmail, setConfirmEmail] = useState('');

    if (!admin) return null;

    const isEmailMatch = confirmEmail === admin.email;

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
                            Konfirmasi Hapus Admin
                        </h3>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm text-gray-600">
                            Anda akan menghapus admin dengan nama <strong className="font-semibold">{admin.name}</strong>. Tindakan ini tidak dapat diurungkan.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Untuk melanjutkan, silakan ketik <strong className="font-semibold text-red-600">{admin.email}</strong> di bawah ini.
                        </p>

                        <input
                            type="email"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            className="mt-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            placeholder="Ketik email untuk konfirmasi"
                        />
                    </div>

                    <div className="flex space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={!isEmailMatch || loading}
                            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Menghapus...' : 'Hapus Admin'}
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

export default DeleteConfirmModal;
