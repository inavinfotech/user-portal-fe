import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, LayoutDashboard } from 'lucide-react';
import { cn } from '../utils/cn';

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans antialiased relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
         <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-4xl shadow-2xl border border-red-50 mb-10 group relative">
           <div className="absolute inset-0 bg-red-600 rounded-4xl scale-0 group-hover:scale-100 transition-transform duration-500 opacity-10" />

           <ShieldAlert className="text-red-500 transform group-hover:rotate-12 transition-transform duration-500" size={48} />
           
           {/* Animated Pulse Ring */}
           <div className="absolute -inset-2 border-2 border-red-200 rounded-[2.5rem] animate-ping opacity-20" />
        </div>
        
        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none mb-6">
           Access <span className="text-red-600">Restricted</span>
        </h1>
        
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-8 rounded-[2.5rem] shadow-2xl mb-10">
           <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
              <Lock size={16} className="text-red-400" />
              Security Protocol Enabled
           </p>
           <p className="text-gray-600 font-medium leading-relaxed">
              This administrative module is reserved for system architects and managers. Your current authorization tier does not permit access to this sector.
           </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Link
             to="/sessions"
             className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black hover:-translate-y-1 transition-all active:scale-95"
           >
             <ArrowLeft size={18} />
             Back to My Sessions
           </Link>
           
           <Link
             to="/"
             className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 font-black rounded-2xl shadow-lg hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
           >
             <LayoutDashboard size={18} />
             Home
           </Link>
        </div>

        <p className="mt-12 text-gray-400 text-xs font-black uppercase tracking-[0.3em]">
           Platform Security Integrity Check: <span className="text-emerald-500">Verified</span>
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
