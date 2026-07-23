import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users as UsersIcon, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Mail, 
  Shield, 
  Trash2, 
  Edit,
  X,
  Check,
  Loader2,
  Lock,
  User as UserIcon,
  Eye,
  Cpu
} from 'lucide-react';

import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';

const UserModal = ({ isOpen, onClose, onSubmit, availableRoles, editingUser }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    roles: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        setFormData({
          full_name: editingUser.full_name || '',
          email: editingUser.email || '',
          password: '',
          roles: editingUser.roles?.map(r => r.id) || []
        });
      } else {
        setFormData({ full_name: '', email: '', password: '', roles: [] });
      }
    }
  }, [isOpen, editingUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    setFormData({ full_name: '', email: '', password: '', roles: [] });
  };

  const toggleRole = (roleId) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId) 
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
              {editingUser ? <Edit size={20} /> : <UserPlus size={20} />}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {editingUser ? 'Edit User' : 'Configure New User'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900"
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {editingUser ? 'New Password' : 'Initial Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? 'Leave blank to keep current' : '••••••••'}
                  className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Assign Roles {editingUser && <span className="text-xs text-gray-400 font-normal">(Cannot edit roles for existing users)</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableRoles.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => toggleRole(role.id)}
                    disabled={!!editingUser}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-bold transition-all border",
                      formData.roles.includes(role.id)
                        ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-primary-500 hover:text-primary-600",
                      editingUser && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (editingUser ? <Edit size={18} /> : <Check size={18} />)}
              {loading ? (editingUser ? 'Saving...' : 'Creating...') : (editingUser ? 'Save Changes' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get('/users/'),
        api.get('/rbac/roles')
      ]);
      setUsers(usersRes.data);
      setAvailableRoles(rolesRes.data);
    } catch (error) {
      console.error('Failed to fetch initial data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUser = async (formData) => {
    try {
      if (editingUser) {
        // Edit User Flow
        const updatePayload = {
          email: formData.email,
          full_name: formData.full_name,
          is_active: true
        };
        if (formData.password) {
          updatePayload.password = formData.password;
        }

        await api.put(`/users/${editingUser.id}`, updatePayload);
        setIsModalOpen(false);
        setEditingUser(null);
        fetchData();
      } else {
        // Create User Flow
        const userResponse = await api.post('/users/', {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          is_active: true
        });

        const userId = userResponse.data.id;

        // Assign Roles
        if (formData.roles.length > 0) {
          await Promise.all(formData.roles.map(roleId => 
            api.post('/rbac/assignments/user-role', {
              user_id: userId,
              role_id: roleId
            })
          ));
        }

        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to save user');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${userId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Registered Users</h2>
          <p className="text-gray-500 text-sm mt-1">Manage organization members, credentials, and access roles.</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
        >
          <UserPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created Via</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {loading ? (
                <tr>
                   <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium italic">Loading user data...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium italic">No users found in portal.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold border border-primary-100 shrink-0">
                           {user.full_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-snug">{user.full_name}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                            <Mail size={12} />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles?.map(role => (
                          <span key={role.id} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                            {role.name}
                          </span>
                        )) || <span className="text-gray-300 italic text-xs">No roles</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.creation_source === 'EXTERNAL_API' || user.created_by_app_id ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200/60 w-fit">
                          <Cpu size={14} className="text-amber-600 shrink-0" />
                          <span>{user.created_by_app_name || 'External API'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full border border-gray-200 w-fit">
                          <UsersIcon size={14} className="text-gray-500 shrink-0" />
                          <span>Portal Admin</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                       <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => navigate(`/users/${user.id}`)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => openEditModal(user)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }} 
        onSubmit={handleSubmitUser}
        availableRoles={availableRoles}
        editingUser={editingUser}
      />
    </div>
  );
};

export default Users;

