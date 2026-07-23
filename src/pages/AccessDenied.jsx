import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, LayoutDashboard } from 'lucide-react';
import { cn } from '../utils/cn';

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-2xl border border-red-100 mb-6">
           <ShieldAlert size={32} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
           Access Restricted
        </h1>
        
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm mb-6 mt-4">
           <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <Lock size={14} className="text-red-500" />
              Insufficient Permissions
           </p>
           <p className="text-gray-600 text-sm leading-relaxed">
              Your current account role does not have permission to view or manage this section. Please contact a system administrator if you require access.
           </p>
        </div>

        <div className="flex items-center justify-center gap-3">
           <Link
             to="/"
             className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 active:scale-95 transition-all"
           >
             <LayoutDashboard size={18} />
             Go to Dashboard
           </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;

