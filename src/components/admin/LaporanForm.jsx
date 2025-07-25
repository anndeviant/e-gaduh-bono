// ...existing code...
import { useState } from 'react';

function LaporanForm({ peternakId, initialData = {}, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        peternakId: peternakId || initialData.peternakId || '',
        tanggalLaporan: initialData.tanggalLaporan || '',
        triwulan: initialData.triwulan || '',
        tahun: initialData.tahun || new Date().getFullYear(),
        jumlahTernakAwal: initialData.jumlahTernakAwal || '',
        jumlahLahir: initialData.jumlahLahir || '',
        jumlahMati: initialData.jumlahMati || '',
        jumlahTerjual: initialData.jumlahTerjual || '',
        jumlahAkhirPeriode: initialData.jumlahAkhirPeriode || '',
        kendala: initialData.kendala || '',
        solusi: initialData.solusi || '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validasi wajib
        if (!form.tanggalLaporan || !form.triwulan || !form.tahun || !form.jumlahTernakAwal || !form.jumlahLahir || !form.jumlahMati || !form.jumlahTerjual) {
            setError('Mohon isi semua field wajib.');
            return;
        }
        setError('');
        onSubmit(form);
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Laporan *</label>
                <input
                    type="date"
                    name="tanggalLaporan"
                    value={form.tanggalLaporan}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Triwulan *</label>
                    <select
                        name="triwulan"
                        value={form.triwulan}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        required
                    >
                        <option value="">Pilih Triwulan</option>
                        <option value="1">Triwulan I</option>
                        <option value="2">Triwulan II</option>
                        <option value="3">Triwulan III</option>
                        <option value="4">Triwulan IV</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun *</label>
                    <input
                        type="number"
                        name="tahun"
                        value={form.tahun}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        min="2024"
                        max="2100"
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Ternak Awal *</label>
                    <input
                        type="number"
                        name="jumlahTernakAwal"
                        value={form.jumlahTernakAwal}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Lahir *</label>
                    <input
                        type="number"
                        name="jumlahLahir"
                        value={form.jumlahLahir}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        min="0"
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Mati *</label>
                    <input
                        type="number"
                        name="jumlahMati"
                        value={form.jumlahMati}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Terjual *</label>
                    <input
                        type="number"
                        name="jumlahTerjual"
                        value={form.jumlahTerjual}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-sm"
                        min="0"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Akhir Periode</label>
                <input
                    type="number"
                    name="jumlahAkhirPeriode"
                    value={form.jumlahAkhirPeriode}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    min="0"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kendala</label>
                <textarea
                    name="kendala"
                    value={form.kendala}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows={2}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solusi</label>
                <textarea
                    name="solusi"
                    value={form.solusi}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows={2}
                />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 text-sm"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 text-white text-sm"
                >
                    Simpan
                </button>
            </div>
        </form>
    );
}
// ...existing code...