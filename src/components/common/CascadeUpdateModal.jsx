import { CheckCircle, TrendingUp, ArrowDown } from 'lucide-react';

/**
 * CascadeUpdateModal Component
 * 
 * Modal untuk menampilkan informasi cascading update setelah edit/delete laporan.
 * Menunjukkan laporan mana saja yang terpengaruh dan bagaimana perubahannya.
 */

const CascadeUpdateModal = ({ isOpen, onClose, cascadeInfo, action = 'update' }) => {
    if (!isOpen || !cascadeInfo || cascadeInfo.updatedCount === 0) {
        return null;
    }

    const { updatedCount, reports, reportNumber } = cascadeInfo;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Update Berkesinambungan Berhasil
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {action === 'delete'
                                    ? `Penghapusan laporan mempengaruhi ${updatedCount} laporan berikutnya`
                                    : `Perubahan pada Laporan ke-${reportNumber} mempengaruhi ${updatedCount} laporan berikutnya`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div className="text-sm text-gray-700">
                                <p className="font-medium mb-2">Laporan yang Terpengaruh:</p>
                                <p className="text-gray-600 mb-4">
                                    Sistem secara otomatis memperbarui data "Jumlah Awal" dan "Jumlah Saat Ini"
                                    pada laporan-laporan berikutnya untuk menjaga konsistensi data.
                                </p>
                            </div>
                        </div>

                        {/* Detail Changes */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="space-y-3">
                                {reports.map((report, index) => (
                                    <div key={index} className="border-b border-gray-200 last:border-b-0 pb-3 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900">
                                                Laporan ke-{report.reportNumber}
                                            </span>
                                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                Diperbarui
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600 mb-1">Jumlah Awal:</p>
                                                <div className="flex items-center">
                                                    <span className="text-red-600 line-through mr-2">
                                                        {report.oldAwal}
                                                    </span>
                                                    <ArrowDown className="h-3 w-3 text-gray-400 mr-2" />
                                                    <span className="text-green-600 font-medium">
                                                        {report.newAwal}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-gray-600 mb-1">Jumlah Saat Ini:</p>
                                                <div className="flex items-center">
                                                    <span className="text-red-600 line-through mr-2">
                                                        {report.oldSaatIni}
                                                    </span>
                                                    <ArrowDown className="h-3 w-3 text-gray-400 mr-2" />
                                                    <span className="text-green-600 font-medium">
                                                        {report.newSaatIni}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium">Data telah disinkronkan</p>
                                    <p className="mt-1">
                                        Semua laporan sekarang memiliki data yang konsisten dan berkesinambungan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Mengerti
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CascadeUpdateModal;
