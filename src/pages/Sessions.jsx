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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Active Sessions</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor and manage active portal sessions across your devices.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        {loading ? (
          <div className="py-16 text-center text-gray-400 font-medium italic">
             Loading active session list...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
             <ShieldX className="text-gray-300 mb-3" size={48} />
             <p className="text-gray-500 font-bold">No active sessions tracked</p>
             <p className="text-gray-400 text-sm mt-1">Authenticated sessions will appear here.</p>
          </div>
        ) : (
          sessions.map(sess => (
            <div key={sess.id} className="p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                       {sess.user_agent?.toLowerCase().includes('mobile') ? <Smartphone size={24} /> : <Monitor size={24} />}
                    </div>
                    <div className="space-y-2">
                       <div>
                         <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-gray-900 tracking-tight">
                               {sess.user_agent?.split('(')[0] || 'Unknown Device'}
                            </h3>
                            {sess.token_jti === localStorage.getItem('token_jti') ? (
                               <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                                  <CheckCircle2 size={12} /> Current Device
                               </span>
                            ) : null}
                         </div>
                         <p className="text-xs text-gray-400 font-medium italic mt-0.5">{sess.user_agent}</p>
                       </div>

                       <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                          <div className="flex items-center gap-1.5">
                             <Globe size={14} className="text-gray-400" />
                             <span>{sess.ip_address || '127.0.0.1'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <Clock size={14} className="text-gray-400" />
                             <span>Expires: {new Date(sess.expires_at).toLocaleString()}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex shrink-0">
                    <button 
                      onClick={() => revokeSession(sess.token_jti)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
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
      
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
         <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
            <ShieldX size={20} />
         </div>
         <div>
            <h3 className="text-base font-bold text-gray-900">Security Recommendation</h3>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
               If you recognize unfamiliar devices or unexpected locations, revoke their sessions immediately to safeguard your account.
            </p>
         </div>
      </div>
    </div>
  );
};

export default Sessions;
