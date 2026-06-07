import React, { useState, useCallback, useMemo } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Mail,
  Calendar,
  Loader2
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import Sidebar from '../components/Sidebar';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useUsers, useToggleUserStatus } from '../hooks/useUserQueries';
import type { User } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;
  
  const debouncedSearch = useDebounce(search, 500);

  // TanStack Query Hooks
  const queryParams = useMemo(() => ({
    search: debouncedSearch,
    status: statusFilter,
    page,
    limit
  }), [debouncedSearch, statusFilter, page, limit]);

  const { data: usersData, isLoading: loading } = useUsers(user?.role === 'Admin' ? queryParams : null);
  const { mutate: toggleStatus } = useToggleUserStatus();

  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;

  // Modal States
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [statusToggleModal, setStatusToggleModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null
  });

  const handleToggleStatus = useCallback(async () => {
    const targetUser = statusToggleModal.user;
    if (!targetUser) return;
    
    const id = targetUser.id || targetUser._id;
    if (id) {
      toggleStatus(id);
    }
  }, [statusToggleModal.user, toggleStatus]);

  const dashboardContent = useMemo(() => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-105 transition-transform">
            <Users className="h-12 w-12 text-blue-500" />
          </div>
          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Total Users</p>
          <h3 className="text-3xl font-bold text-white">{totalUsers}</h3>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-105 transition-transform">
            <UserCheck className="h-12 w-12 text-emerald-500" />
          </div>
          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Active Users</p>
          <h3 className="text-3xl font-bold text-white">
            {users.filter(u => u.isActive).length}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-105 transition-transform">
            <UserX className="h-12 w-12 text-red-500" />
          </div>
          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Inactive Users</p>
          <h3 className="text-3xl font-bold text-white">
            {users.filter(u => !u.isActive).length}
          </h3>
        </div>
      </div>
    </div>
  ), [totalUsers, users]);

  const userManagementContent = useMemo(() => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">User Directory</h2>
            <p className="text-slate-400 text-sm font-medium">Manage and monitor platform users</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-700 text-white text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-56 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <select
              className="px-3 py-2 bg-slate-800/50 border border-slate-700 text-white text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-medium transition-all"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/30 text-slate-400 font-semibold uppercase tracking-widest text-[9px]">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <LoadingSpinner size={32} message="Syncing directory..." />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm font-semibold">
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id || u._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-sm border border-slate-700 shadow group-hover:scale-105 transition-transform">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{u.name}</p>
                          <p className="text-slate-400 text-xs font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase ${
                        u.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                        <span className={`text-xs font-semibold ${u.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setStatusToggleModal({ isOpen: true, user: u })}
                        disabled={(u.id || u._id) === user?.id}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all active:scale-[0.95] disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale ${
                          u.isActive 
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/10' 
                            : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-lg shadow-emerald-500/10'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-800/20 border-t border-slate-800 flex items-center justify-between">
          <p className="text-slate-400 text-xs font-semibold">
            Showing <span className="text-white">{Math.min(limit, users.length)}</span> of <span className="text-white">{totalUsers}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-white disabled:opacity-30 transition-all hover:bg-slate-700 active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-white text-sm font-bold px-2">Page {page}</span>
            <button
              disabled={page * limit >= totalUsers}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-white disabled:opacity-30 transition-all hover:bg-slate-700 active:scale-90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  ), [loading, users, search, statusFilter, page, totalUsers]);

  const profileContent = useMemo(() => (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="h-24 w-24 rounded-2xl bg-slate-900 p-1.5 shadow-xl border-2 border-slate-900">
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-3xl font-bold text-white shadow-inner border border-slate-700">
                {user?.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8 text-center space-y-3">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className={`px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                user?.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {user?.role} Account
              </span>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 group hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Email Address</p>
              </div>
              <p className="text-white text-sm font-semibold truncate">{user?.email}</p>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 group hover:border-purple-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-1.5 bg-purple-500/10 rounded-lg">
                  <Shield className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Account Role</p>
              </div>
              <p className="text-white text-sm font-semibold">{user?.role}</p>
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <Calendar className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Account Status</p>
                <p className="text-white text-sm font-semibold">Active and Verified</p>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          </div>
        </div>
      </div>
    </div>
  ), [user]);

  const getTitle = useCallback(() => {
    if (pathname.includes('overview')) return 'Overview';
    if (pathname.includes('profile')) return 'My Profile';
    if (pathname.includes('users')) return 'User Management';
    return 'Dashboard';
  }, [pathname]);

  const handleOpenLogoutModal = useCallback(() => setIsLogoutModalOpen(true), []);
  const handleCloseLogoutModal = useCallback(() => setIsLogoutModalOpen(false), []);
  const handleCloseStatusToggleModal = useCallback(() => setStatusToggleModal({ isOpen: false, user: null }), []);

  if (pathname === '/dashboard/users' && user?.role !== 'Admin') {
    return <Navigate to="/dashboard/profile" replace />;
  }

  if (pathname === '/dashboard/overview' && user?.role !== 'Admin') {
    return <Navigate to="/dashboard/profile" replace />;
  }

  return (
    <div className="min-h-screen bg-[#020617] flex">
      <Sidebar onLogout={handleOpenLogoutModal} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{getTitle()}</h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">Welcome back, {user?.name.split(' ')[0]}</p>
          </div>
        </header>

        {pathname.includes('overview') && dashboardContent}
        {pathname.includes('profile') && profileContent}
        {pathname.includes('users') && userManagementContent}

        {/* Modals */}
        <ConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={handleCloseLogoutModal}
          onConfirm={logout}
          title="Sign Out"
          message="Are you sure you want to log out of your professional dashboard? You will need to sign in again to access your data."
          confirmText="Sign Out"
          type="danger"
        />

        <ConfirmationModal
          isOpen={statusToggleModal.isOpen}
          onClose={handleCloseStatusToggleModal}
          onConfirm={handleToggleStatus}
          title={`${statusToggleModal.user?.isActive ? 'Deactivate' : 'Activate'} User`}
          message={`Are you sure you want to ${statusToggleModal.user?.isActive ? 'deactivate' : 'activate'} ${statusToggleModal.user?.name}'s account? This action will take effect immediately.`}
          confirmText={statusToggleModal.user?.isActive ? 'Deactivate' : 'Activate'}
          type={statusToggleModal.user?.isActive ? 'danger' : 'info'}
        />
      </main>
    </div>
  );
};

export default Dashboard;
