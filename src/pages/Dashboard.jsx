import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Key, 
  Activity, 
  TrendingUp, 
  Loader2
} from 'lucide-react';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center ${iconColor}`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-gray-500 mt-2 font-medium">Real-time user portal metrics and system status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.total_users?.toLocaleString() || '0'} 
          icon={Users} 
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
        />
        <StatCard 
          title="Active Roles" 
          value={stats?.total_roles || '0'} 
          icon={ShieldCheck} 
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard 
          title="App Integrations" 
          value={stats?.total_applications || '0'} 
          icon={Key} 
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard 
          title="Active Sessions" 
          value={stats?.active_sessions || '0'} 
          icon={Activity} 
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800 font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-600" />
              User Growth Trends
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200 p-8">
            <p className="text-gray-400 font-medium italic text-sm">Growth metrics and analytics visualization.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-gray-800 font-bold mb-6 flex items-center gap-2">
            <Activity size={18} className="text-primary-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {stats?.recent_activity?.length > 0 ? (
              stats.recent_activity.map(activity => (
                <div key={activity.id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary-600 shrink-0">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium italic">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic text-center py-6">No recent activity detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

