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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/30 mb-8 animate-bounce-subtle">
           <Layers className="text-white" size={32} />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none mb-3">
          Welcome Back
        </h2>
        <p className="text-gray-500 font-medium tracking-wide">
          Enter your credentials to access the portal
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 border border-gray-100 shadow-2xl rounded-3xl backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-red-600 font-bold">!</span>
                </div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-gray-900 font-medium placeholder-gray-400 transition-all duration-200 outline-none"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-gray-900 font-medium placeholder-gray-400 transition-all duration-200 outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-xl text-md font-bold text-white bg-primary-600 hover:bg-primary-700 hover:shadow-primary-500/40 focus:outline-none focus:ring-4 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin -ml-1 mr-2" size={20} />
              ) : null}
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Forgot your password?{' '}
          <a href="#" className="font-bold text-primary-600 hover:text-primary-500 transition-colors underline decoration-2 underline-offset-4">
            Reset it here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
