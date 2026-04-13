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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Plus size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Create Permission</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Permission Name</label>
              <input
                type="text"
                required
                placeholder="e.g. users_read_all"
                className="block w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-sm font-medium transition-all outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-sm font-bold text-gray-700 ml-1">Resource</label>
                 <input
                   type="text"
                   required
                   placeholder="e.g. users, systems"
                   className="block w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-sm font-medium transition-all outline-none"
                   value={formData.resource}
                   onChange={e => setFormData({...formData, resource: e.target.value})}
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-sm font-bold text-gray-700 ml-1">Action</label>
                 <input
                   type="text"
                   required
                   placeholder="e.g. read, write, delete"
                   className="block w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-sm font-medium transition-all outline-none"
                   value={formData.action}
                   onChange={e => setFormData({...formData, action: e.target.value})}
                 />
               </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
              <textarea
                placeholder="Describe what this permission enables"
                rows="3"
                className="block w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-sm font-medium transition-all outline-none resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
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
              className="flex-2 py-3 px-8 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Lock size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">Permissions Registry</h1>
              <p className="text-gray-500 text-sm font-medium">Fine-grained access control nodes for your infrastructure.</p>
           </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>New Permission</span>
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex items-center bg-gray-50/30">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter nodes by resource, action or name..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {loading ? (
            <div className="col-span-full py-20 text-center font-bold text-gray-400 uppercase tracking-widest animate-pulse">
               Fetching Access Nodes...
            </div>
          ) : filteredPermissions.length === 0 ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
               <ShieldIcon className="text-gray-100 mb-4" size={64} />
               <p className="text-gray-400 font-bold uppercase tracking-widest">No permissions found</p>
            </div>
          ) : (
            filteredPermissions.map(perm => (
              <div key={perm.id} className="p-6 rounded-3xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Fingerprint size={80} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Zap size={16} />
                   </div>
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                      {perm.action}
                   </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{perm.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{perm.resource}</p>
                <p className="text-xs text-gray-500 font-medium leading-relaxed italic border-t border-gray-50 pt-4">
                  {perm.description || 'System generated security node.'}
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
