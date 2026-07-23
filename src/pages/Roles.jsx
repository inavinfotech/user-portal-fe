import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  ChevronRight,
  Zap,
  Lock,
  X,
  Check,
  Loader2,
  FileText
} from 'lucide-react';
import { cn } from '../utils/cn';

const RoleModal = ({ isOpen, onClose, onSubmit, availablePermissions }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    setFormData({ name: '', description: '', permissions: [] });
  };

  const togglePermission = (permId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId) 
        ? prev.permissions.filter(id => id !== permId)
        : [...prev.permissions, permId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Plus size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Create New Role</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Role Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Editor, Moderator"
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-sm font-medium transition-all outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 pt-3 flex items-start pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <FileText size={18} />
                </div>
                <textarea
                  placeholder="What can this role do?"
                  rows="3"
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-sm font-medium transition-all outline-none resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-1">Assign Permissions</label>
              <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {availablePermissions.map(perm => (
                  <button
                    key={perm.id}
                    type="button"
                    onClick={() => togglePermission(perm.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border group",
                      formData.permissions.includes(perm.id)
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                        : "bg-white border-gray-100 text-gray-500 hover:border-emerald-200"
                    )}
                  >
                    <span>{perm.resource}:{perm.action}</span>
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center transition-all border",
                      formData.permissions.includes(perm.id)
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-gray-50 border-gray-100 group-hover:border-emerald-200"
                    )}>
                      {formData.permissions.includes(perm.id) && <Check size={12} />}
                    </div>
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
              className="flex-2 py-3 px-8 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
              {loading ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        api.get('/rbac/roles'),
        api.get('/rbac/permissions')
      ]);
      setRoles(rolesRes.data);
      setAvailablePermissions(permsRes.data);
    } catch (error) {
      console.error('Failed to fetch initial data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (formData) => {
    try {
      // 1. Create Role
      const roleResponse = await api.post('/rbac/roles', {
        name: formData.name,
        description: formData.description
      });

      const roleId = roleResponse.data.id;

      // 2. Assign Permissions
      if (formData.permissions.length > 0) {
        await Promise.all(formData.permissions.map(permId => 
          api.post('/rbac/assignments/role-permission', {
            role_id: roleId,
            permission_id: permId
          })
        ));
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to create role');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Roles</h2>
          <p className="text-gray-500 text-sm mt-1">Configure user role tiers and assigned resource permissions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>Create New Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-gray-400 font-medium italic">
             Loading role configuration data...
          </div>
        ) : roles.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 flex flex-col items-center">
             <ShieldAlert className="text-gray-300 mb-3" size={48} />
             <p className="text-gray-500 font-bold">No roles defined in the system</p>
             <p className="text-gray-400 text-sm mt-1">Start by creating a system role.</p>
          </div>
        ) : (
          roles.map(role => (
            <div key={role.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                      <Lock size={20} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 tracking-tight">{role.name}</h3>
                 </div>
                 <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete Role">
                      <Trash2 size={18} />
                    </button>
                 </div>
              </div>
              
              <p className="text-sm font-medium text-gray-500 mb-6 italic">{role.description || 'No description provided.'}</p>
              
              <div className="space-y-3">
                 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                   Active Permissions
                   <div className="flex-1 h-px bg-gray-100" />
                 </h4>
                 <div className="flex flex-wrap gap-1.5">
                    {role.permissions?.length > 0 ? (
                      role.permissions.map(perm => (
                        <div key={perm.id} className="flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 text-xs font-semibold">
                          <span>{perm.resource}:{perm.action}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">No permissions assigned</span>
                    )}
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Tier: {role.name === 'admin' ? 'Root Administrator' : 'Standard User'}
                 </span>
              </div>
            </div>
          ))
        )}
      </div>

      <RoleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateRole}
        availablePermissions={availablePermissions}
      />
    </div>
  );
};

export default Roles;


