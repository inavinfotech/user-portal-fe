import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, Layers } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const errorData = err.response?.data?.detail;
      if (typeof errorData === 'string') {

        setError(errorData);
      } else if (Array.isArray(errorData)) {
        setError(errorData[0]?.msg || 'Validation error occurred');
      } else if (typeof errorData === 'object' && errorData !== null) {
        setError(errorData.msg || JSON.stringify(errorData));
      } else {
        setError('Invalid email or password');
      }
    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl shadow-lg shadow-primary-500/20 mb-6">
           <Layers className="text-white" size={28} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          User Management Portal
        </h2>
        <p className="text-gray-500 font-medium text-sm mt-2">
          Enter your credentials to access portal management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-8 border border-gray-100 shadow-xl rounded-3xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-red-600 font-bold text-xs">!</span>
                </div>
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 font-medium text-sm text-gray-900"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-6 rounded-xl shadow-lg shadow-primary-500/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 disabled:opacity-50 transition-all mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin -ml-1 mr-2" size={18} />
              ) : null}
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
