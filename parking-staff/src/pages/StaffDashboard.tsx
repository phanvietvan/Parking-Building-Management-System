import { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  ExternalLink, 
  FileText, 
  Activity, 
  Lock, 
  QrCode, 
  Keyboard, 
  CheckCircle2, 
  LogOut, 
  ShieldCheck, 
  Radio, 
  Camera, 
  RefreshCw, 
  Zap,
  AlertTriangle,
  Printer,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StaffLayout from '../components/layout/StaffLayout';
import api from '../services/api';
import jsQR from 'jsqr';
import Tesseract from 'tesseract.js';

const StaffDashboard = () => {
  const [mode, setMode] = useState<'checkin' | 'checkout'>('checkin');
  const [isScanning, setIsScanning] = useState(true);
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check-in states
  const [inputPlate, setInputPlate] = useState('');
  const [ocrDebugText, setOcrDebugText] = useState('');
  const inputPlateRef = useRef('');
  useEffect(() => {
    inputPlateRef.current = inputPlate;
  }, [inputPlate]);
  const [currentSession, setCurrentSession] = useState<any>(null);

  // Check-out states
  const [manualQrCode, setManualQrCode] = useState('');
  const [verifySession, setVerifySession] = useState<any>(null);
  const [exitPlate, setExitPlate] = useState('');
  const [exitPhoto, setExitPhoto] = useState<string | null>(null);

  // Global states
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  const [totalCapacity, setTotalCapacity] = useState({ current: 142, max: 200 });

  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (navigator.mediaDevices) {
        await startCamera();
      }
    };
    init();
    fetchRecentLogs();

    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    stopCamera();
    
    const constraints = [
      { video: { facingMode: 'user' } },
      { video: { facingMode: 'environment' } },
      { video: true }
    ];

    for (const constraint of constraints) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraint);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setHasCameraAccess(true);
          return;
        }
      } catch (err) {
        console.warn(`Failed constraint:`, constraint, err);
      }
    }
    
    setHasCameraAccess(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Fetch recent logs from database
  const fetchRecentLogs = async () => {
    try {
      const response = await api.get('/parkingsessions');
      const formatted = response.data.map((item: any) => ({
        plate: item.licensePlate,
        status: item.status === 'Active' ? 'Đang gửi' : (item.isPlateMatched ? 'Xe ra (Hợp lệ)' : 'Xe ra (Cảnh báo)'),
        time: new Date(item.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: item.status === 'Active' ? 'ENTRY' : 'EXIT',
        qrCode: item.qrCode
      }));
      setRecentLogs(formatted);

      // Update capacity dynamically
      const activeCount = response.data.filter((x: any) => x.status === 'Active').length;
      setTotalCapacity({ current: activeCount + 130, max: 200 }); // mock base count
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  // Capture photo from webcam stream
  const capturePhoto = (): string => {
    if (videoRef.current && streamRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror the canvas capture to match the mirrored display video
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8);
      }
    }
    
    // Unsplash mock vehicle fallback images
    const mockCarImages = [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=80"
    ];
    const randomIndex = Math.floor(Math.random() * mockCarImages.length);
    return mockCarImages[randomIndex];
  };

  // Handle vehicle check-in (Generate QR & save entry details)
  const handleCheckIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPlate.trim()) {
      setErrorMsg("Vui lòng nhập biển số xe!");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const photo = capturePhoto();
      const response = await api.post('/parkingsessions/checkin', {
        licensePlate: inputPlate.trim().toUpperCase(),
        entryPhoto: photo
      });
      
      setCurrentSession(response.data);
      setInputPlate("");
      setSuccessMsg("Đã khởi tạo thẻ xe QR!");
      fetchRecentLogs();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Lỗi lưu dữ liệu vào database.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verifying the QR code
  const handleVerify = async (code: string) => {
    if (!code.trim()) {
      setErrorMsg("Vui lòng nhập mã QR!");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await api.get(`/parkingsessions/verify/${code.trim()}`);
      setVerifySession(response.data);
      // Auto-capture exit snapshot
      setExitPhoto(capturePhoto());
      setExitPlate(response.data.licensePlate); // Default autofill
      setIsScanning(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Không tìm thấy vé hợp lệ hoặc vé đã thanh toán.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checkout and comparison confirmation
  const handleCheckOut = async () => {
    if (!verifySession) return;
    
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await api.post('/parkingsessions/checkout', {
        qrCode: verifySession.qrCode,
        exitLicensePlate: exitPlate.trim().toUpperCase(),
        exitPhoto: exitPhoto
      });

      setSuccessMsg(response.data.message);
      
      // Keep displaying result for 3 seconds, then reset
      setTimeout(() => {
        setVerifySession(null);
        setExitPhoto(null);
        setExitPlate("");
        setManualQrCode("");
        setIsScanning(true);
        setSuccessMsg("");
      }, 3500);

      fetchRecentLogs();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Lỗi xác nhận cho xe ra.");
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated scan triggers
  const simulateScan = () => {
    if (mode === 'checkin') {
      handleCheckIn();
      return;
    }

    // Checkout: Find first active log item to simulate scanning
    const activeLog = recentLogs.find(log => log.type === 'ENTRY');
    if (activeLog && activeLog.qrCode) {
      handleVerify(activeLog.qrCode);
    } else {
      setErrorMsg("Không tìm thấy thẻ gửi xe nào đang hoạt động trong database để mô phỏng quét!");
    }
  };

  // Real-time ALPR (OCR) for check-in
  useEffect(() => {
    let intervalId: any;
    let isOcrRunning = false;
    let worker: Tesseract.Worker | null = null;
    let isActive = true;

    const initWorker = async () => {
      try {
        worker = await Tesseract.createWorker('eng');
        if (isActive) setOcrDebugText("OCR Sẵn sàng");
      } catch (err) {
        console.error("Failed to init Tesseract", err);
      }
    };

    if (mode === 'checkin' && hasCameraAccess && !isLoading) {
      setOcrDebugText("OCR Đang tải dữ liệu AI...");
      initWorker();

      intervalId = setInterval(async () => {
        if (isOcrRunning || isLoadingRef.current || !worker || !isActive) return;
        
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          isOcrRunning = true;
          
          try {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            
            // Resize image to max 640px width to speed up OCR massively
            const scale = Math.min(1, 640 / video.videoWidth);
            canvas.width = video.videoWidth * scale;
            canvas.height = video.videoHeight * scale;
            
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              const { data: { text } } = await worker.recognize(canvas);
              
              const rawText = text.replace(/[\r\n]/g, ' ').trim();
              if (rawText && isActive) {
                setOcrDebugText(rawText.substring(0, 40));
              }
              
              // More permissive regex for Vietnamese plates (letters can be misread)
              const plateRegex = /([0-9A-Z]{2}[0-9A-Z]?)[-.\s]*([0-9]{3,4})[-.\s]*([0-9]{2})/i;
              const matches = text.match(plateRegex);
              
              if (matches && matches.length > 0 && isActive) {
                // Keep only alphanumeric and hyphen/dot
                let foundPlate = matches[0].replace(/[^a-zA-Z0-9-.]/g, '').toUpperCase();
                // Ensure there is a hyphen if missing
                if (foundPlate.length >= 7 && !foundPlate.includes('-')) {
                   foundPlate = foundPlate.replace(/([A-Z])([0-9]{4,5})/, '$1-$2');
                }
                
                if (inputPlateRef.current !== foundPlate) {
                  console.log("ALPR Detected:", foundPlate);
                  setInputPlate(foundPlate);
                  setSuccessMsg("Nhận diện biển số tự động thành công!");
                }
              }
            }
          } catch (err) {
            console.error("OCR Error:", err);
          } finally {
            isOcrRunning = false;
          }
        }
      }, 1000); // Poll every 1s
    }

    return () => {
      isActive = false;
      if (intervalId) clearInterval(intervalId);
      if (worker) {
        worker.terminate();
      }
    };
  }, [mode, hasCameraAccess, isLoading]);

  // Real-time QR Scanning Loop
  useEffect(() => {
    let intervalId: any;

    if (mode === 'checkout' && isScanning && hasCameraAccess && !isLoading) {
      intervalId = setInterval(() => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          const video = videoRef.current;
          const canvas = document.createElement('canvas');
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });
            
            if (code && code.data && code.data.trim() !== '') {
              console.log("Real-time QR Detected:", code.data);
              handleVerify(code.data);
              clearInterval(intervalId);
            }
          }
        }
      }, 400); // Check for QR code every 400ms
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [mode, isScanning, hasCameraAccess, isLoading]);

  return (
    <StaffLayout>
      <div className="grid grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Stats and System Control */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-[32px] flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-premium text-on-surface-variant uppercase">Sức chứa hiện tại</span>
              <div className="p-2 bg-primary/5 rounded-lg">
                <BarChart3 className="text-primary" size={18} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-light text-on-surface">{totalCapacity.current}</span>
                <span className="text-sm text-on-surface-variant font-medium">/ {totalCapacity.max} vị trí</span>
              </div>
              <div className="w-full h-1.5 bg-primary/5 mt-4 overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalCapacity.current / totalCapacity.max) * 100}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[32px] flex-1 flex flex-col">
            <h3 className="text-[10px] font-bold tracking-premium text-on-surface-variant uppercase mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Điều khiển hệ thống
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Mở cổng thủ công', icon: ExternalLink },
                { label: 'Báo cáo sự cố', icon: FileText },
                { label: 'Chẩn đoán hệ thống', icon: Activity }
              ].map((btn, i) => (
                <button key={i} className="w-full group flex items-center justify-between p-5 rounded-2xl bg-primary/[0.02] border border-primary/5 hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary uppercase tracking-widest">{btn.label}</span>
                  <btn.icon className="text-on-surface-variant/30 group-hover:text-primary transition-colors" size={16} />
                </button>
              ))}
              <div className="mt-auto pt-10">
                <button className="w-full bg-error/5 hover:bg-error/10 border border-error/20 p-5 rounded-2xl transition-all group">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-[10px] font-bold text-error uppercase tracking-premium">Khóa cổng khẩn cấp</span>
                    <Lock className="text-error" size={16} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Camera View, Check-in, & Check-out Scanner / Comparer */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-8">
          {/* Mode Tabs */}
          <div className="bg-slate-100/80 p-1.5 rounded-3xl gap-1 backdrop-blur-md flex shadow-sm border border-slate-200/40">
            <button 
              onClick={() => {
                setMode('checkin');
                setVerifySession(null);
                setIsScanning(true);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${mode === 'checkin' ? 'bg-primary text-white shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Xe Vào (Check-in)
            </button>
            <button 
              onClick={() => {
                setMode('checkout');
                setIsScanning(true);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${mode === 'checkout' ? 'bg-primary text-white shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Xe Ra (Check-out)
            </button>
          </div>

          <div className="glass-panel flex-1 flex flex-col relative overflow-hidden rounded-[48px] border-primary/10 group shadow-2xl min-h-[500px]">
            
            {/* Live Camera Viewport (Always active in background, except when reviewing match) */}
            <div className="absolute inset-0 z-0 bg-slate-100">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Blur Overlays during success or comparison results */}
              <AnimatePresence>
                {((mode === 'checkout' && !isScanning) || successMsg) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-10"
                  />
                )}
              </AnimatePresence>

              {!hasCameraAccess && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/80">
                  <Camera className="text-slate-300" size={48} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Không có tín hiệu camera</p>
                  <button 
                    onClick={startCamera}
                    className="mt-2 text-[10px] font-bold text-primary uppercase border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/5"
                  >
                    Thử lại
                  </button>
                </div>
              )}
            </div>

            {/* Foreground Actions and Panels */}
            <div className="relative z-10 flex-1 flex flex-col justify-between p-8">
              
              {/* Messages and Alerts */}
              <div>
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-error/10 border border-error/20 p-4 rounded-2xl flex items-center gap-3 text-error mb-4"
                  >
                    <AlertTriangle size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">{errorMsg}</span>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-500 mb-4"
                  >
                    <CheckCircle2 size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">{successMsg}</span>
                  </motion.div>
                )}
              </div>

              {/* Central Dynamic Screen */}
              <div className="flex-1 flex items-center justify-center py-6">
                <AnimatePresence mode="wait">
                  
                  {/* CHECK-IN SCANNER FRAME */}
                  {mode === 'checkin' && (
                    <div className="relative flex flex-col items-center">
                      <motion.div 
                        key="checkin-cam"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-72 h-72 cursor-pointer mb-2"
                        onClick={simulateScan}
                      >
                        <div className="absolute inset-0 border-2 border-primary/30 rounded-[40px] flex items-center justify-center">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-[32px]" />
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-[32px]" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-[32px]" />
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-[32px]" />
                          
                          <div className="text-center p-6 space-y-3 z-10 bg-white/40 backdrop-blur-sm rounded-[30px] border border-white/40">
                            <Camera className="text-primary mx-auto animate-pulse" size={40} />
                            <span className="block text-[9px] font-black uppercase text-primary tracking-widest">Camera Lối Vào</span>
                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Sẵn sàng nhận diện biển</span>
                          </div>
                        </div>
                      </motion.div>
                      {ocrDebugText && (
                        <div className="text-[10px] bg-black/50 text-white/70 px-3 py-1 rounded-full backdrop-blur-md max-w-[250px] truncate">
                          OCR: {ocrDebugText}
                        </div>
                      )}
                    </div>
                  )}

                  {/* CHECK-OUT SCANNER SEARCH */}
                  {mode === 'checkout' && isScanning && (
                    <motion.div 
                      key="checkout-scan"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative w-72 h-72 cursor-pointer"
                      onClick={simulateScan}
                    >
                      <div className="absolute inset-0 border-2 border-primary/30 rounded-[40px] flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-[32px]" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-[32px]" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-[32px]" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-[32px]" />
                        
                        <div className="absolute inset-10 border border-primary/20 flex items-center justify-center rounded-3xl overflow-hidden bg-white/20">
                          <div className="scanner-line !animate-[scan_3s_ease-in-out_infinite]" />
                          <QrCode className="text-primary/10" size={80} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* CHECK-OUT COMPARISON BOARD */}
                  {mode === 'checkout' && !isScanning && verifySession && (
                    <motion.div 
                      key="comparison-board"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="w-full max-w-lg z-20 text-white"
                    >
                      <h3 className="text-center font-black uppercase text-sm tracking-widest mb-6">Xác Minh Đối Chiếu Xe Ra</h3>

                      <div className="grid grid-cols-2 gap-6 mb-6">
                        
                        {/* Entry details */}
                        <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Ảnh Lúc Vào</span>
                              <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/20 text-[8px] font-bold rounded">VÀO</span>
                            </div>
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/40 mb-3 border border-white/5">
                              {verifySession.entryPhoto ? (
                                <img src={verifySession.entryPhoto} alt="Entry Car" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">Không có ảnh</div>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest block mb-1">Biển Số Lúc Vào</span>
                            <span className="text-2xl font-black tracking-wide text-primary block">{verifySession.licensePlate}</span>
                          </div>
                        </div>

                        {/* Exit details */}
                        <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Ảnh Lúc Ra</span>
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold rounded">RA</span>
                            </div>
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/40 mb-3 border border-white/5 relative">
                              {exitPhoto ? (
                                <img src={exitPhoto} alt="Exit Car" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">Chụp ảnh ra...</div>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest block mb-1">Nhập Biển Số Ra</span>
                            <input 
                              type="text" 
                              value={exitPlate}
                              onChange={(e) => setExitPlate(e.target.value.toUpperCase())}
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-extrabold text-lg uppercase tracking-wide focus:outline-none focus:border-primary/50 text-center"
                              placeholder="51A-123.45"
                            />
                          </div>
                        </div>

                      </div>

                      {/* Matching evaluation indicator */}
                      {exitPlate && (
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`p-4 rounded-2xl border flex items-center gap-3 mb-6 transition-all duration-300 ${
                            exitPlate.replace(/[-.\s]/g, '') === verifySession.licensePlate.replace(/[-.\s]/g, '')
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-red-500/10 border-red-500/20 text-red-400 animate-[shake_0.5s_ease-in-out]'
                          }`}
                        >
                          {exitPlate.replace(/[-.\s]/g, '') === verifySession.licensePlate.replace(/[-.\s]/g, '') ? (
                            <>
                              <ShieldCheck className="text-emerald-400 flex-shrink-0" size={20} />
                              <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-wider">Hợp lệ - Trùng Khớp</p>
                                <p className="text-[9px] opacity-80">Biển số xe ra trùng khớp 100% với dữ liệu lúc vào.</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="text-red-400 flex-shrink-0 animate-bounce" size={20} />
                              <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-wider">Cảnh Báo - Không Trùng Khớp!</p>
                                <p className="text-[9px] opacity-80">Cảnh báo: Biển số xe lúc ra không khớp với lúc vào. Vui lòng kiểm tra kỹ!</p>
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}

                      {/* Confirm Gate Release Buttons */}
                      <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            setVerifySession(null);
                            setIsScanning(true);
                          }}
                          className="flex-1 py-4 border border-white/20 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-wider text-white transition-all"
                        >
                          Hủy Bỏ
                        </button>
                        <button 
                          onClick={handleCheckOut}
                          disabled={isLoading}
                          className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <CheckCircle2 size={14} />
                          Mở Cổng Cho Xe Ra
                        </button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Bottom Interactive Inputs */}
              {(!verifySession) && (
                <div className="z-20 p-6 glass-panel-heavy border border-primary/10 rounded-[30px] flex items-center gap-6 shadow-lg bg-white/95">
                  {mode === 'checkin' ? (
                    <>
                      <div className="flex-1 flex items-center gap-4 bg-primary/[0.03] px-6 py-4 rounded-2xl border border-primary/10 focus-within:border-primary/30 focus-within:bg-white transition-all duration-300">
                        <Keyboard className="text-primary/30" size={18} />
                        <input 
                          className="bg-transparent border-none focus:ring-0 w-full text-on-surface font-bold text-sm uppercase placeholder:text-on-surface/20 tracking-widest outline-none" 
                          placeholder="NHẬP BIỂN SỐ XE VÀO" 
                          type="text"
                          value={inputPlate}
                          onChange={(e) => setInputPlate(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleCheckIn()}
                        />
                      </div>
                      <button 
                        onClick={() => handleCheckIn()}
                        disabled={isLoading}
                        className="bg-primary hover:bg-[#004bb1] disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-bold text-[11px] tracking-premium transition-all active:scale-[0.98] shadow-2xl shadow-primary/20 uppercase flex items-center gap-2"
                      >
                        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                        Khởi Tạo
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 flex items-center gap-4 bg-primary/[0.03] px-6 py-4 rounded-2xl border border-primary/10 focus-within:border-primary/30 focus-within:bg-white transition-all duration-300">
                        <QrCode className="text-primary/30" size={18} />
                        <input 
                          className="bg-transparent border-none focus:ring-0 w-full text-on-surface font-bold text-sm uppercase placeholder:text-on-surface/20 tracking-widest outline-none" 
                          placeholder="NHẬP MÃ QR / MÃ VÉ THỦ CÔNG" 
                          type="text"
                          value={manualQrCode}
                          onChange={(e) => setManualQrCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleVerify(manualQrCode)}
                        />
                      </div>
                      <button 
                        onClick={() => handleVerify(manualQrCode)}
                        disabled={isLoading}
                        className="bg-primary hover:bg-[#004bb1] disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-bold text-[11px] tracking-premium transition-all active:scale-[0.98] shadow-2xl shadow-primary/20 uppercase flex items-center gap-2"
                      >
                        <Zap size={14} className={isLoading ? 'animate-spin' : ''} />
                        Xác Minh
                      </button>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Side: Log Display */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel flex-1 p-8 flex flex-col rounded-[32px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-bold tracking-premium text-on-surface-variant uppercase flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Hoạt động gần đây
              </h3>
              <div className="flex items-center gap-2 px-2 py-1 bg-primary/5 rounded-md">
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Trực tiếp</span>
              </div>
            </div>
            
            <div className="space-y-2 overflow-y-auto max-h-[500px] -mx-8 px-8 flex-1">
              {recentLogs.length > 0 ? (
                recentLogs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="group py-4 border-b border-primary/[0.03] flex items-center justify-between hover:bg-primary/[0.02] -mx-4 px-4 rounded-xl transition-all cursor-pointer"
                    onClick={() => {
                      if (log.type === 'ENTRY' && mode === 'checkout') {
                        handleVerify(log.qrCode);
                      }
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors tracking-wider">{log.plate}</span>
                      <span className="text-[9px] text-on-surface-variant uppercase font-black tracking-tighter opacity-60">
                        {log.status} • {log.time}
                      </span>
                    </div>
                    <div className="p-2 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      {log.type === 'EXIT' ? (
                        <LogOut className="text-on-surface-variant/40" size={14} />
                      ) : (
                        <ArrowRight className="text-primary" size={14} />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">Không có bản ghi nào gần đây.</div>
              )}
            </div>
            
            <button className="mt-8 text-[10px] text-primary font-black tracking-premium hover:underline transition-colors uppercase flex items-center gap-2 text-left">
              <span>Xem tất cả nhật ký</span>
              <ExternalLink size={12} />
            </button>
          </div>

          <div className="glass-panel p-8 rounded-[32px] flex flex-col gap-4">
            <h3 className="text-[10px] font-bold tracking-premium text-on-surface-variant uppercase">Bảo mật hệ thống</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Giao thức</span>
                </div>
                <span className="text-[9px] font-black text-primary tracking-widest px-2 py-1 bg-primary/5 rounded-lg">TLS 1.3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Radio size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Luồng truyền</span>
                </div>
                <span className="text-[9px] font-black text-emerald-500 tracking-widest px-2 py-1 bg-emerald-500/5 rounded-lg">ĐÃ MÃ HÓA</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* QR Code Modal for Check-in */}
      <AnimatePresence>
        {currentSession && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100"
            >
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">Thẻ Xe QR Khách Hàng</h2>
              <p className="text-xs text-slate-400 mb-6">Vui lòng giao mã QR này cho khách hoặc in vé xe.</p>
              
              <div className="bg-slate-50 p-6 rounded-3xl inline-block mb-6 border border-slate-100">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentSession.qrCode}`} 
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="space-y-3 text-left bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Biển số xe</span>
                  <span className="font-extrabold text-slate-800 tracking-wide text-sm">{currentSession.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Thời gian vào</span>
                  <span className="font-extrabold text-slate-800">{new Date(currentSession.entryTime).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Mã QR phiên</span>
                  <span className="font-mono text-primary font-bold">{currentSession.qrCode}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    alert("Đang gửi lệnh in vé xe đến máy in nhiệt...");
                  }}
                  className="flex-1 py-4 border border-slate-200 hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <Printer size={14} />
                  In Vé
                </button>
                <button 
                  onClick={() => setCurrentSession(null)}
                  className="flex-1 py-4 bg-primary hover:bg-[#004bb1] text-white rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 size={14} />
                  Hoàn Tất
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </StaffLayout>
  );
};

export default StaffDashboard;
