import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Shield as ShieldIcon, 
  Plus, 
  Trash2, 
  Search,
  X,
  Check,
  Loader2,
  Lock,
  Zap,
  Fingerprint
} from 'lucide-react';
import { cn } from '../utils/cn';

const PermissionModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    resource: '',
    action: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    setFormData({ name: '', description: '', resource: '', action: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
              <Plus size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Configure Permission</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Permission Name</label>
              <input
                type="text"
                required
                placeholder="e.g. users_read_all"
                className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Resource</label>
                 <input
                   type="text"
                   required
                   placeholder="e.g. users, systems"
                   className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900"
                   value={formData.resource}
                   onChange={e => setFormData({...formData, resource: e.target.value})}
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Action</label>
                 <input
                   type="text"
                   required
                   placeholder="e.g. read, write, delete"
                   className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900"
                   value={formData.action}
                   onChange={e => setFormData({...formData, action: e.target.value})}
                 />
               </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Describe what this permission enables..."
                rows="3"
                className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900 resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
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
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
              {loading ? 'Creating...' : 'Create Permission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Permissions = () => {

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/rbac/permissions');
      setPermissions(response.data);
    } catch (error) {
      console.error('Failed to fetch permissions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePermission = async (formData) => {
    try {
      await api.post('/rbac/permissions', formData);
      setIsModalOpen(false);
      fetchPermissions();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to create permission');
    }
  };

  const filteredPermissions = permissions.filter(perm => 
    perm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perm.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perm.action?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Permissions Registry</h2>
          <p className="text-gray-500 text-sm mt-1">Fine-grained access control nodes for application resources.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>New Permission</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex items-center">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter permissions by resource, action, or name..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-gray-400 font-medium italic">
               Loading permission registry...
            </div>
          ) : filteredPermissions.length === 0 ? (
            <div className="col-span-full py-16 text-center flex flex-col items-center">
               <ShieldIcon className="text-gray-300 mb-3" size={48} />
               <p className="text-gray-500 font-bold">No permissions found</p>
            </div>
          ) : (
            filteredPermissions.map(perm => (
              <div key={perm.id} className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                      <Zap size={16} />
                   </div>
                   <span className="text-xs font-bold text-primary-700 uppercase bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                      {perm.action}
                   </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{perm.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{perm.resource}</p>
                <p className="text-xs text-gray-500 font-medium border-t border-gray-50 pt-3 italic">
                  {perm.description || 'System security permission node.'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <PermissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreatePermission}
      />
    </div>
  );
};

export default Permissions;

