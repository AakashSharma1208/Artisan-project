import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Vendors', path: '/admin/vendors', icon: Store },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <span className="font-poppins font-black text-xl gradient-text">Artisan Admin</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.path === '/admin' && <span className="ml-auto" />}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Profile */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-gold-900/30 flex items-center justify-center text-primary-700 dark:text-primary-500 font-bold">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : ''}`}>
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-600 dark:text-slate-400">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="ml-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="font-poppins font-bold text-lg gradient-text">Artisan</span>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
