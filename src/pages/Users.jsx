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
  User as UserIcon
} from 'lucide-react';
import { cn } from '../utils/cn';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              {editingUser ? <Edit size={20} /> : <UserPlus size={20} />}
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-sm font-medium transition-all outline-none"
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-sm font-medium transition-all outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">
                {editingUser ? 'New Password' : 'Initial Password'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? 'Leave blank to keep current' : '••••••••'}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-sm font-medium transition-all outline-none"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
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
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                      formData.roles.includes(role.id)
                        ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20"
                        : "bg-white border-gray-200 text-gray-500 hover:border-primary-500 hover:text-primary-600",
                      editingUser && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 py-3 px-8 bg-primary-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
              <UsersIcon size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">Users Management</h1>
              <p className="text-gray-500 text-sm font-medium">Manage your organizations members and their status.</p>
           </div>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all active:scale-95"
        >
          <UserPlus size={18} />
          <span>Add New User</span>
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-primary-500/10 outline-none shadow-sm">
               <option>All Status</option>
               <option>Active</option>
               <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Roles</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                   <td colSpan="3" className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest">Loading Resources...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest">No users found in portal</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-primary-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 border-2 border-white shadow-sm shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                           {user.full_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-snug">{user.full_name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 font-medium italic">
                            <Mail size={12} />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-2">
                        {user.roles?.map(role => (
                          <span key={role.id} className="px-2.5 py-1 bg-primary-50 text-primary-600 text-[10px] font-extrabold rounded-lg border border-primary-100 uppercase tracking-wider">
                            {role.name}
                          </span>
                        )) || <span className="text-gray-300 italic text-xs">No roles assigned</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openEditModal(user)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-100 rounded-xl transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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

