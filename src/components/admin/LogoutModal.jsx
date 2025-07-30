import { LogOut } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm, userName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            {/* Backdrop */}
            <div className="flex items-center justify-center min-h-screen px-4 py-6">
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal - More compact design */}
                <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-auto transform transition-all">
                    {/* Simple Header */}
                    <div className="p-4 sm:p-5 text-center">
                        <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mb-3">
                            <LogOut className="h-5 w-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Keluar dari Sistem?
                        </h3>
                    </div>

                    {/* Simple Actions */}
                    <div className="flex border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-r border-gray-200"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
