import { useState, useEffect } from 'react';
import { FileText, AlertCircle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { useLaporanNotification } from '../../hooks/useLaporanNotification';
import NotificationToast from '../common/NotificationToast';
import { getLaporanByPeternak } from '../../services/laporanService';

/**
 * LaporanForm Component
 * 
 * Komponen form untuk membuat atau mengedit laporan peternak.
 * 
 * Fitur Ut                            {(!laporan && prefillInfo) && (
                                <p className="mt-1 text-xs text-gray-500">
                                    {prefillInfo.fromPreviousReport 
                                        ? `Dari Laporan ke-${prefillInfo.previousReportNumber}`
                                        : 'Dari data registrasi peternak'
                                    }
                                </p>
                            )} - Sistem berkesinambungan: jumlah ternak awal laporan berikutnya diambil dari jumlah ternak saat ini laporan sebelumnya
 * - Validasi maksimal 8 laporan (2 tahun program gaduhan)
 * - Auto-calculate jumlah ternak saat ini berdasarkan formula: awal + lahir - mati - dijual
 * - Validasi duplikasi laporan ke-N
 * - Form responsif dengan notifikasi
 * 
 * Flow Data Berkesinambungan:
 * 1. Laporan ke-1: jumlah awal = data registrasi peternak
 * 2. Laporan ke-2: jumlah awal = jumlah saat ini dari Laporan ke-1
 * 3. Laporan ke-3: jumlah awal = jumlah saat ini dari Laporan ke-2
 * ... dst sampai maksimal Laporan ke-8
 */

const LaporanForm = ({ laporan, peternakId, peternakData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        jumlah_awal: '',
        jumlah_lahir: '',
        jumlah_mati: '',
        jumlah_dijual: '',
        jumlah_saat_ini: '',
        kendala: '',
        solusi: '',
        keterangan: '',
        tanggal_laporan: new Date().toISOString().split('T')[0] // Default hari ini
    });

    const [reportInfo, setReportInfo] = useState(null);
    const [prefillInfo, setPrefillInfo] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [canCreateReport, setCanCreateReport] = useState(false);

    // Notification hook
    const {
        notification,
        clearNotification,
        notifyCreateSuccess,
        notifyCreateError,
        notifyUpdateSuccess,
        notifyUpdateError,
        notifyValidationError,
        notifyActionConfirm
    } = useLaporanNotification();

    useEffect(() => {
        const loadReportInfo = async () => {
            try {
                if (!laporan) {
                    // Mode tambah laporan baru - dengan kontinuitas data
                    if (peternakData) {
                        // Ambil semua laporan peternak ini untuk menentukan laporan berikutnya
                        const existingLaporan = await getLaporanByPeternak(peternakId);
                        console.log('Existing laporan for peternak:', existingLaporan);

                        let nextReportNumber = 1;
                        let jumlahTernakAwal = peternakData.jumlahTernakAwal || 5; // Default dari data peternak
                        let latestLaporan = null;

                        if (existingLaporan && existingLaporan.length > 0) {
                            // Validasi maksimal 8 laporan
                            if (existingLaporan.length >= 8) {
                                setCanCreateReport(false);
                                setInitialLoading(false);
                                return;
                            }

                            // Sort laporan berdasarkan reportNumber untuk mendapatkan yang terbaru
                            const sortedLaporan = existingLaporan.sort((a, b) => {
                                return b.reportNumber - a.reportNumber; // Report number descending
                            });

                            latestLaporan = sortedLaporan[0];
                            console.log('Latest laporan:', latestLaporan);

                            // Tentukan nomor laporan berikutnya
                            nextReportNumber = latestLaporan.reportNumber + 1;

                            // Ambil jumlah ternak saat ini dari laporan terakhir sebagai jumlah awal untuk laporan berikutnya
                            jumlahTernakAwal = latestLaporan.jumlahTernakSaatIni || latestLaporan.jumlah_saat_ini || peternakData.jumlahTernakAwal || 5;
                        }

                        const reportInfo = {
                            reportNumber: nextReportNumber,
                            year: new Date().getFullYear(),
                            startDate: peternakData.tanggalDaftar || new Date().toISOString().split('T')[0],
                            endDate: new Date().toISOString().split('T')[0],
                            displayPeriod: `Laporan ke-${nextReportNumber} ${new Date().getFullYear()}`
                        };

                        setReportInfo({
                            reportNumber: nextReportNumber,
                            reportInfo: reportInfo,
                            canCreate: true
                        });
                        setCanCreateReport(true);

                        // Data awal dengan kontinuitas
                        const prefill = {
                            jumlah_awal: jumlahTernakAwal,
                            jumlah_saat_ini: jumlahTernakAwal,
                            fromPreviousReport: latestLaporan ? true : false,
                            previousReportNumber: latestLaporan ? latestLaporan.reportNumber : null,
                            previousYear: latestLaporan ? latestLaporan.year : null
                        };
                        setPrefillInfo(prefill);

                        setFormData(prev => ({
                            ...prev,
                            jumlah_awal: jumlahTernakAwal.toString(),
                            jumlah_saat_ini: jumlahTernakAwal.toString(),
                            tanggal_laporan: new Date().toISOString().split('T')[0]
                        }));
                    } else {
                        setCanCreateReport(false);
                        setInitialLoading(false);
                        return;
                    }

                } else {
                    // Mode edit laporan existing
                    setCanCreateReport(true);
                    setFormData({
                        jumlah_awal: laporan.jumlahTernakAwal?.toString() || laporan.jumlah_awal?.toString() || '',
                        jumlah_lahir: laporan.jumlahLahir?.toString() || laporan.jumlah_lahir?.toString() || '',
                        jumlah_mati: laporan.jumlahKematian?.toString() || laporan.jumlah_mati?.toString() || '',
                        jumlah_dijual: laporan.jumlahTerjual?.toString() || laporan.jumlah_dijual?.toString() || '',
                        jumlah_saat_ini: laporan.jumlahTernakSaatIni?.toString() || laporan.jumlah_saat_ini?.toString() || '',
                        kendala: laporan.kendala || '',
                        solusi: laporan.solusi || '',
                        keterangan: laporan.catatan || laporan.keterangan || '',
                        tanggal_laporan: laporan.tanggalLaporan || new Date().toISOString().split('T')[0]
                    });

                    // Set report info dari laporan yang sedang diedit
                    setReportInfo({
                        reportNumber: laporan.reportNumber || laporan.quarter,
                        reportInfo: laporan.reportInfo || {
                            reportNumber: laporan.reportNumber || laporan.quarter,
                            year: laporan.year,
                            displayPeriod: laporan.displayPeriod || `Laporan ke-${laporan.reportNumber || laporan.quarter} ${laporan.year}`
                        }
                    });
                }

            } catch (error) {
                console.error('Error loading report info:', error);
                setCanCreateReport(false);
            } finally {
                setInitialLoading(false);
            }
        };

        if (peternakId) {
            loadReportInfo();
        }
    }, [peternakId, laporan, peternakData]);    // Auto calculate jumlah_saat_ini when other values change
    useEffect(() => {
        if (!formData.jumlah_awal) return;

        const awal = parseInt(formData.jumlah_awal) || 0;
        const lahir = parseInt(formData.jumlah_lahir) || 0;
        const mati = parseInt(formData.jumlah_mati) || 0;
        const dijual = parseInt(formData.jumlah_dijual) || 0;

        const saatIni = awal + lahir - mati - dijual;
        setFormData(prev => ({
            ...prev,
            jumlah_saat_ini: Math.max(0, saatIni).toString()
        }));
    }, [formData.jumlah_awal, formData.jumlah_lahir, formData.jumlah_mati, formData.jumlah_dijual]);

    const validateForm = () => {
        const newErrors = {};

        // Validasi jumlah
        if (!formData.jumlah_awal.trim()) {
            newErrors.jumlah_awal = 'Jumlah awal harus diisi';
        } else if (isNaN(formData.jumlah_awal) || parseInt(formData.jumlah_awal) < 0) {
            newErrors.jumlah_awal = 'Jumlah awal harus berupa angka positif';
        }

        if (!formData.jumlah_lahir.trim()) {
            newErrors.jumlah_lahir = 'Jumlah lahir harus diisi (minimal 0)';
        } else if (isNaN(formData.jumlah_lahir) || parseInt(formData.jumlah_lahir) < 0) {
            newErrors.jumlah_lahir = 'Jumlah lahir harus berupa angka positif atau 0';
        }

        if (!formData.jumlah_mati.trim()) {
            newErrors.jumlah_mati = 'Jumlah mati harus diisi (minimal 0)';
        } else if (isNaN(formData.jumlah_mati) || parseInt(formData.jumlah_mati) < 0) {
            newErrors.jumlah_mati = 'Jumlah mati harus berupa angka positif atau 0';
        }

        if (!formData.jumlah_dijual.trim()) {
            newErrors.jumlah_dijual = 'Jumlah dijual harus diisi (minimal 0)';
        } else if (isNaN(formData.jumlah_dijual) || parseInt(formData.jumlah_dijual) < 0) {
            newErrors.jumlah_dijual = 'Jumlah dijual harus berupa angka positif atau 0';
        }

        // Validasi logika bisnis
        const awal = parseInt(formData.jumlah_awal) || 0;
        const lahir = parseInt(formData.jumlah_lahir) || 0;
        const mati = parseInt(formData.jumlah_mati) || 0;
        const dijual = parseInt(formData.jumlah_dijual) || 0;

        if ((mati + dijual) > (awal + lahir)) {
            newErrors.logika = 'Total kambing yang mati dan dijual tidak boleh melebihi jumlah awal + lahir';
        }

        // Validasi tanggal laporan
        if (!formData.tanggal_laporan.trim()) {
            newErrors.tanggal_laporan = 'Tanggal laporan harus diisi';
        } else {
            const selectedDate = new Date(formData.tanggal_laporan);
            const today = new Date();
            if (selectedDate > today) {
                newErrors.tanggal_laporan = 'Tanggal laporan tidak boleh di masa depan';
            }
        }

        setErrors(newErrors);

        // Show validation notification if there are errors
        if (Object.keys(newErrors).length > 0) {
            const firstError = Object.values(newErrors)[0];
            notifyValidationError(firstError);
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (errors.logika) setErrors(prev => ({ ...prev, logika: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Show processing notification
            const action = laporan ? 'Memperbarui' : 'Menyimpan';
            notifyActionConfirm(action, peternakData?.namaLengkap || 'peternak ini');

            // Hanya kirim field yang dibutuhkan Firestore
            const dataToSave = {
                idPeternak: peternakId,
                reportNumber: reportInfo?.reportNumber || reportInfo?.reportInfo?.reportNumber || 1,
                year: reportInfo?.reportInfo?.year || new Date().getFullYear(),
                startDate: reportInfo?.reportInfo?.startDate || new Date().toISOString().split('T')[0],
                endDate: reportInfo?.reportInfo?.endDate || new Date().toISOString().split('T')[0],
                displayPeriod: reportInfo?.reportInfo?.displayPeriod || `Laporan ke-${reportInfo?.reportNumber || 1} ${reportInfo?.reportInfo?.year || new Date().getFullYear()}`,
                jumlahTernakAwal: parseInt(formData.jumlah_awal) || 0,
                jumlahTernakSaatIni: parseInt(formData.jumlah_saat_ini) || 0,
                targetPengembalian: peternakData?.targetPengembalian || 0,
                jumlahKematian: parseInt(formData.jumlah_mati) || 0,
                jumlahLahir: parseInt(formData.jumlah_lahir) || 0,
                jumlahTerjual: parseInt(formData.jumlah_dijual) || 0,
                catatan: formData.keterangan || "",
                kendala: formData.kendala || "",
                solusi: formData.solusi || "",
                tanggalLaporan: formData.tanggal_laporan,
            };

            let result;
            if (laporan) {
                // Untuk edit, langsung return data yang akan diupdate tanpa memanggil updateLaporan
                // Biarkan parent component yang menangani actual update
                result = {
                    id: laporan.id,
                    ...dataToSave
                };
                notifyUpdateSuccess(
                    peternakData?.namaLengkap || 'Peternak',
                    dataToSave.reportNumber,
                    dataToSave.year
                );
            } else {
                // Untuk create, langsung return data yang akan dibuat tanpa memanggil createLaporan
                // Biarkan parent component yang menangani actual create
                result = dataToSave;
                notifyCreateSuccess(
                    peternakData?.namaLengkap || 'Peternak',
                    dataToSave.reportNumber,
                    dataToSave.year
                );
            }

            onSave(result);
        } catch (error) {
            console.error('Error saving laporan:', error);

            if (laporan) {
                notifyUpdateError(error.message);
            } else {
                notifyCreateError(error.message);
            }

            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
                    <span className="ml-3 text-gray-600">Memuat informasi laporan...</span>
                </div>
            </div>
        );
    }

    if (!canCreateReport && !laporan) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Dapat Membuat Laporan</h3>
                    <p className="text-gray-600 mb-4">
                        Program peternak ini sudah selesai (maksimal 8 laporan) atau terdapat masalah dalam data.
                        Program gaduhan berlangsung maksimal 2 tahun (8 laporan).
                    </p>
                    <button
                        onClick={onCancel}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            {/* Header Info */}
            {reportInfo && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-blue-900 mb-1">
                                {laporan ? 'Mengedit' : 'Membuat'} Laporan ke-{reportInfo.reportNumber}
                            </h4>
                            {reportInfo.reportInfo && (
                                <p className="text-sm text-blue-700">
                                    Periode: {reportInfo.reportInfo.displayPeriod}
                                </p>
                            )}
                            {prefillInfo && (
                                <div className="mt-2">
                                    {prefillInfo.fromPreviousReport ? (
                                        <p className="text-sm text-blue-700">
                                            <TrendingUp className="h-4 w-4 inline mr-1" />
                                            Jumlah awal otomatis diambil dari Laporan ke-{prefillInfo.previousReportNumber}: {prefillInfo.jumlah_awal} kambing
                                        </p>
                                    ) : (
                                        <p className="text-sm text-blue-700">
                                            <TrendingUp className="h-4 w-4 inline mr-1" />
                                            Laporan pertama - jumlah awal berdasarkan data registrasi peternak: {prefillInfo.jumlah_awal} kambing
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Alert */}
                {errors.submit && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-sm text-red-700">{errors.submit}</p>
                        </div>
                    </div>
                )}

                {/* Logic Error Alert */}
                {errors.logika && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-sm text-red-700">{errors.logika}</p>
                        </div>
                    </div>
                )}

                {/* Data Ternak */}
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Data Kambing Laporan Ini</h4>

                    {/* Tanggal Laporan */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Laporan Pertemuan *
                        </label>
                        <input
                            type="date"
                            name="tanggal_laporan"
                            value={formData.tanggal_laporan}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]} // Tidak boleh pilih tanggal masa depan
                            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.tanggal_laporan
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                }`}
                        />
                        <p className="mt-1 text-xs text-blue-600">
                            Tanggal saat pertemuan dilakukan untuk pencatatan laporan ini
                        </p>
                        {errors.tanggal_laporan && <p className="mt-1 text-sm text-red-600">{errors.tanggal_laporan}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Jumlah Awal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jumlah Awal Periode *
                            </label>
                            <input
                                type="number"
                                name="jumlah_awal"
                                value={formData.jumlah_awal}
                                onChange={handleChange}
                                min="0"
                                readOnly={!laporan && prefillInfo} // readonly jika auto-fill
                                className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${(!laporan && prefillInfo)
                                    ? 'bg-gray-50 border-gray-200 text-gray-600'
                                    : errors.jumlah_awal
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                    }`}
                                placeholder="0"
                            />
                            {(!laporan && prefillInfo) && (
                                <p className="mt-1 text-xs text-gray-500">
                                    {prefillInfo.fromPreviousReport
                                        ? `Dari Laporan ke-${prefillInfo.previousQuarter} ${prefillInfo.previousYear}`
                                        : 'Dari data registrasi peternak'
                                    }
                                </p>
                            )}
                            {errors.jumlah_awal && <p className="mt-1 text-sm text-red-600">{errors.jumlah_awal}</p>}
                        </div>

                        {/* Jumlah Lahir */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jumlah Lahir *
                            </label>
                            <input
                                type="number"
                                name="jumlah_lahir"
                                value={formData.jumlah_lahir}
                                onChange={handleChange}
                                min="0"
                                className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.jumlah_lahir ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                    }`}
                                placeholder="0"
                            />
                            {errors.jumlah_lahir && <p className="mt-1 text-sm text-red-600">{errors.jumlah_lahir}</p>}
                        </div>

                        {/* Jumlah Mati */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jumlah Mati *
                            </label>
                            <input
                                type="number"
                                name="jumlah_mati"
                                value={formData.jumlah_mati}
                                onChange={handleChange}
                                min="0"
                                className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.jumlah_mati ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                    }`}
                                placeholder="0"
                            />
                            {errors.jumlah_mati && <p className="mt-1 text-sm text-red-600">{errors.jumlah_mati}</p>}
                        </div>

                        {/* Jumlah Dijual */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jumlah Dijual *
                            </label>
                            <input
                                type="number"
                                name="jumlah_dijual"
                                value={formData.jumlah_dijual}
                                onChange={handleChange}
                                min="0"
                                className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.jumlah_dijual ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                    }`}
                                placeholder="0"
                            />
                            {errors.jumlah_dijual && <p className="mt-1 text-sm text-red-600">{errors.jumlah_dijual}</p>}
                        </div>

                        {/* Jumlah Saat Ini */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jumlah Saat Ini
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="jumlah_saat_ini"
                                    value={formData.jumlah_saat_ini}
                                    readOnly
                                    className="block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600"
                                />
                                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Otomatis: Awal + Lahir - Mati - Dijual
                            </p>
                        </div>
                    </div>
                </div>

                {/* Kendala dan Solusi */}
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Kendala dan Solusi</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kendala</label>
                            <div className="relative">
                                <AlertCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <textarea
                                    name="kendala"
                                    value={formData.kendala}
                                    onChange={handleChange}
                                    rows="3"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Jelaskan kendala yang dihadapi selama periode ini..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Solusi</label>
                            <div className="relative">
                                <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <textarea
                                    name="solusi"
                                    value={formData.solusi}
                                    onChange={handleChange}
                                    rows="3"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Jelaskan solusi atau tindakan yang diambil..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Tambahan</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <textarea
                                    name="keterangan"
                                    value={formData.keterangan}
                                    onChange={handleChange}
                                    rows="3"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Catatan atau keterangan tambahan..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col-reverse sm:flex-row sm:space-x-3 pt-4 space-y-2 space-y-reverse sm:space-y-0">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Menyimpan...
                            </div>
                        ) : (
                            laporan ? 'Update Laporan' : 'Simpan Laporan'
                        )}
                    </button>
                </div>
            </form>

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

export default LaporanForm;
