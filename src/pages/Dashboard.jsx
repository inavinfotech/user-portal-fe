import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Key, 
  Activity, 
  TrendingUp, 
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { cn } from '../utils/cn';
import api from '../services/api';


const StatCard = ({ title, value, icon: Icon, color, trend }) => (

  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div className={cn(
        "p-3 rounded-2xl shadow-sm transition-transform group-hover:scale-110 duration-500",
        color
      )}>
        <Icon className="text-white" size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">
          <TrendingUp size={14} />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <p className="text-gray-500 text-sm font-bold tracking-wide uppercase opacity-70 mb-1">{title}</p>
    <div className="flex items-baseline justify-between">
      <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
      <button className="text-gray-400 hover:text-primary-600 transition-colors">
        <ArrowUpRight size={20} />
      </button>
    </div>
  </div>
);




const Dashboard = () => {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-10 py-2">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none mb-2">Dashboard Summary</h1>
          <p className="text-gray-500 font-medium">Overview of your systems health and user activity.</p>
        </div>
        {/* <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            Generate Report
          </button>
          <button className="px-5 py-2.5 bg-primary-600 text-sm font-bold text-white rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all">
            Manage Access
          </button>
        </div> */}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.total_users?.toLocaleString() || '0'} 
          icon={Users} 
          color="bg-primary-500 shadow-primary-500/20"
          trend="+0%"
        />
        <StatCard 
          title="Active Roles" 
          value={stats?.total_roles || '0'} 
          icon={ShieldCheck} 
          color="bg-emerald-500 shadow-emerald-500/20"
          trend="Stable"
        />
        <StatCard 
          title="App Integrations" 
          value={stats?.total_applications || '0'} 
          icon={Key} 
          color="bg-amber-500 shadow-amber-500/20"
          trend="+0%"
        />
        <StatCard 
          title="Active Sessions" 
          value={stats?.active_sessions || '0'} 
          icon={Activity} 
          color="bg-indigo-500 shadow-indigo-500/20"
          trend="+0%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <TrendingUp size={120} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <TrendingUp className="text-primary-600" size={24} />
                 User Growth Trends
             </h3>
             <div className="h-64 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Growth Charts Placeholder</p>
             </div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
             <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
             <div className="space-y-6">
                {stats?.recent_activity?.length > 0 ? (
                  stats.recent_activity.map(activity => (
                    <div key={activity.id} className="flex gap-4 items-start pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary-600 shrink-0">
                         <Activity size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-snug">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium italic">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic text-center py-4">No recent activity detected.</p>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
