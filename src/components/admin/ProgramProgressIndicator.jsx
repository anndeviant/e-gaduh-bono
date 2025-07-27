import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const ProgramProgressIndicator = ({ peternakData, laporanData }) => {
    const calculateProgress = () => {
        if (!peternakData?.tanggalDaftar) {
            return {
                currentQuarter: 0,
                totalQuarters: 8,
                percentage: 0,
                status: 'not-started',
                nextQuarter: 1,
                isComplete: false
            };
        }

        const totalQuarters = 8; // 2 tahun
        const completedQuarters = laporanData?.length || 0;
        const percentage = (completedQuarters / totalQuarters) * 100;

        let status = 'active';
        if (completedQuarters === 0) status = 'not-started';
        else if (completedQuarters >= totalQuarters) status = 'completed';
        else if (completedQuarters > 0) status = 'active';

        return {
            currentQuarter: completedQuarters,
            totalQuarters,
            percentage,
            status,
            nextQuarter: completedQuarters + 1,
            isComplete: completedQuarters >= totalQuarters
        };
    };

    const getQuarterPeriods = () => {
        if (!peternakData?.tanggalDaftar) return [];

        const startDate = new Date(peternakData.tanggalDaftar);
        const periods = [];

        for (let quarter = 1; quarter <= 8; quarter++) {
            const quarterStartDate = new Date(startDate);
            quarterStartDate.setMonth(startDate.getMonth() + ((quarter - 1) * 3));

            const quarterEndDate = new Date(quarterStartDate);
            quarterEndDate.setMonth(quarterStartDate.getMonth() + 3);
            quarterEndDate.setDate(quarterEndDate.getDate() - 1);

            const hasReport = laporanData?.some(l => l.quarterNumber === quarter);
            const today = new Date();
            const isActive = today >= quarterStartDate && today <= quarterEndDate;
            const isPast = today > quarterEndDate;

            periods.push({
                quarter,
                year: quarterStartDate.getFullYear(),
                startDate: quarterStartDate,
                endDate: quarterEndDate,
                hasReport,
                isActive,
                isPast,
                displayPeriod: `${quarterStartDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short'
                })} - ${quarterEndDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })}`
            });
        }

        return periods;
    };

    const progress = calculateProgress();
    const periods = getQuarterPeriods();

    const getStatusConfig = () => {
        switch (progress.status) {
            case 'completed':
                return {
                    color: 'green',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-800',
                    icon: CheckCircle,
                    title: 'Program Selesai',
                    message: 'Semua laporan triwulan telah dilengkapi'
                };
            case 'active':
                return {
                    color: 'blue',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-800',
                    icon: Clock,
                    title: 'Program Berjalan',
                    message: `Saat ini di Triwulan ${progress.nextQuarter}`
                };
            case 'not-started':
            default:
                return {
                    color: 'gray',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-800',
                    icon: AlertTriangle,
                    title: 'Belum Dimulai',
                    message: 'Belum ada laporan yang dibuat'
                };
        }
    };

    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    return (
        <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-4 sm:p-6`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <StatusIcon className={`h-5 w-5 ${statusConfig.textColor} mr-2`} />
                    <h3 className={`text-lg font-medium ${statusConfig.textColor}`}>
                        {statusConfig.title}
                    </h3>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                        {progress.currentQuarter}/{progress.totalQuarters} Triwulan
                    </div>
                    <div className="text-xs text-gray-500">
                        {Math.round(progress.percentage)}% Selesai
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress Program</span>
                    <span>{Math.round(progress.percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-300 ${progress.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                        style={{ width: `${progress.percentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Status Message */}
            <p className={`text-sm ${statusConfig.textColor} mb-4`}>
                {statusConfig.message}
            </p>

            {/* Quarter Timeline */}
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Timeline Triwulan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {periods.map((period) => {
                        let bgColor = 'bg-gray-100';
                        let textColor = 'text-gray-600';
                        let borderColor = 'border-gray-200';

                        if (period.hasReport) {
                            bgColor = 'bg-green-100';
                            textColor = 'text-green-800';
                            borderColor = 'border-green-300';
                        } else if (period.isActive) {
                            bgColor = 'bg-blue-100';
                            textColor = 'text-blue-800';
                            borderColor = 'border-blue-300';
                        } else if (period.isPast) {
                            bgColor = 'bg-red-100';
                            textColor = 'text-red-800';
                            borderColor = 'border-red-300';
                        }

                        return (
                            <div
                                key={period.quarter}
                                className={`${bgColor} ${borderColor} border rounded-lg p-2 text-center`}
                            >
                                <div className={`text-xs font-medium ${textColor}`}>
                                    T{period.quarter} {period.year}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    {period.displayPeriod}
                                </div>
                                <div className="mt-1">
                                    {period.hasReport ? (
                                        <CheckCircle className="h-3 w-3 text-green-600 mx-auto" />
                                    ) : period.isActive ? (
                                        <Clock className="h-3 w-3 text-blue-600 mx-auto" />
                                    ) : period.isPast ? (
                                        <AlertTriangle className="h-3 w-3 text-red-600 mx-auto" />
                                    ) : (
                                        <div className="h-3 w-3 bg-gray-300 rounded-full mx-auto"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                        <span>Selesai</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-3 w-3 text-blue-600 mr-1" />
                        <span>Aktif</span>
                    </div>
                    <div className="flex items-center">
                        <AlertTriangle className="h-3 w-3 text-red-600 mr-1" />
                        <span>Terlewat</span>
                    </div>
                    <div className="flex items-center">
                        <div className="h-3 w-3 bg-gray-300 rounded-full mr-1"></div>
                        <span>Belum Aktif</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramProgressIndicator;
