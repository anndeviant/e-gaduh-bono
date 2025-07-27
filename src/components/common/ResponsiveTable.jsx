import { Eye, EyeOff, User, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

const ResponsiveTable = ({
    data,
    columns,
    onEdit,
    onDelete,
    onView,
    className = "",
    showPasswordToggle = false,
    currentUserEmail = ''
}) => {
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const togglePasswordVisibility = (itemId) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const getRoleBadge = (role) => {
        const isAdmin = role === 'Super Admin';
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isAdmin
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
                }`}>
                {role}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'active': 'bg-green-100 text-green-800',
            'Aktif': 'bg-green-100 text-green-800',
            'Baik': 'bg-green-100 text-green-800',
            'inactive': 'bg-gray-100 text-gray-800',
            'Tidak Aktif': 'bg-gray-100 text-gray-800',
            'Perhatian': 'bg-yellow-100 text-yellow-800',
            'Bermasalah': 'bg-red-100 text-red-800'
        };
        const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status] || statusConfig[normalizedStatus] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const renderCellContent = (item, column) => {
        const value = column.accessor ? item[column.accessor] : column.render?.(item);

        // Handle special cases
        if (column.key === 'role' && value) {
            return getRoleBadge(value);
        }

        if (column.key === 'status' && value) {
            return getStatusBadge(value);
        }

        if (column.key === 'password' && showPasswordToggle) {
            // Hanya tampilkan password untuk admin biasa, tidak untuk Super Admin
            if (item.role === 'Super Admin') {
                return <span className="text-sm text-gray-400 italic">Tersembunyi</span>;
            }

            return (
                <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-2 font-mono">
                        {visiblePasswords[item.id] ? (item.generatedPassword || value) : '••••••••••••••'}
                    </span>
                    <button
                        onClick={() => togglePasswordVisibility(item.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {visiblePasswords[item.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            );
        }

        if (column.key === 'admin' || column.key === 'peternak') {
            const entity = column.render(item);
            return (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{entity.name || item.namaLengkap}</div>
                        <div className="text-sm text-gray-500">{entity.email}</div>
                        {/* Tampilkan role di bawah email untuk admin */}
                        {entity.role && <div className="text-xs text-gray-600 mt-1">{getRoleBadge(entity.role)}</div>}
                        {/* Tampilkan NIK untuk peternak */}
                        {item.nik && <div className="text-xs text-gray-400">NIK: {item.nik}</div>}
                    </div>
                </div>
            );
        }

        return <span className="text-sm text-gray-900">{value}</span>;
    };

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500">Tidak ada data yang tersedia</div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
            {/* Mobile dan Desktop: Table dengan horizontal scroll */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                        style={{ minWidth: column.minWidth || 'auto' }}
                                    >
                                        {column.header}
                                    </th>
                                ))}
                                {(onEdit || onDelete || onView) && (
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Aksi
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-4 sm:px-6 py-4 whitespace-nowrap text-left"
                                            style={{ minWidth: column.minWidth || 'auto' }}
                                        >
                                            {renderCellContent(item, column)}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete || onView) && (
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                            <div className="flex items-center justify-start space-x-2">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(item)}
                                                        className="text-green-600 hover:text-green-900 transition-colors p-1"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="text-red-600 hover:text-red-900 transition-colors p-1 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                        title={item.email === currentUserEmail ? "Tidak dapat menghapus diri sendiri" : "Hapus"}
                                                        disabled={item.email === currentUserEmail}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveTable;
