import { useState } from 'react';
import { Award, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { updateStatusKinerjaFinal } from '../../services/peternakService';

const StatusKinerjaManager = ({ peternakData, laporanData, onStatusUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    const totalLaporan = laporanData?.length || 0;
    const programSelesai = totalLaporan >= 8;
    const canUpdateToFinal = programSelesai && ['Progress'].includes(peternakData.statusKinerja);

    const statusOptions = [
        {
            value: 'Bagus',
            label: 'Bagus',
            color: 'green',
            description: 'Peternak menjalankan program dengan sangat baik, mencapai target, dan menunjukkan peningkatan yang signifikan.'
        },
        {
            value: 'Biasa',
            label: 'Biasa',
            color: 'yellow',
            description: 'Peternak menjalankan program dengan cukup baik, mencapai sebagian besar target dengan beberapa kendala kecil.'
        },
        {
            value: 'Kurang',
            label: 'Kurang',
            color: 'red',
            description: 'Peternak mengalami kendala signifikan dalam menjalankan program atau tidak mencapai target yang diharapkan.'
        }
    ];

    const handleUpdateStatus = async () => {
        if (!selectedStatus) return;

        setIsUpdating(true);
        try {
            await updateStatusKinerjaFinal(peternakData.id, selectedStatus);
            onStatusUpdate && onStatusUpdate(selectedStatus);
            setSelectedStatus('');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Gagal mengupdate status: ' + error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Baru': return <Clock className="h-4 w-4" />;
            case 'Progress': return <AlertTriangle className="h-4 w-4" />;
            case 'Bagus': return <CheckCircle className="h-4 w-4" />;
            case 'Biasa': return <Award className="h-4 w-4" />;
            case 'Kurang': return <AlertTriangle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'Baru': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' },
            'Progress': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
            'Bagus': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
            'Biasa': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
            'Kurang': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' }
        };
        return configs[status] || configs['Baru'];
    };

    const currentConfig = getStatusConfig(peternakData.statusKinerja);

    return (
        <div className={`${currentConfig.bg} ${currentConfig.border} border rounded-lg p-4`}>
            {/* Header Status Saat Ini */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className={`${currentConfig.text} mr-2`}>
                        {getStatusIcon(peternakData.statusKinerja)}
                    </div>
                    <div>
                        <h3 className={`text-sm font-medium ${currentConfig.text}`}>
                            Status Kinerja: {peternakData.statusKinerja}
                        </h3>
                        <p className="text-xs text-gray-600">
                            Progress: {totalLaporan}/8 triwulan ({Math.round((totalLaporan / 8) * 100)}%)
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${peternakData.statusKinerja === 'Baru' ? 'bg-gray-100 text-gray-800' :
                        peternakData.statusKinerja === 'Progress' ? 'bg-blue-100 text-blue-800' :
                            peternakData.statusKinerja === 'Bagus' ? 'bg-green-100 text-green-800' :
                                peternakData.statusKinerja === 'Biasa' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                    }`}>
                    {peternakData.statusKinerja}
                </span>
            </div>

            {/* Informasi Status */}
            <div className="mb-4">
                {peternakData.statusKinerja === 'Baru' && (
                    <p className="text-sm text-gray-600">
                        Peternak baru terdaftar. Status akan otomatis berubah menjadi "Progress" setelah laporan triwulan pertama dibuat.
                    </p>
                )}

                {peternakData.statusKinerja === 'Progress' && (
                    <p className="text-sm text-gray-600">
                        Peternak sedang menjalankan program. Status akan dapat dinilai setelah program 2 tahun selesai.
                    </p>
                )}

                {['Bagus', 'Biasa', 'Kurang'].includes(peternakData.statusKinerja) && (
                    <p className="text-sm text-gray-600">
                        Status final setelah program 2 tahun selesai. Program telah selesai pada{' '}
                        {peternakData.tanggalSelesai && new Date(peternakData.tanggalSelesai).toLocaleDateString('id-ID')}.
                    </p>
                )}
            </div>

            {/* Form Update Status Final */}
            {canUpdateToFinal && (
                <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Update Status Kinerja Final
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                        Program 2 tahun telah selesai. Berikan penilaian kinerja akhir berdasarkan performa selama program.
                    </p>

                    <div className="space-y-3">
                        {statusOptions.map((option) => (
                            <label key={option.value} className="flex items-start cursor-pointer">
                                <input
                                    type="radio"
                                    name="statusFinal"
                                    value={option.value}
                                    checked={selectedStatus === option.value}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="mt-1 mr-3"
                                />
                                <div className="flex-1">
                                    <div className={`text-sm font-medium ${option.color === 'green' ? 'text-green-800' :
                                            option.color === 'yellow' ? 'text-yellow-800' :
                                                'text-red-800'
                                        }`}>
                                        {option.label}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {option.description}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="mt-4 flex space-x-3">
                        <button
                            onClick={handleUpdateStatus}
                            disabled={!selectedStatus || isUpdating}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? 'Menyimpan...' : 'Update Status'}
                        </button>
                        <button
                            onClick={() => setSelectedStatus('')}
                            disabled={isUpdating}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-400 disabled:opacity-50"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}

            {/* Info untuk Program Belum Selesai */}
            {!programSelesai && (
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                            Status kinerja final dapat dinilai setelah {8 - totalLaporan} triwulan lagi selesai.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatusKinerjaManager;
