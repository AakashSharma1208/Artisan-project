import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingBag,
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { adminService } from '../../services/api';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-500">
      <TrendingUp className="w-3 h-3" />
      <span>+12.5%</span>
      <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 ml-1">from last month</span>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Stats fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  const statItems = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Vendors', value: stats?.totalVendors || 0, icon: Store, color: 'bg-purple-500' },
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-primary-500' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Platform Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening on Artisan today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, i) => (
          <StatCard key={item.title} {...item} delay={i * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Recent System Events
            </h3>
            <button className="text-sm font-medium text-primary-700 dark:text-primary-500 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-default group">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary-500" />
                <div>
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">New user registered: Artisan #{i * 423}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{i}h ago • System Log</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Admin Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-900 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-left">
              <Users className="w-5 h-5 text-blue-500 mb-3" />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Review Users</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage platform accounts</p>
            </button>
            <button className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-900 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-left">
              <Store className="w-5 h-5 text-purple-500 mb-3" />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Vendor Queue</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Approve new sellers</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
