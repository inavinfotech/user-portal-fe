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
  Loader2
} from 'lucide-react';

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [addingApp, setAddingApp] = useState(false);
  
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
              <Key size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">Applications & API Keys</h1>
              <p className="text-gray-500 text-sm font-medium">Manage external microservices and their authentication credentials.</p>
           </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:bg-amber-700 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Register New App</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div className="py-20 text-center font-bold text-gray-400 uppercase tracking-widest animate-pulse flex items-center justify-center gap-3">
             <Cpu className="animate-spin" size={24} />
             Decrypting Integration Tokens...
          </div>
        ) : apps.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-100 shadow-sm flex flex-col items-center">
             <Key className="text-gray-100 mb-6" size={80} />
             <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">No external applications registered</p>
             <p className="text-gray-300 text-sm mt-2 max-w-sm">Connect your microservices to the central portal to enable ecosystem authentication.</p>
          </div>
        ) : (
          apps.map(app => (
            <div key={app.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-40 transition-opacity" />
               
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                 <div className="flex items-start gap-5 flex-1">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0 border border-gray-100 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-sm">
                       <Cpu size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight truncate">{app.name}</h3>
                        <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg border border-green-100 uppercase tracking-widest shrink-0">
                           {app.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium italic mb-4">Instance ID: {app.id}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">App ID</label>
                          <div className="flex items-center gap-2">
                             <code className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-mono text-gray-500 break-all select-all">
                               {app.id}
                             </code>
                             <button 
                               onClick={() => copyToClipboard(app.id)}
                               className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors"
                             >
                               {copiedKey === app.id ? <CheckCircle className="text-green-500" size={14} /> : <Copy size={14} />}
                             </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">API Key</label>
                          <div className="flex items-center gap-2">
                             <code className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-mono text-gray-500 break-all select-all">
                               {app.client_id}
                             </code>
                             <button 
                               onClick={() => copyToClipboard(app.client_id)}
                               className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors"
                             >
                               {copiedKey === app.client_id ? <CheckCircle className="text-green-500" size={14} /> : <Copy size={14} />}
                             </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">API Secret</label>
                        <div className="flex items-center gap-2 group/key">
                            <code className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono text-gray-400 flex-1 italic">
                              ••••••••••••••••••••••••••••••••••••••••
                            </code>
                            <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-amber-100 italic shrink-0">
                               Hashed & Secure
                            </div>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0 pt-4 lg:pt-0">
                    <button 
                      onClick={() => regenerateKey(app.client_id)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-amber-50 hover:text-amber-600 rounded-xl border border-gray-100 transition-all group/regen"
                    >
                      <RefreshCw size={14} className="group-hover/regen:rotate-180 transition-transform duration-500" />
                      Regenerate
                    </button>
                    <button 
                      onClick={() => handleRevokeApp(app.id)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl border border-gray-100 transition-all"
                    >
                      <Trash2 size={14} />
                      Revoke Access
                    </button>
                 </div>
               </div>
               
               <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 group-hover:text-amber-600 transition-colors cursor-default">
                        <ShieldCheck size={14} />
                        RBAC Enabled
                     </div>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-black text-gray-400 hover:text-amber-600 hover:gap-2 transition-all uppercase tracking-widest">
                    Integration Guide
                    <ChevronRight size={14} />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-4xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 bg-amber-600 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Cpu size={20} />
                 </div>
                 <h2 className="text-xl font-black tracking-tight">Register New App</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddApp} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Application Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Inventory Microservice"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-2xl text-gray-900 font-bold placeholder-gray-300 transition-all outline-none"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Summarize the core functionality..."
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-2xl text-gray-900 font-bold placeholder-gray-300 transition-all outline-none resize-none"
                  value={newAppDesc}
                  onChange={(e) => setNewAppDesc(e.target.value)}
                />
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 px-6 text-gray-500 font-black uppercase tracking-widest text-xs hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingApp}
                  className="flex-2 py-4 px-6 bg-amber-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-amber-500/20 hover:bg-amber-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {addingApp ? <Loader2 className="animate-spin" size={16} /> : null}
                  {addingApp ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal (One-time reveal) */}
      {successDetails && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-500 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl my-auto overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 relative flex flex-col max-h-[95vh]">
            <div className="px-10 py-8 bg-emerald-600 text-white shrink-0 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-2xl mb-4">
                    <ShieldCheck size={32} />
                 </div>
                 <h2 className="text-2xl font-black tracking-tighter mb-1 italic">Credentials Generated</h2>
                 <p className="text-emerald-50 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Store these securely immediately</p>
              </div>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-5">
                 {/* App ID */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System App ID</label>
                    <div className="flex items-center gap-3">
                       <code className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl text-[11px] font-mono text-gray-600 flex-1 select-all break-all">
                          {successDetails.id}
                       </code>
                       <button onClick={() => copyToClipboard(successDetails.id)} className="p-3.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all">
                          {copiedKey === successDetails.id ? <CheckCircle size={18} /> : <Copy size={18} />}
                       </button>
                    </div>
                 </div>

                 {/* API Key */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Public API Key (Client ID)</label>
                    <div className="flex items-center gap-3">
                       <code className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl text-[11px] font-mono text-gray-600 flex-1 select-all break-all">
                          {successDetails.client_id}
                       </code>
                       <button onClick={() => copyToClipboard(successDetails.client_id)} className="p-3.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all">
                          {copiedKey === successDetails.client_id ? <CheckCircle size={18} /> : <Copy size={18} />}
                       </button>
                    </div>
                 </div>

                 {/* API Secret */}
                 <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">One-Time API Secret (Never Shown Again)</label>
                    <div className="flex items-center gap-3 group">
                       <code className="bg-emerald-50 border-2 border-emerald-100 p-4 rounded-xl text-xs font-mono text-emerald-700 flex-1 select-all break-all font-black shadow-inner">
                          {successDetails.api_secret}
                       </code>
                       <button onClick={() => copyToClipboard(successDetails.api_secret)} className="p-4 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95">
                          {copiedKey === successDetails.api_secret ? <CheckCircle size={20} /> : <Copy size={20} />}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex gap-4">
                 <div className="shrink-0 text-amber-600 pt-1">
                    <Loader2 size={20} className="animate-spin" />
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-tight mb-1">Security Warning</h4>
                    <p className="text-amber-800 text-[11px] font-medium leading-relaxed">
                       This secret key will NOT be displayed again. If you lose it, you must regenerate it, which will decouple any active integrations.
                    </p>
                 </div>
              </div>

              <div className="pt-2">
                 <button
                   onClick={() => setSuccessDetails(null)}
                   className="w-full py-4 bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-xl hover:bg-black transition-all active:scale-[0.98] shadow-xl"
                 >
                   I Have Saved These Credentials
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Applications;
