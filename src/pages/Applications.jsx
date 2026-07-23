import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Key, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Copy, 
  CheckCircle,
  Cpu,
  ShieldCheck,
  ChevronRight,
  X,
  Loader2,
  Edit3
} from 'lucide-react';
import { cn } from '../utils/cn';

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [addingApp, setAddingApp] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [editAppName, setEditAppName] = useState('');
  const [editAppDesc, setEditAppDesc] = useState('');
  const [updatingApp, setUpdatingApp] = useState(false);
  
  // Success Modal State
  const [successDetails, setSuccessDetails] = useState(null);


  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await api.get('/applications/');
      setApps(response.data);
    } catch (error) {
      console.error('Failed to fetch apps', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddApp = async (e) => {
    e.preventDefault();
    setAddingApp(true);
    try {
      const response = await api.post('/applications/', {
        name: newAppName,
        description: newAppDesc,
        is_active: true
      });
      setIsModalOpen(false);
      setNewAppName('');
      setNewAppDesc('');
      setSuccessDetails(response.data);
      fetchApps();
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to register application';
      alert(message);
    } finally {

      setAddingApp(false);
    }
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setEditAppName(app.name || '');
    setEditAppDesc(app.description || '');
    setIsEditModalOpen(true);
  };

  const handleUpdateApp = async (e) => {
    e.preventDefault();
    if (!editingApp) return;
    setUpdatingApp(true);
    try {
      await api.put(`/applications/${editingApp.id}`, {
        name: editAppName,
        description: editAppDesc
      });
      setIsEditModalOpen(false);
      setEditingApp(null);
      fetchApps();
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to update application';
      alert(message);
    } finally {
      setUpdatingApp(false);
    }
  };


  const handleRevokeApp = async (appId) => {
    if (!window.confirm('CRITICAL: revoking this application will permanently disable its credentials. This action cannot be undone.')) return;
    try {
      await api.delete(`/applications/${appId}`);
      fetchApps();
    } catch (error) {
      alert('Failed to revoke application');
    }
  };

  const regenerateKey = async (clientId) => {
    if (!window.confirm('CRITICAL: Regenerating the secret will permanently disable the old one. Please ensure you update your integration immediately.')) return;
    try {
      const response = await api.post(`/applications/${clientId}/regenerate-secret`);
      setSuccessDetails(response.data);
      fetchApps();
    } catch (error) {
      alert('Failed to regenerate secret');
    }
  };

  const copyToClipboard = (key) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Registered Applications</h2>
          <p className="text-gray-500 text-sm mt-1">Manage external microservices and API authentication credentials.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>Register New App</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-16 text-center text-gray-400 font-medium italic">
             Loading applications data...
          </div>
        ) : apps.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 shadow-sm flex flex-col items-center">
             <Key className="text-gray-300 mb-3" size={48} />
             <p className="text-gray-500 font-bold">No external applications registered</p>
             <p className="text-gray-400 text-sm mt-1 max-w-sm">Register microservices to generate API keys and secret tokens.</p>
          </div>
        ) : (
          apps.map(app => (
            <div key={app.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                 <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                       <Cpu size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight truncate">{app.name}</h3>
                        <span className={cn(
                          "px-2.5 py-0.5 text-xs font-bold rounded-full uppercase border",
                          app.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-100 text-gray-500 border-gray-200"
                        )}>
                           {app.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium italic mb-4">Instance ID: {app.id}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">App ID</label>
                          <div className="flex items-center gap-2">
                             <code className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-600 break-all select-all flex-1">
                               {app.id}
                             </code>
                             <button 
                               onClick={() => copyToClipboard(app.id)}
                               className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                             >
                               {copiedKey === app.id ? <CheckCircle className="text-emerald-500" size={16} /> : <Copy size={16} />}
                             </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">API Key (Client ID)</label>
                          <div className="flex items-center gap-2">
                             <code className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-600 break-all select-all flex-1">
                               {app.client_id}
                             </code>
                             <button 
                               onClick={() => copyToClipboard(app.client_id)}
                               className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                             >
                               {copiedKey === app.client_id ? <CheckCircle className="text-emerald-500" size={16} /> : <Copy size={16} />}
                             </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">API Secret</label>
                        <div className="flex items-center gap-2">
                            <code className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-400 flex-1 italic">
                              ••••••••••••••••••••••••••••••••••••••••
                            </code>
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                               Hashed & Secure
                            </span>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                    <button 
                      onClick={() => openEditModal(app)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all"
                    >
                      <Edit3 size={14} />
                      Edit Name
                    </button>
                    <button 
                      onClick={() => regenerateKey(app.client_id)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all"
                    >
                      <RefreshCw size={14} />
                      Regenerate
                    </button>
                    <button 
                      onClick={() => handleRevokeApp(app.id)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                    >
                      <Trash2 size={14} />
                      Revoke
                    </button>
                 </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Configure Application</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddApp} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Inventory Microservice"
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Summarize the core functionality..."
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900 resize-none"
                  value={newAppDesc}
                  onChange={(e) => setNewAppDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingApp}
                  className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addingApp ? <Loader2 className="animate-spin" size={16} /> : null}
                  {addingApp ? 'Registering...' : 'Generate Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal (One-time reveal) */}
      {successDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Application Credentials</h3>
            
            <div className="space-y-5">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex gap-3 items-start">
                <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-amber-900 text-sm">Security Warning!</p>
                  <p className="text-xs text-amber-800 font-medium mt-1 leading-relaxed">
                    Please copy these credentials immediately. The <span className="underline font-bold">API Secret</span> will not be displayed again.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                 <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">System App ID</label>
                    <div className="flex items-center justify-between gap-2">
                       <code className="text-xs font-mono text-gray-700 break-all select-all">{successDetails.id}</code>
                       <button onClick={() => copyToClipboard(successDetails.id)} className="text-gray-400 hover:text-primary-600">
                          {copiedKey === successDetails.id ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                       </button>
                    </div>
                 </div>

                 <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Public API Key (Client ID)</label>
                    <div className="flex items-center justify-between gap-2">
                       <code className="text-xs font-mono text-gray-700 break-all select-all">{successDetails.client_id}</code>
                       <button onClick={() => copyToClipboard(successDetails.client_id)} className="text-gray-400 hover:text-primary-600">
                          {copiedKey === successDetails.client_id ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                       </button>
                    </div>
                 </div>

                 <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                    <label className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">One-Time API Secret</label>
                    <div className="flex items-center justify-between gap-2">
                       <code className="text-xs font-mono text-emerald-900 font-bold break-all select-all">{successDetails.api_secret}</code>
                       <button onClick={() => copyToClipboard(successDetails.api_secret)} className="text-emerald-600 hover:text-emerald-800">
                          {copiedKey === successDetails.api_secret ? <CheckCircle size={16} className="text-emerald-600" /> : <Copy size={16} />}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="pt-3">
                 <button
                   onClick={() => setSuccessDetails(null)}
                   className="w-full py-3.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition-all active:scale-[0.98]"
                 >
                   I Have Saved These Credentials
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit App Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Application Details</h3>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingApp(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateApp} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Inventory Microservice"
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900"
                  value={editAppName}
                  onChange={(e) => setEditAppName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  rows="3"
                  placeholder="Summarize the core functionality..."
                  className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900 resize-none"
                  value={editAppDesc}
                  onChange={(e) => setEditAppDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingApp(null);
                  }}
                  className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingApp}
                  className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updatingApp ? <Loader2 className="animate-spin" size={16} /> : null}
                  {updatingApp ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;

