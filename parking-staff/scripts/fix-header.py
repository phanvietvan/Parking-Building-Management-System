from pathlib import Path

d = "div"
p = Path(__file__).resolve().parents[1] / "src" / "pages" / "StaffDashboard.tsx"
t = p.read_text(encoding="utf-8")
old = f"""          <{d} className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tighter text-on-surface">AETHER<span className="text-primary font-light">_OS</span></span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded uppercase tracking-widest">v2.5</span>
          </{d}>"""
new = f"""          <{d} className="flex items-center gap-3">
            <BrandLogo size="sm" showTagline tagline="Staff Terminal" />
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded uppercase tracking-widest hidden sm:inline">Staff</span>
          </{d}>"""
if old not in t:
    raise SystemExit("pattern not found")
p.write_text(t.replace(old, new), encoding="utf-8")
print("header updated")
