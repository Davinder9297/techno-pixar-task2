import React, { useMemo, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCircle, 
  Users, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ onLogout, isOpen, onClose }) => {
  const { user } = useAuth();

  const menuItems = useMemo(() => {
    return user?.role === 'Admin' 
      ? [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard/overview' },
          { id: 'profile', label: 'My Profile', icon: UserCircle, path: '/dashboard/profile' },
          { id: 'users', label: 'User Management', icon: Users, path: '/dashboard/users' },
        ]
      : [
          { id: 'profile', label: 'My Profile', icon: UserCircle, path: '/dashboard/profile' },
        ];
  }, [user?.role]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-[110]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 px-1">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/10">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">TechnoAuth</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'group-hover:text-slate-200'}`} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/70" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-sm border border-slate-700">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold truncate uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-semibold"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
});

export default Sidebar;
