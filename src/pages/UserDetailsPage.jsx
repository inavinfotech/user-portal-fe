import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Shield, 
  Calendar, 
  ArrowLeft,
  Loader2,
  Phone,
  Cpu
} from 'lucide-react';
import { cn } from '../utils/cn';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-bold">User not found</p>
        <button 
          onClick={() => navigate('/users')}
          className="mt-4 text-primary-600 font-bold hover:underline"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/users')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">User Profile Details</h2>
            <p className="text-gray-500 text-sm mt-1">Viewing information and associated addresses for {user.full_name}.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 text-2xl font-bold mb-4 border-2 border-white shadow-sm">
              {user.full_name?.[0]?.toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{user.full_name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1 font-medium mb-6">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>

            <div className="w-full space-y-3 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Status</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase",
                  user.is_active ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                )}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Joined</span>
                <span className="text-gray-900 font-bold">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Roles & Permissions</h4>
            <div className="flex flex-wrap gap-2">
              {user.roles?.map(role => (
                <div key={role.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                  <Shield size={14} />
                  <span className="text-xs font-bold uppercase">{role.name}</span>
                </div>
              ))}
              {(!user.roles || user.roles.length === 0) && (
                <p className="text-gray-400 text-xs italic">No roles assigned.</p>
              )}
            </div>
          </div>

          {/* Account Origin Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-amber-600" />
              Creation & API Origin
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Creation Source</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase",
                  user.creation_source === 'EXTERNAL_API' || user.created_by_app_id
                    ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                )}>
                  {user.creation_source === 'EXTERNAL_API' || user.created_by_app_id ? 'External API Key' : 'Portal Admin'}
                </span>
              </div>

              {user.created_by_app_name && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs">App Name</span>
                  <span className="text-gray-900 font-bold">{user.created_by_app_name}</span>
                </div>
              )}

              {user.created_by_app_id && (
                <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Application ID</span>
                  <code className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono text-gray-600 break-all select-all">
                    {user.created_by_app_id}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-[#F9FAFB] flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="text-primary-600" size={20} />
                Connected Addresses
              </h3>
            </div>
            
            <div className="p-6">
              {user.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((address) => (
                    <div key={address.id} className="p-6 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-primary-200 transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          <MapPin size={18} />
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{address.full_name}</h4>
                      <div className="space-y-1 text-sm text-gray-500 font-medium">
                        <p className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          {address.phone_number}
                        </p>
                        <p className="mt-2 leading-relaxed">
                          {address.address_line}<br />
                          {address.city}, {address.state} - {address.postal_code}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-3">
                    <MapPin size={24} />
                  </div>
                  <p className="text-gray-500 font-bold">No addresses found</p>
                  <p className="text-gray-400 text-sm mt-1">This user hasn't connected any addresses yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;

