import { useState, useEffect } from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

const PeternakForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        namaLengkap: '',
        nik: '',
        alamat: '',
        nomorTelepon: '',
        jenisKelamin: '',
        statusSiklus: 'Mulai', // Default Mulai
        tanggalDaftar: new Date().toISOString().split('T')[0], // Default hari ini
        jumlahTernakAwal: 5, // Default 5 kambing
        targetPengembalian: 6, // Default 6 kambing untuk pengembalian
    });

    const statusSiklusOptions = [
        { value: 'Mulai', label: 'Mulai' },
        { value: 'Selesai', label: 'Selesai' }
    ];

    useEffect(() => {
        if (initialData) {
            setFormData({
                namaLengkap: initialData.namaLengkap || '',
                nik: initialData.nik || '',
                alamat: initialData.alamat || '',
                nomorTelepon: initialData.nomorTelepon || '',
                jenisKelamin: initialData.jenisKelamin || '',
                statusSiklus: initialData.statusSiklus || 'Mulai',
                tanggalDaftar: initialData.tanggalDaftar || new Date().toISOString().split('T')[0],
                jumlahTernakAwal: initialData.jumlahTernakAwal || 5,
                targetPengembalian: initialData.targetPengembalian || 6,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi basic sebelum submit
        if (!formData.namaLengkap || !formData.nik || !formData.alamat || !formData.nomorTelepon || !formData.jenisKelamin || !formData.statusSiklus) {
            alert('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        console.log('Form Data being submitted:', formData);
        onSave(formData);
    };

    const genderOptions = [
        { value: 'Laki-laki', label: 'Laki-laki' },
        { value: 'Perempuan', label: 'Perempuan' },
    ];

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 animate-in fade-in duration-300">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nama Lengkap */}
                    <div>
                        <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input
                            type="text"
                            name="namaLengkap"
                            id="namaLengkap"
                            value={formData.namaLengkap}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            required
                        />
                    </div>
                    {/* NIK */}
                    <div>
                        <label htmlFor="nik" className="block text-sm font-medium text-gray-700">NIK</label>
                        <input
                            type="text"
                            name="nik"
                            id="nik"
                            value={formData.nik}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            required
                        />
                    </div>
                    {/* Nomor Telepon */}
                    <div>
                        <label htmlFor="nomorTelepon" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                        <input
                            type="text"
                            name="nomorTelepon"
                            id="nomorTelepon"
                            value={formData.nomorTelepon}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            required
                        />
                    </div>
                    {/* Jenis Kelamin */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                        <SearchableDropdown
                            options={genderOptions}
                            value={formData.jenisKelamin}
                            onChange={(value) => handleDropdownChange('jenisKelamin', value)}
                            placeholder="Pilih jenis kelamin..."
                            valueKey="value"
                            displayKey="label"
                        />
                    </div>
                    {/* Alamat */}
                    <div className="md:col-span-2">
                        <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
                        <textarea
                            name="alamat"
                            id="alamat"
                            rows="3"
                            value={formData.alamat}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            required
                        ></textarea>
                    </div>
                    {/* Status Siklus */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status Siklus</label>
                        <SearchableDropdown
                            options={statusSiklusOptions}
                            value={formData.statusSiklus}
                            onChange={(value) => handleDropdownChange('statusSiklus', value)}
                            placeholder="Pilih status siklus..."
                            valueKey="value"
                            displayKey="label"
                        />
                    </div>
                    {/* Tanggal Daftar */}
                    <div>
                        <label htmlFor="tanggalDaftar" className="block text-sm font-medium text-gray-700">Tanggal Daftar</label>
                        <input
                            type="date"
                            name="tanggalDaftar"
                            id="tanggalDaftar"
                            value={formData.tanggalDaftar}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            required
                        />
                    </div>
                    {/* Jumlah Ternak Awal */}
                    <div>
                        <label htmlFor="jumlahTernakAwal" className="block text-sm font-medium text-gray-700">Jumlah Kambing Awal</label>
                        <input
                            type="number"
                            name="jumlahTernakAwal"
                            id="jumlahTernakAwal"
                            value={formData.jumlahTernakAwal}
                            onChange={handleChange}
                            min="1"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            required
                        />
                    </div>
                    {/* Wajib Pengembalian */}
                    <div>
                        <label htmlFor="targetPengembalian" className="block text-sm font-medium text-gray-700">Wajib Pengembalian</label>
                        <input
                            type="number"
                            name="targetPengembalian"
                            id="targetPengembalian"
                            value={formData.targetPengembalian}
                            onChange={handleChange}
                            min="1"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:space-x-3 pt-4 space-y-2 space-y-reverse sm:space-y-0 mt-8">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PeternakForm;
