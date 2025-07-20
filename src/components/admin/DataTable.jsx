import { Eye, EyeOff, User, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

const DataTable = ({ admins, onEdit, onDelete }) => {
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (adminId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
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
    const isActive = status === 'Aktif';
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isActive
        ? 'bg-green-100 text-green-800'
        : 'bg-gray-100 text-gray-800'
        }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="overflow-hidden">
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {admins.map((admin) => (
          <div key={admin.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                  <div className="text-xs text-gray-500">{admin.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(admin)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(admin)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-medium text-gray-500">Username:</span>
                <div className="mt-1">@{admin.username}</div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Role:</span>
                <div className="mt-1">{getRoleBadge(admin.role)}</div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Status:</span>
                <div className="mt-1">{getStatusBadge(admin.status)}</div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Password:</span>
                <div className="mt-1 flex items-center">
                  <span className="mr-2">
                    {visiblePasswords[admin.id] ? admin.password : '••••••••••••••'}
                  </span>
                  <button
                    onClick={() => togglePasswordVisibility(admin.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {visiblePasswords[admin.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs text-gray-500">
              <div>
                <span className="font-medium">Login Terakhir:</span>
                <div>{admin.lastLogin || 'Belum pernah'}</div>
              </div>
              <div>
                <span className="font-medium">Dibuat:</span>
                <div>{admin.createdAt}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Login Terakhir
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dibuat
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                      <div className="text-xs text-gray-400">@{admin.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(admin.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(admin.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-2 font-mono">
                      {visiblePasswords[admin.id] ? admin.password : '••••••••••••••'}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(admin.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {visiblePasswords[admin.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.lastLogin || 'Belum pernah'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(admin)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(admin)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
