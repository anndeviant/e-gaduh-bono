import { useState, useEffect } from 'react';
import { Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import SearchableDropdown from '../common/SearchableDropdown';

const LaporanForm = ({ laporan, peternakId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        peternakId: peternakId || '',
        tanggalLaporan: '',
        triwulan: '',
        tahun: new Date().getFullYear(),
        jumlahTernakAwal: '',
        jumlahLahir: '',
        jumlahMati: '',
        jumlahTerjual: '',
        jumlahAkhirPeriode: '',
        kendala: '',
        solusi: '',
        keterangan: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (laporan) {
            setFormData({
                peternakId: laporan.peternakId || peternakId || '',
                tanggalLaporan: laporan.tanggalLaporan || '',
                triwulan: laporan.triwulan?.toString() || '',
                tahun: laporan.tahun || new Date().getFullYear(),
                jumlahTernakAwal: laporan.jumlahTernakAwal?.toString() || '',
                jumlahLahir: laporan.jumlahLahir?.toString() || '',
                jumlahMati: laporan.jumlahMati?.toString() || '',
                jumlahTerjual: laporan.jumlahTerjual?.toString() || '',
                jumlahAkhirPeriode: laporan.jumlahAkhirPeriode?.toString() || '',
                kendala: laporan.kendala || '',
                solusi: laporan.solusi || '',
                keterangan: laporan.keterangan || ''
            });
        } else {
            // Reset form for new laporan
            setFormData({
                peternakId: peternakId || '',
                tanggalLaporan: '',
                triwulan: '',
                tahun: new Date().getFullYear(),
                jumlahTernakAwal: '',
                jumlahLahir: '',
                jumlahMati: '',
                jumlahTerjual: '',
                jumlahAkhirPeriode: '',
                kendala: '',
                solusi: '',
                keterangan: ''
            });
        }
    }, [laporan, peternakId]);

    // Auto calculate jumlahAkhirPeriode when other values change
    useEffect(() => {
        const awal = parseInt(formData.jumlahTernakAwal) || 0;
        const lahir = parseInt(formData.jumlahLahir) || 0;
        const mati = parseInt(formData.jumlahMati) || 0;
        const terjual = parseInt(formData.jumlahTerjual) || 0;

        const akhir = awal + lahir - mati - terjual;
        setFormData(prev => ({ ...prev, jumlahAkhirPeriode: akhir.toString() }));
    }, [formData.jumlahTernakAwal, formData.jumlahLahir, formData.jumlahMati, formData.jumlahTerjual]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.tanggalLaporan.trim()) newErrors.tanggalLaporan = 'Tanggal laporan harus diisi';
        if (!formData.triwulan) newErrors.triwulan = 'Triwulan harus dipilih';
        // Tahun tidak perlu validasi karena auto-derived dari tanggal
        if (!formData.jumlahTernakAwal.trim()) {
            newErrors.jumlahTernakAwal = 'Jumlah ternak awal harus diisi';
        } else if (isNaN(formData.jumlahTernakAwal) || parseInt(formData.jumlahTernakAwal) < 0) {
            newErrors.jumlahTernakAwal = 'Jumlah ternak awal harus berupa angka positif';
        }
        if (!formData.jumlahLahir.trim()) {
            newErrors.jumlahLahir = 'Jumlah lahir harus diisi';
        } else if (isNaN(formData.jumlahLahir) || parseInt(formData.jumlahLahir) < 0) {
            newErrors.jumlahLahir = 'Jumlah lahir harus berupa angka positif';
        }
        if (!formData.jumlahMati.trim()) {
            newErrors.jumlahMati = 'Jumlah mati harus diisi';
        } else if (isNaN(formData.jumlahMati) || parseInt(formData.jumlahMati) < 0) {
            newErrors.jumlahMati = 'Jumlah mati harus berupa angka positif';
        }
        if (!formData.jumlahTerjual.trim()) {
            newErrors.jumlahTerjual = 'Jumlah terjual harus diisi';
        } else if (isNaN(formData.jumlahTerjual) || parseInt(formData.jumlahTerjual) < 0) {
            newErrors.jumlahTerjual = 'Jumlah terjual harus berupa angka positif';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { [name]: value };

        // Auto-derive tahun dari tanggal laporan
        if (name === 'tanggalLaporan' && value) {
            const selectedDate = new Date(value);
            updatedData.tahun = selectedDate.getFullYear();
        }

        setFormData(prev => ({ ...prev, ...updatedData }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const dataToSave = {
                ...formData,
                triwulan: parseInt(formData.triwulan),
                tahun: parseInt(formData.tahun),
                jumlahTernakAwal: parseInt(formData.jumlahTernakAwal),
                jumlahLahir: parseInt(formData.jumlahLahir),
                jumlahMati: parseInt(formData.jumlahMati),
                jumlahTerjual: parseInt(formData.jumlahTerjual),
                jumlahAkhirPeriode: parseInt(formData.jumlahAkhirPeriode)
            };

            onSave(dataToSave);
        } catch (error) {
            console.error('Error saving laporan:', error);
        } finally {
            setLoading(false);
        }
    };

    const triwulanOptions = [
        { value: '1', label: 'Triwulan I', subtitle: 'Januari - Maret' },
        { value: '2', label: 'Triwulan II', subtitle: 'April - Juni' },
        { value: '3', label: 'Triwulan III', subtitle: 'Juli - September' },
        { value: '4', label: 'Triwulan IV', subtitle: 'Oktober - Desember' }
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Periode Laporan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Laporan *</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                name="tanggalLaporan"
                                value={formData.tanggalLaporan}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.tanggalLaporan ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                    }`}
                            />
                        </div>
                        {errors.tanggalLaporan && <p className="mt-1 text-sm text-red-600">{errors.tanggalLaporan}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Triwulan *</label>
                        <SearchableDropdown
                            options={triwulanOptions}
                            value={formData.triwulan}
                            onChange={(value) => handleDropdownChange('triwulan', value)}
                            placeholder="Pilih triwulan..."
                            searchPlaceholder="Cari triwulan..."
                            displayKey="label"
                            valueKey="value"
                            searchKeys={['label', 'subtitle']}
                            noResultsText="Triwulan tidak ditemukan"
                        />
                        {errors.triwulan && <p className="mt-1 text-sm text-red-600">{errors.triwulan}</p>}
                    </div>
                </div>

                {/* Data Ternak */}
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Data Ternak</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Ternak Awal *</label>
                            <input
                                type="number"
                                name="jumlahTernakAwal"
                                value={formData.jumlahTernakAwal}
                                onChange={handleChange}
                                min="0"
                                className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.jumlahTernakAwal ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                    }`}
                                placeholder="0"
                            />
                            {errors.jumlahTernakAwal && <p className="mt-1 text-sm text-red-600">{errors.jumlahTernakAwal}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Lahir *</label>
                            <input
                                type="number"
                                name="jumlahLahir"
                                value={formData.jumlahLahir}
                                onChange={handleChange}
                                min="0"
                                className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.jumlahLahir ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                    }`}
                                placeholder="0"
                            />
                            {errors.jumlahLahir && <p className="mt-1 text-sm text-red-600">{errors.jumlahLahir}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Mati *</label>
                            <input
                                type="number"
                                name="jumlahMati"
                                value={formData.jumlahMati}
                                onChange={handleChange}
                                min="0"
                                className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.jumlahMati ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                    }`}
                                placeholder="0"
                            />
                            {errors.jumlahMati && <p className="mt-1 text-sm text-red-600">{errors.jumlahMati}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Terjual *</label>
                            <input
                                type="number"
                                name="jumlahTerjual"
                                value={formData.jumlahTerjual}
                                onChange={handleChange}
                                min="0"
                                className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.jumlahTerjual ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                    }`}
                                placeholder="0"
                            />
                            {errors.jumlahTerjual && <p className="mt-1 text-sm text-red-600">{errors.jumlahTerjual}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Akhir Periode</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="jumlahAkhirPeriode"
                                    value={formData.jumlahAkhirPeriode}
                                    readOnly
                                    className="block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600"
                                />
                                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Otomatis dihitung: Awal + Lahir - Mati - Terjual</p>
                        </div>
                    </div>
                </div>

                {/* Kendala dan Solusi */}
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Kendala dan Solusi</h4>
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kendala</label>
                            <div className="relative">
                                <AlertCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <textarea
                                    name="kendala"
                                    value={formData.kendala}
                                    onChange={handleChange}
                                    rows="3"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
                        className="flex-1 justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
        </div>
    );
};

export default LaporanForm;
