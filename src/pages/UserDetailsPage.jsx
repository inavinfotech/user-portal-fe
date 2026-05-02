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
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/users')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">User Details</h1>
            <p className="text-gray-500 text-sm font-medium">Viewing details and connected addresses for {user.full_name}.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-extrabold mb-4 border-4 border-white shadow-lg">
              {user.full_name?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1 font-medium italic mb-6">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>

            <div className="w-full space-y-4 pt-6 border-t border-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Status</span>
                <span className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider",
                  user.is_active ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                )}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Joined</span>
                <span className="text-gray-900 font-bold">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Roles & Permissions</h3>
            <div className="flex flex-wrap gap-2">
              {user.roles?.map(role => (
                <div key={role.id} className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-xl border border-primary-100">
                  <Shield size={14} />
                  <span className="text-xs font-extrabold uppercase tracking-wider">{role.name}</span>
                </div>
              ))}
              {(!user.roles || user.roles.length === 0) && (
                <p className="text-gray-400 text-xs italic">No roles assigned.</p>
              )}
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <MapPin className="text-primary-600" size={20} />
                Connected Addresses
              </h3>
            </div>
            
            <div className="p-6">
              {user.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((address) => (
                    <div key={address.id} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-primary-200 hover:bg-primary-50/20 transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          <MapPin size={18} />
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{address.full_name}</h4>
                      <div className="space-y-2 text-sm text-gray-500 font-medium">
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
                <div className="text-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                    <MapPin size={24} />
                  </div>
                  <p className="text-gray-500 font-bold">No addresses found</p>
                  <p className="text-gray-400 text-sm">This user hasn't connected any addresses yet.</p>
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
