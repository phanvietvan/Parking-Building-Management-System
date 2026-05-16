import React, { useState } from 'react';
import {
  LayoutDashboard, CalendarDays, Map as MapIcon, BarChart3, Users, Settings,
  HelpCircle, LogOut, Search, UserPlus, Edit, Trash2, Shield,
  CheckCircle2, XCircle, Clock, MoreVertical, ChevronLeft, ChevronRight,
  X, Eye, Mail, Phone, Car, Calendar, MapPin, Save
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type User = {
  id: number; name: string; email: string; phone: string;
  role: string; status: string; lastActive: string; avatar: string;
  joinDate: string; vehicles: number; address: string; totalSessions: number;
};

const INITIAL_USERS: User[] = [
  { id: 1, name: 'Nguyen Van An', email: 'an.nv@parkintel.vn', phone: '0901 234 567', role: 'Super Admin', status: 'Active', lastActive: 'Vua xong', avatar: 'AN', joinDate: '01/01/2024', vehicles: 2, address: '123 Le Loi, Q1, TP.HCM', totalSessions: 148 },
  { id: 2, name: 'Tran Thi Binh', email: 'binh.tt@parkintel.vn', phone: '0912 345 678', role: 'Manager', status: 'Active', lastActive: '2 gio truoc', avatar: 'TB', joinDate: '15/03/2024', vehicles: 1, address: '45 Nguyen Hue, Q1, TP.HCM', totalSessions: 92 },
  { id: 3, name: 'Le Van Cuong', email: 'cuong.lv@parkintel.vn', phone: '0923 456 789', role: 'Staff', status: 'Inactive', lastActive: '2 ngay truoc', avatar: 'LC', joinDate: '20/06/2024', vehicles: 1, address: '78 Tran Hung Dao, Q5, TP.HCM', totalSessions: 34 },
  { id: 4, name: 'Pham Minh Duc', email: 'duc.pm@parkintel.vn', phone: '0934 567 890', role: 'Staff', status: 'Active', lastActive: '5 phut truoc', avatar: 'MD', joinDate: '10/09/2024', vehicles: 3, address: '12 Vo Van Tan, Q3, TP.HCM', totalSessions: 67 },
  { id: 5, name: 'Hoang Cong Hai', email: 'hai.hc@parkintel.vn', phone: '0945 678 901', role: 'Manager', status: 'Suspended', lastActive: '1 tuan truoc', avatar: 'HH', joinDate: '05/11/2024', vehicles: 2, address: '90 CMT8, Q10, TP.HCM', totalSessions: 21 },
];

const navLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Reservations', icon: CalendarDays, path: '/admin/reservations' },
  { name: 'Live Monitoring', icon: MapIcon, path: '/admin/monitoring' },
  { name: 'Reports', icon: BarChart3, path: '/admin/reports' },
  { name: 'User Management', icon: Users, path: '/admin/users', active: true },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

const statusStyle = (s: string) =>
  s === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
  s === 'Suspended' ? 'bg-red-50 text-red-600 border-red-100' :
  'bg-slate-50 text-slate-400 border-slate-200';

// ─── Edit Modal ────────────────────────────────────────────────────────────────
const EditModal = ({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (u: User) => void }) => {
  const [form, setForm] = useState({ ...user });
  const set = (k: keyof User, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">Chinh sua nguoi dung</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">ID #{user.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {([
            { label: 'Ho va ten', key: 'name', type: 'text', icon: Users },
            { label: 'Email', key: 'email', type: 'email', icon: Mail },
            { label: 'So dien thoai', key: 'phone', type: 'text', icon: Phone },
            { label: 'Dia chi', key: 'address', type: 'text', icon: MapPin },
          ] as { label: string; key: keyof User; type: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ label, key, type, icon: Icon }) => (
            <div key={key}>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type={type}
                  value={form[key] as string}
                  onChange={e => set(key, e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
                />
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vai tro</label>
              <select value={form.role} onChange={e => set('role', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20">
                {['Super Admin', 'Manager', 'Staff'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trang thai</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20">
                {['Active', 'Inactive', 'Suspended'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="px-8 py-5 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200">Huy</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <Save className="w-4 h-4" /> Luu thay doi
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ user, onClose }: { user: User; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-8 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"><X className="w-4 h-4 text-white" /></button>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl font-black">{user.avatar}</div>
          <div>
            <h3 className="text-xl font-black text-white">{user.name}</h3>
            <p className="text-blue-100 text-sm font-medium">{user.email}</p>
            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyle(user.status)}`}>{user.status}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-b border-slate-100">
        {[
          { label: 'Phien xe', value: user.totalSessions, icon: Car },
          { label: 'Phuong tien', value: user.vehicles, icon: Car },
          { label: 'Ngay tham gia', value: user.joinDate.split('/')[2], icon: Calendar },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center py-5 gap-1 border-r border-slate-100 last:border-r-0">
            <Icon className="w-4 h-4 text-slate-300 mb-1" />
            <span className="text-xl font-black text-slate-900">{value}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* Info rows */}
      <div className="px-8 py-6 space-y-4">
        {[
          { icon: Shield, label: 'Vai tro', value: user.role },
          { icon: Phone, label: 'So dien thoai', value: user.phone },
          { icon: MapPin, label: 'Dia chi', value: user.address },
          { icon: Calendar, label: 'Ngay tham gia', value: user.joinDate },
          { icon: Clock, label: 'Hoat dong cuoi', value: user.lastActive },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
              <Icon className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-8 pb-6">
        <button onClick={onClose} className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all">Dong</button>
      </div>
    </motion.div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  const handleSave = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Modals */}
      <AnimatePresence>
        {editUser && <EditModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSave} />}
        {detailUser && <DetailModal user={detailUser} onClose={() => setDetailUser(null)} />}
      </AnimatePresence>

      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-screen py-8 sticky left-0 top-0 bg-white border-r border-slate-200 w-[280px] z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="px-8 mb-10 group cursor-pointer">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 transition-transform group-hover:rotate-6">
              <span className="text-white font-black text-2xl">P</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tighter">ParkIntel</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Command Center</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1.5">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path}
              className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl transition-all duration-300 group ${link.active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              <link.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${link.active ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className={`text-sm ${link.active ? 'font-bold' : 'font-semibold'}`}>{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="px-4 mt-auto space-y-1">
          <Link to="#" className="flex items-center gap-3 px-5 py-3 text-slate-500 text-sm hover:text-blue-600 transition-colors font-bold group">
            <HelpCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-600" /><span>Help Center</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 px-5 py-3 text-red-500 text-sm hover:text-red-600 transition-colors font-bold group">
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600" /><span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-[#f8f9fb]">
        {/* Header */}
        <header className="flex justify-between items-center h-20 px-10 w-full sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center gap-4 bg-slate-100/80 px-4 py-2.5 rounded-2xl border border-slate-200 w-80 focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
            <Search className="text-slate-400 w-4 h-4" />
            <input className="bg-transparent border-none focus:ring-0 text-sm text-slate-900 w-full p-0 placeholder:text-slate-400" placeholder="Tim kiem nhan su..." type="text" />
          </div>
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <UserPlus className="w-4 h-4" /> Them Thanh vien
            </button>
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-200">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 overflow-hidden">
                <img alt="Admin" className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-0.5">Quan tri vien</p>
                <p className="text-xs font-bold text-slate-900 leading-none">Admin ParkIntel</p>
              </div>
              <Link to="/" className="ml-2 p-2 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-full transition-colors" title="Dang xuat">
                <LogOut size={16} />
              </Link>
            </div>
          </div>
        </header>

        <div className="p-10 space-y-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Quan ly Nguoi dung</h2>
            <p className="text-sm text-slate-500 font-medium">Phan quyen va quan ly tai khoan nhan vien toan he thong.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Tong nhan su', value: '24', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Hoat dong', value: String(users.filter(u => u.status === 'Active').length), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Yeu cau moi', value: '03', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Quan tri vien', value: String(users.filter(u => u.role.includes('Admin')).length), icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}><stat.icon className="w-6 h-6" /></div>
                  <MoreVertical className="text-slate-300 w-5 h-5 cursor-pointer hover:text-slate-900" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Danh sach Nhan su</h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-xs font-black bg-slate-50 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all">Bo loc</button>
                <button className="px-4 py-2 text-xs font-black bg-slate-50 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all">Xuat CSV</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nguoi dung</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai tro</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trang thai</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoat dong cuoi</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tac</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center font-black text-blue-600 text-xs">{user.avatar}</div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{user.name}</p>
                            <p className="text-[11px] font-bold text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 w-fit">
                          <Shield className={`w-3.5 h-3.5 ${user.role.includes('Admin') ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-[11px] font-bold text-slate-900">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyle(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[11px] font-bold text-slate-400">{user.lastActive}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* View Detail */}
                          <button
                            onClick={() => setDetailUser(user)}
                            title="Xem chi tiet"
                            className="p-2 hover:bg-blue-50 rounded-xl transition-colors text-slate-400 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => setEditUser(user)}
                            title="Chinh sua"
                            className="p-2 hover:bg-amber-50 rounded-xl transition-colors text-slate-400 hover:text-amber-500"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => setUsers(prev => prev.filter(u => u.id !== user.id))}
                            title="Xoa"
                            className="p-2 hover:bg-red-50 rounded-xl transition-colors text-slate-400 hover:text-red-500"
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
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">Hien thi {users.length} cua 24 nhan su</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-xs font-black bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Truoc
                </button>
                <button className="px-4 py-2 text-xs font-black bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
                  Sau <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
