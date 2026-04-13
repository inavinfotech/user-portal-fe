import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Activity, 
  Trash2, 
  Monitor, 
  Globe, 
  Clock, 
  ShieldX,
  Smartphone,
  CheckCircle2,
  XCircle,
  ChevronRight
} from 'lucide-react';


const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/sessions/active');
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (jti) => {
    if (!window.confirm('Terminating this session will force an immediate logout on that device.')) return;
    try {
      await api.post('/sessions/revoke', { token_jti: jti });
      fetchSessions();
    } catch (error) {
      alert('Failed to revoke session');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Activity size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">Active Sessions</h1>
              <p className="text-gray-500 text-sm font-medium">Monitor and manage your active accounts across all devices.</p>
           </div>
        </div>
        <button 
           onClick={() => {}}
           className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-black transition-all active:scale-95"
        >
          Revoke All Other Sessions
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        {loading ? (
          <div className="py-20 text-center font-extrabold text-gray-400 uppercase tracking-widest animate-pulse italic">
             Tracing active session identifiers...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
             <ShieldX className="text-gray-200 mb-6" size={80} />
             <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">No active sessions tracked</p>
             <p className="text-gray-300 text-sm mt-2">Authenticates sessions will appear here in real-time.</p>
          </div>
        ) : (
          sessions.map(sess => (
            <div key={sess.id} className="p-8 hover:bg-indigo-50/20 transition-all duration-300 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                 <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-indigo-600 border border-gray-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                       {sess.user_agent?.toLowerCase().includes('mobile') ? <Smartphone size={32} /> : <Monitor size={32} />}
                    </div>
                    <div className="space-y-4">
                       <div>
                         <div className="flex items-center gap-3">
                            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                               {sess.user_agent?.split('(')[0] || 'Unknown Device'}
                            </h3>
                            {sess.token_jti === localStorage.getItem('token_jti') ? (
                               <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg border border-indigo-100 uppercase tracking-widest flex items-center gap-1">
                                  <CheckCircle2 size={10} /> This Device
                               </span>
                            ) : null}
                         </div>
                         <p className="text-xs text-gray-400 font-medium italic mt-1">{sess.user_agent}</p>
                       </div>

                       <div className="flex flex-wrap gap-6">
                          <div className="flex items-center gap-2 text-gray-500">
                             <Globe size={16} className="text-gray-400" />
                             <span className="text-xs font-bold">{sess.ip_address || '127.0.0.1'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                             <Clock size={16} className="text-gray-400" />
                             <span className="text-xs font-bold">Expires: {new Date(sess.expires_at).toLocaleString()}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex shrink-0">
                    <button 
                      onClick={() => revokeSession(sess.token_jti)}
                      className="group/btn flex items-center gap-2 px-5 py-3 text-xs font-extrabold text-red-500 bg-red-50/50 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 shadow-sm hover:shadow-red-500/20 active:scale-95"
                    >
                      <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                      Revoke Access
                    </button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/30 group">
         <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
            <ShieldX size={200} />
         </div>
         <div className="relative z-10 max-w-xl">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
               <ShieldX size={24} />
               Security Recommendation
            </h3>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6 opacity-90">
               If you notice any unfamiliar devices or suspicious IP addresses, we strongly recommend revoking all sessions immediately and changing your password to secure your account.
            </p>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] cursor-pointer hover:underline">
               Learn more about session security
               <ChevronRight size={14} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Sessions;
