import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Bell, Search, ShieldCheck } from 'lucide-react';
import BrandLogo from '../brand/BrandLogo';
import { clearStaffSession, getStaffDisplayName, getStaffUser } from '../../utils/auth';
import md5 from 'md5';

interface StaffLayoutProps {
  children: React.ReactNode;
}

export const STAFF_NAV = [
  { name: 'Điều khiển', path: '/' },
  { name: 'Hậu cần', path: '/logistics' },
  { name: 'An ninh', path: '/security' },
];

const StaffLayout = ({ children }: StaffLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const staffUser = getStaffUser();
  const staffName = getStaffDisplayName(staffUser);
  const staffRole =
    staffUser?.role === 'Admin' || staffUser?.role === 2 || staffUser?.role === '2'
      ? 'Quản trị'
      : 'Nhân viên';

  const handleLogout = () => {
    clearStaffSession();
    navigate('/login', { replace: true });
  };

  const staffEmail = staffUser?.email || '';
  const avatarUrl = staffEmail 
    ? `https://www.gravatar.com/avatar/${md5(staffEmail.trim().toLowerCase())}?d=identicon` 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(staffName)}&background=random`;

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen selection:bg-primary/10 overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full h-16 glass-panel-heavy border-b border-primary/5 z-50 px-12 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showTagline tagline="Staff Terminal" />
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded uppercase tracking-widest hidden sm:inline">Staff</span>
          </div>
          <nav className="hidden xl:flex gap-8 items-center h-full">
            {STAFF_NAV.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-bold text-[11px] tracking-premium uppercase h-16 flex items-center border-b-2 transition-all duration-300 ${
                    isActive
                      ? 'text-primary border-primary'
                      : 'text-on-surface-variant hover:text-primary border-transparent hover:border-primary/30'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,88,188,0.4)]"></span>
            <span className="text-[10px] tracking-widest text-primary font-bold uppercase">Khu vực A1 • Đang hoạt động</span>
          </div>
          <div className="flex items-center gap-1 border-l border-outline/10 pl-6">
            <button className="text-on-surface-variant hover:text-primary p-2 flex items-center">
              <Search size={18} />
            </button>
            <button className="text-on-surface-variant hover:text-primary p-2 relative flex items-center">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-error rounded-full"></span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-on-surface-variant hover:text-error p-2 flex items-center"
              title="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          </div>
          <div className="flex items-center gap-4 pl-6 border-l border-outline/10">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold tracking-premium text-on-surface uppercase leading-none mb-0.5">{staffName}</p>
              <p className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wider">{staffRole}</p>
            </div>
            <div className="w-9 h-9 rounded-full border border-primary/20 p-0.5 bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
              <img 
                alt={staffName} 
                className="w-full h-full rounded-full object-cover" 
                src={avatarUrl}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-12 min-h-screen max-w-[1920px] mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full glass-panel-heavy border-t border-primary/5 px-12 h-10 flex justify-between items-center z-50">
        <span className="text-[9px] tracking-premium text-on-surface-variant/40 uppercase font-black">© 2024 NEXUS GLOBAL TERMINAL • V2.5.81</span>
        <div className="flex gap-10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
            <span className="text-[9px] tracking-premium text-on-surface-variant/60 uppercase font-bold">Độ trễ: 0.8ms</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary" size={14} />
            <span className="text-[9px] tracking-premium text-primary font-bold uppercase">Đã mã hóa</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StaffLayout;
