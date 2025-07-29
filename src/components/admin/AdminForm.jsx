import { useState, useEffect } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import SearchableDropdown from '../common/SearchableDropdown';

const AdminForm = ({ admin, onSave, onCancel, currentUserRole }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Admin'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Menentukan apakah mode "edit" atau "tambah"
    const isEditMode = !!admin;

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                fullName: admin.fullName || '',
                email: admin.email || '',
                password: '',
                confirmPassword: '',
                role: admin.role || 'Admin'
            });
        } else {
            // Reset form untuk admin baru
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'Admin'
            });
        }
    }, [admin, isEditMode]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap harus diisi';

        if (!formData.email.trim()) {
            newErrors.email = 'Email harus diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        // Password wajib diisi hanya saat menambah admin baru
        if (!isEditMode && !formData.password) {
            newErrors.password = 'Password harus diisi';
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        }

        // Konfirmasi password hanya divalidasi jika password diisi
        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password tidak sama';
        }

        if (!formData.role) newErrors.role = 'Role harus dipilih';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            const { confirmPassword, ...dataToSave } = formData;
            dataToSave.status = 'Aktif';
            onSave(dataToSave);
        } catch (error) {
            console.error('Error saving admin:', error);
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        { value: 'Admin', label: 'Admin', subtitle: 'Akses terbatas pada fitur operasional.' },
        { value: 'Super Admin', label: 'Super Admin', subtitle: 'Akses penuh ke semua fitur dan pengaturan.' }
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.fullName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
                            placeholder="Masukkan nama lengkap"
                        />
                    </div>
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>

                {/* Email & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
                                placeholder="Masukkan email"
                            />
                        </div>
                        {isEditMode && <p className="mt-1 text-xs text-gray-500">Email untuk login.</p>}
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                        <SearchableDropdown
                            options={roleOptions}
                            value={formData.role}
                            onChange={(value) => handleDropdownChange('role', value)}
                            placeholder="Pilih role..."
                            searchPlaceholder="Cari role..."
                            displayKey="label"
                            valueKey="value"
                            searchKeys={['label', 'subtitle']}
                            noResultsText="Role tidak ditemukan"
                            disabled={isEditMode} // Dinonaktifkan saat mode edit
                        />
                        {isEditMode && <p className="mt-1 text-xs text-gray-500">Role tidak dapat diubah setelah dibuat.</p>}
                        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                    </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password {!isEditMode && '*'}</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
                                placeholder={isEditMode ? "Kosongkan jika tidak diubah" : "Masukkan password"}
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>
                    {formData.password && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'}`}
                                    placeholder="Konfirmasi password"
                                />
                            </div>
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>
                    )}
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
                            isEditMode ? 'Update Admin' : 'Simpan Admin'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminForm;