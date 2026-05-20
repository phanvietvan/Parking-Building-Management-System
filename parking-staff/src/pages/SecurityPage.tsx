import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Video, 
  Terminal, 
  AlertTriangle, 
  Volume2, 
  PowerOff, 
  ShieldCheck, 
  Activity, 
  Lock 
} from 'lucide-react';
import StaffLayout from '../components/layout/StaffLayout';

const SecurityPage = () => {
  const [secLogs] = useState([
    { time: '14:20:11', event: 'Barrier Cổng A1 được mở thủ công', origin: 'M. Hùng', status: 'WARN' },
    { time: '14:15:45', event: 'Phát hiện chuyển động khu vực tủ điện tầng hầm D', origin: 'CAM-04', status: 'INFO' },
    { time: '13:58:02', event: 'Khởi chạy quét chẩn đoán hệ thống bảo mật định kỳ', origin: 'System', status: 'OK' },
    { time: '13:42:10', event: 'Cảnh báo: Thiết bị quét thẻ cổng B2 mất kết nối 3s', origin: 'GATE-B2', status: 'WARN' },
  ]);

  const [emergencyActive, setEmergencyActive] = useState(false);
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerEmergency = () => {
    setEmergencyActive(!emergencyActive);
  };

  const cctvs = [
    { id: 'CAM-01', label: 'Cổng vào chính A1', status: 'LIVE' },
    { id: 'CAM-02', label: 'Cổng ra phụ B2', status: 'LIVE' },
    { id: 'CAM-03', label: 'Sân đỗ tầng trệt Zone A', status: 'LIVE' },
    { id: 'CAM-04', label: 'Khu vực kỹ thuật Hầm D', status: 'LIVE' },
  ];

  return (
    <StaffLayout>
      <div className="grid grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: CCTV Grid */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-[32px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xs font-bold tracking-premium text-on-surface-variant uppercase mb-1">Màn hình giám sát</h3>
                <h2 className="text-2xl font-black text-on-surface tracking-tight flex items-center gap-3">
                  <Video size={24} className="text-primary" /> Kênh Camera An Ninh
                </h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">{timeStr}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cctvs.map((cam, i) => (
                <div key={i} className="relative aspect-video rounded-2xl bg-slate-950 border border-white/5 overflow-hidden group shadow-lg">
                  {/* Camera visual simulation */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />
                  
                  {/* Scanline Animation */}
                  <motion.div 
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 w-full h-[2px] bg-emerald-500/10 pointer-events-none z-10 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  />

                  {/* Dark overlay showing active CCTV status */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black text-white/90 bg-black/40 px-2 py-1 rounded border border-white/10 uppercase tracking-widest">
                        {cam.id}
                      </span>
                      <div className="flex items-center gap-1.5 bg-red-600/80 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {cam.status}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-wider">{cam.label}</p>
                      <p className="text-[8px] text-white/60 font-medium uppercase mt-0.5">FPS: 30 • Bitrate: 4.8 Mbps</p>
                    </div>
                  </div>

                  {/* Grid or background placeholder of camera */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-0">
                    <Video size={48} className="text-white/5 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Logs */}
          <div className="glass-panel p-8 rounded-[32px] flex flex-col">
            <h3 className="text-xs font-bold tracking-premium text-on-surface-variant uppercase mb-6 flex items-center gap-3">
              <Terminal size={16} className="text-primary" /> Nhật ký an ninh thời gian thực
            </h3>

            <div className="space-y-3">
              {secLogs.map((log, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-primary/[0.01] border border-primary/[0.03] hover:border-primary/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      log.status === 'OK' ? 'bg-emerald-500' :
                      log.status === 'WARN' ? 'bg-amber-500' :
                      'bg-error'
                    }`} />
                    <div>
                      <span className="text-[10px] font-bold text-on-surface">{log.event}</span>
                      <span className="text-[8px] font-bold text-on-surface-variant/60 uppercase tracking-widest ml-3">Nguồn: {log.origin}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-on-surface-variant">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Emergency controls */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className={`glass-panel p-8 rounded-[32px] flex flex-col transition-all duration-500 border ${
            emergencyActive ? 'bg-red-500/10 border-red-500/30' : 'border-primary/5'
          }`}>
            <h3 className="text-xs font-bold tracking-premium text-on-surface-variant uppercase mb-6 flex items-center gap-3">
              <ShieldAlert size={16} className="text-primary" /> Trung tâm phản ứng khẩn cấp
            </h3>

            <div className="space-y-4">
              <button 
                onClick={triggerEmergency}
                className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all duration-300 font-bold tracking-premium text-xs uppercase ${
                  emergencyActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={emergencyActive ? 'animate-bounce' : ''} size={18} />
                  <span>{emergencyActive ? 'Báo động đang bật!' : 'Báo động toàn hệ thống'}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-black/10 uppercase">SOS</span>
              </button>

              <button className="w-full p-5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/20 transition-all font-bold tracking-premium text-xs uppercase flex items-center gap-3">
                <Volume2 size={18} />
                <span>Phát loa thông báo</span>
              </button>

              <button className="w-full p-5 rounded-2xl bg-error/10 hover:bg-error/20 text-error border border-error/20 transition-all font-bold tracking-premium text-xs uppercase flex items-center gap-3">
                <PowerOff size={18} />
                <span>Khóa toàn bộ Barrier</span>
              </button>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[32px] flex flex-col gap-4">
            <h3 className="text-xs font-bold tracking-premium text-on-surface-variant uppercase">Trạng thái bảo mật</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Hệ thống báo cháy</span>
                </div>
                <span className="text-[9px] font-black text-emerald-500 tracking-widest px-2 py-1 bg-emerald-500/5 rounded-lg">ĐANG KẾT NỐI</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Activity size={16} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Cảm biến cổng phụ</span>
                </div>
                <span className="text-[9px] font-black text-primary tracking-widest px-2 py-1 bg-primary/5 rounded-lg">ỔN ĐỊNH</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Lock size={16} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Khóa từ tủ rack</span>
                </div>
                <span className="text-[9px] font-black text-primary tracking-widest px-2 py-1 bg-primary/5 rounded-lg">ĐÃ KHÓA</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </StaffLayout>
  );
};

export default SecurityPage;
