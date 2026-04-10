import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  ShieldCheck, 
  MoreVertical,
  User as UserIcon,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { adminService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id) => {
    if (!window.confirm('Are you sure you want to promote this user to a Vendor?')) return;
    try {
      await adminService.promoteUser(id);
      setFeedback({ type: 'success', message: 'User successfully promoted to Vendor!' });
      fetchUsers();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Promotion failed.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('CRITICAL: This will permanently delete this user account. Proceed?')) return;
    try {
      await adminService.deleteUser(id);
      setFeedback({ type: 'success', message: 'User account permanently deleted.' });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      setFeedback({ type: 'error', message: 'Deletion failed.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Control platform user access and roles.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
              feedback.type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-gold-900/30 flex items-center justify-center text-primary-700 dark:text-primary-500 font-bold shrink-0">
                        {u.name[0]}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'admin' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                        : u.role === 'vendor' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {u.role === 'user' && (
                        <button 
                          onClick={() => handlePromote(u._id)}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
                          title="Promote to Vendor"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(u._id)}
                        disabled={u.role === 'admin'}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <UserIcon className="w-12 h-12 text-slate-200 dark:text-slate-700 dark:text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No users match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
