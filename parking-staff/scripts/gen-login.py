from pathlib import Path

d = "motionless".replace("motionless", "div")

content = f'''import {{ useEffect, useState }} from 'react';
import {{ useLocation, useNavigate }} from 'react-router-dom';
import {{ AlertCircle }} from 'lucide-react';
import api from '../services/api';
import BrandLogo from '../components/brand/BrandLogo';
import {{ canAccessStaffApp, getStaffUser, saveStaffSession }} from '../utils/auth';

const LoginPage = () => {{
  const navigate = useNavigate();
  const location = useLocation();
  const stateError = (location.state as {{ error?: string }} | null)?.error;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(stateError ?? '');

  useEffect(() => {{
    const token = localStorage.getItem('staff_token');
    if (token && canAccessStaffApp(getStaffUser())) {{
      navigate('/', {{ replace: true }});
    }}
  }}, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {{
    e.preventDefault();
    setLoading(true);
    setError('');

    try {{
      const response = await api.post('/auth/login', {{
        emailOrUsername: email.trim(),
        password,
      }});

      const body = response.data;
      if (!body.success || !body.data) {{
        setError(body.message || 'Đăng nhập thất bại.');
        return;
      }}

      const {{ accessToken, user }} = body.data;

      if (!canAccessStaffApp(user)) {{
        setError('Tài khoản User không có quyền vào cổng Staff. Cần vai trò Staff hoặc Admin.');
        return;
      }}

      saveStaffSession(accessToken, user);
      navigate('/', {{ replace: true }});
    }} catch (err: unknown) {{
      const ax = err as {{ response?: {{ data?: {{ message?: string; errors?: string[] }} }} }};
      setError(
        ax.response?.data?.message ||
          ax.response?.data?.errors?.[0] ||
          'Đăng nhập thất bại. Kiểm tra email và mật khẩu.'
      );
    }} finally {{
      setLoading(false);
    }}
  }};

  return (
    <main className="flex min-h-screen w-full relative overflow-hidden bg-mesh-gradient font-sans antialiased text-on-surface">
      <{d} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></{d}>
      <{d} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-container/20 blur-[150px] rounded-full pointer-events-none"></{d}>

      <section className="hidden lg:flex flex-col justify-between w-[55%] p-20 relative z-10">
        <BrandLogo size="lg" showTagline tagline="Staff Terminal" />

        <{d} className="max-w-2xl opacity-0 animate-fade-in-up" style={{{{ animationDelay: '0.2s' }}}}>
          <h2 className="text-[72px] font-display font-extrabold leading-[1.05] tracking-tight mb-8 text-on-surface drop-shadow-sm">
            Cổng vận hành<br />
            <span className="text-primary">bãi xe thông minh.</span>
          </h2>
          <p className="text-on-surface-variant text-xl leading-relaxed max-w-lg font-medium">
            Terminal nhân viên — quét biển số, điều khiển ra/vào và giám sát luồng xe tại cổng trong thời gian thực.
          </p>
        </{d}>

        <{d} className="flex items-center space-x-16 opacity-0 animate-fade-in-up" style={{{{ animationDelay: '0.4s' }}}}>
          <{d} className="flex flex-col">
            <span className="text-5xl font-display font-extrabold text-on-surface tracking-tight mb-2">24<span className="text-primary/60 text-3xl">/7</span></span>
            <span className="text-outline text-[10px] uppercase tracking-[0.2em] font-bold">Giám sát cổng</span>
          </{d}>
          <{d} className="flex flex-col border-l border-primary/10 pl-12">
            <span className="text-5xl font-display font-extrabold text-on-surface tracking-tight mb-2">2<span className="text-primary/60 text-3xl">s</span></span>
            <span className="text-outline text-[10px] uppercase tracking-[0.2em] font-bold">Xác thực biển số</span>
          </{d}>
          <{d} className="flex flex-col border-l border-primary/10 pl-12">
            <span className="text-5xl font-display font-extrabold text-primary tracking-tight mb-2">QR</span>
            <span className="text-outline text-[10px] uppercase tracking-[0.2em] font-bold">Quét tự động</span>
          </{d}>
        </{d}>

        <{d} className="absolute bottom-40 right-20 glass-panel glow-border p-5 rounded-2xl flex items-center space-x-5 animate-float opacity-0 animate-fade-in-up" style={{{{ animationDelay: '0.6s' }}}}>
          <{d} className="relative">
            <{d} className="w-12 h-12 rounded-full border-4 border-primary/5 flex items-center justify-center">
              <{d} className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,80,203,0.3)]"></{d}>
            </{d}>
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
              <path className="text-primary-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="71, 100" strokeWidth="2.5" />
            </svg>
          </{d}>
          <{d}>
            <p className="text-[9px] text-outline uppercase tracking-[0.25em] font-black">Cổng đang hoạt động</p>
            <p className="text-xl font-display font-extrabold text-on-surface tracking-tighter">Khu vực A1</p>
          </{d}>
        </{d}>
      </section>

      <section className="flex flex-col items-center justify-center w-full lg:w-[45%] p-8 md:p-16 relative z-20">
        <{d} className="w-full max-w-[460px] glass-panel p-10 md:p-12 rounded-[2.5rem] glow-border">
          <{d} className="mb-10 text-center">
            <h2 className="text-4xl font-display font-extrabold text-on-surface tracking-tight mb-3">Đăng nhập nhân viên</h2>
            <p className="text-on-surface-variant font-medium">
              Chỉ dành cho tài khoản <span className="text-primary font-bold">Staff</span> hoặc{' '}
              <span className="text-primary font-bold">Admin</span>
            </p>
          </{d}>

          <form onSubmit={{handleSubmit}} className="space-y-7">
            <{d} className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70 ml-1" htmlFor="staff-email">
                Email or Username
              </label>
              <{d} className="relative group">
                <{d} className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </{d}>
                <input
                  className="premium-input block w-full pl-12 pr-4 py-3 rounded-full border border-outline-variant focus:outline-none transition-all text-sm font-medium"
                  id="staff-email"
                  type="text"
                  placeholder="Enter your email or username"
                  value={{email}}
                  onChange={{(e) => setEmail(e.target.value)}}
                  autoComplete="username"
                  required
                />
              </{d}>
            </{d}>

            <{d} className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70 ml-1" htmlFor="staff-password">
                Password
              </label>
              <{d} className="relative group">
                <{d} className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </{d}>
                <input
                  className="premium-input block w-full pl-12 pr-4 py-3 rounded-full border border-outline-variant focus:outline-none transition-all text-sm font-medium"
                  id="staff-password"
                  type="password"
                  placeholder="••••••••"
                  value={{password}}
                  onChange={{(e) => setPassword(e.target.value)}}
                  autoComplete="current-password"
                  required
                />
              </{d}>
            </{d}>

            {{error && (
              <{d} className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                <AlertCircle className="text-red-500 shrink-0" size={{18}} />
                <p className="text-xs font-bold text-red-600">{{error}}</p>
              </{d}>
            )}}

            <button
              className={{`group relative overflow-hidden w-full py-3 bg-primary hover:bg-primary-container text-white font-semibold rounded-full transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5 active:scale-[0.98] text-sm ${{loading ? 'opacity-80 cursor-wait' : ''}}`}}
              type="submit"
              disabled={{loading}}
            >
              <span className="relative z-10">{{loading ? 'ĐANG XỬ LÝ...' : 'Vào bãi điều khiển'}}</span>
              <{d} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite] pointer-events-none"></{d}>
            </button>
          </form>
        </{d}>

        <BrandLogo size="xs" className="lg:hidden mt-12 opacity-60" showTagline tagline="Staff Terminal" />
      </section>
    </main>
  );
}};

export default LoginPage;
'''

out = Path(__file__).resolve().parents[1] / "src" / "pages" / "LoginPage.tsx"
out.write_text(content, encoding="utf-8")
print("wrote", out)
