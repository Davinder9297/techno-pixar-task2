import React, { useMemo, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCircle, 
  Users, 
  LogOut, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ onLogout }) => {
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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2.5 px-1">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/10">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">TechnoAuth</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
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
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-semibold"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
});

export default Sidebar;
