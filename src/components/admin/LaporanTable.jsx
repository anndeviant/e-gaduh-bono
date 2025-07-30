import { Calendar, Edit, Trash2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { getFieldValue } from '../../utils/dataUtils';

const LaporanTable = ({ laporan, onEdit, onDelete, isReadOnly = false, className = "" }) => {
    const getBadgeColor = (type, value) => {
        const colors = {
            'lahir': 'bg-green-100 text-green-800',
            'mati': 'bg-red-100 text-red-800',
            'terjual': 'bg-blue-100 text-blue-800',
            'total': 'text-gray-900 font-medium'
        };
        return colors[type] || colors['total'];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            formatted: date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            daysAgo: Math.floor((new Date() - date) / (1000 * 60 * 60 * 24))
        };
    };

    // Sort laporan berdasarkan reportNumber ascending untuk menunjukkan urutan berkesinambungan
    const sortedLaporan = [...laporan].sort((a, b) => {
        return a.reportNumber - b.reportNumber;
    });

    if (!laporan || laporan.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada laporan</h3>
                    <p className="text-gray-500">Laporan akan ditampilkan di sini</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                style={{ minWidth: '140px' }}>
                                Periode
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                style={{ minWidth: '80px' }}>
                                Jumlah Awal
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                style={{ minWidth: '80px' }}>
                                Lahir
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                style={{ minWidth: '80px' }}>
                                Mati
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                style={{ minWidth: '80px' }}>
                                Terjual
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                style={{ minWidth: '100px' }}>
                                Total Akhir
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                style={{ minWidth: '140px' }}>
                                Tanggal Lapor
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                style={{ minWidth: '100px' }}>
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedLaporan.map((item) => {
                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Periode */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    Laporan ke-{item.reportNumber}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(item.tanggalLaporan).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Jumlah Awal */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-left">
                                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-900">
                                            {getFieldValue(item, 'jumlahTernakAwal', 0)}
                                        </div>
                                    </td>

                                    {/* Lahir */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-left">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor('lahir')}`}>
                                            +{getFieldValue(item, 'jumlahLahir', 0)}
                                        </span>
                                    </td>

                                    {/* Mati */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-left">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor('mati')}`}>
                                            -{item.jumlahKematian || item.jumlah_mati || 0}
                                        </span>
                                    </td>

                                    {/* Terjual */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-left">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor('terjual')}`}>
                                            -{item.jumlahTerjual || item.jumlah_dijual || 0}
                                        </span>
                                    </td>

                                    {/* Total Akhir */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-left">
                                        <span className={`text-sm ${getBadgeColor('total')}`}>
                                            {item.jumlahTernakSaatIni || item.jumlah_saat_ini || 0} ekor
                                        </span>
                                    </td>

                                    {/* Tanggal Lapor */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(item.tanggalLaporan).formatted}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(item.tanggalLaporan).daysAgo} hari lalu
                                        </div>
                                    </td>

                                    {/* Aksi */}
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {isReadOnly ? (
                                                <>
                                                    <button
                                                        disabled
                                                        className="text-gray-400 cursor-not-allowed p-1"
                                                        title="Edit tidak tersedia - Status selesai"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        disabled
                                                        className="text-gray-400 cursor-not-allowed p-1"
                                                        title="Hapus tidak tersedia - Status selesai"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="text-red-600 hover:text-red-900 transition-colors p-1"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Detail Informasi untuk setiap laporan (Kendala, Solusi, Keterangan) */}
                        {sortedLaporan.map((item) =>
                            (item.kendala || item.solusi || item.keterangan || item.catatan) && (
                                <tr key={`${item.id}-details`} className="bg-gray-50 border-t-0">
                                    <td colSpan="8" className="px-4 sm:px-6 py-4">
                                        <div className="space-y-3">
                                            <div className="text-xs font-medium text-gray-700 border-b border-gray-200 pb-2">
                                                Detail Laporan ke-{item.reportNumber}
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                                                {/* Kendala */}
                                                {item.kendala && (
                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                        <div className="flex items-start">
                                                            <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                                            <div className="flex-1">
                                                                <div className="font-medium text-yellow-800 mb-1">Kendala</div>
                                                                <div className="text-yellow-700 text-justify leading-relaxed">
                                                                    {item.kendala}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Solusi */}
                                                {item.solusi && (
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                        <div className="flex items-start">
                                                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                            <div className="flex-1">
                                                                <div className="font-medium text-green-800 mb-1">Solusi</div>
                                                                <div className="text-green-700 text-justify leading-relaxed">
                                                                    {item.solusi}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Keterangan */}
                                                {(item.keterangan || item.catatan) && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                        <div className="flex items-start">
                                                            <Info className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                            <div className="flex-1">
                                                                <div className="font-medium text-blue-800 mb-1">Keterangan</div>
                                                                <div className="text-blue-700 text-justify leading-relaxed">
                                                                    {item.keterangan || item.catatan}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LaporanTable;
