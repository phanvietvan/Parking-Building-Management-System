import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  UserCheck, 
  ClipboardList, 
  RotateCw, 
  CheckSquare 
} from 'lucide-react';
import StaffLayout from '../components/layout/StaffLayout';

const LogisticsPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Thay giấy cuộn máy in hóa đơn cổng A1', done: false, priority: 'HIGH' },
    { id: 2, text: 'Kiểm tra pin lưu điện UPS hệ thống barrier', done: true, priority: 'MEDIUM' },
    { id: 3, text: 'Vệ sinh cảm biến hồng ngoại nhận diện xe', done: false, priority: 'MEDIUM' },
    { id: 4, text: 'Bàn giao thẻ từ dự phòng cho ca đêm', done: false, priority: 'LOW' },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const inventory = [
    { name: 'Thẻ từ RFID trắng', count: 420, min: 100, status: 'NORMAL', unit: 'Thẻ' },
    { name: 'Giấy in nhiệt hóa đơn', count: 18, min: 20, status: 'LOW', unit: 'Cuộn' },
    { name: 'Mực in ruy-băng', count: 5, min: 5, status: 'WARNING', unit: 'Hộp' },
    { name: 'Thẻ VIP cư dân', count: 85, min: 20, status: 'NORMAL', unit: 'Thẻ' },
  ];

  const zoneOccupancy = [
    { name: 'Tầng Trệt (Zone A)', occupied: 45, total: 50, color: 'from-blue-600 to-indigo-600' },
    { name: 'Tầng 1 (Zone B)', occupied: 38, total: 50, color: 'from-purple-600 to-pink-600' },
    { name: 'Tầng 2 (Zone C)', occupied: 42, total: 50, color: 'from-cyan-600 to-blue-600' },
    { name: 'Tầng Hầm (Zone D)', occupied: 17, total: 50, color: 'from-emerald-600 to-teal-600' },
  ];

  return (
    <StaffLayout>
      <div className="grid grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Space Allocation */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-[32px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xs font-bold tracking-premium text-on-surface-variant uppercase mb-1">Hậu cần bãi đỗ</h3>
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Phân bổ sức chứa tầng</h2>
              </div>
              <button className="p-3 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all">
                <RotateCw size={16} className="text-primary" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {zoneOccupancy.map((zone, i) => {
                const percentage = Math.round((zone.occupied / zone.total) * 100);
                return (
                  <div key={i} className="p-6 rounded-2xl bg-primary/[0.02] border border-primary/5 hover:border-primary/10 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-on-surface/80">{zone.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium mt-1">Sức chứa thực tế</p>
                      </div>
                      <span className="text-lg font-black text-primary">{percentage}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-primary/5 rounded-full overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full bg-gradient-to-r ${zone.color}`}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <span>Đã đỗ: {zone.occupied}</span>
                      <span>Trống: {zone.total - zone.occupied}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inventory Table */}
          <div className="glass-panel p-8 rounded-[32px] flex flex-col">
            <h3 className="text-xs font-bold tracking-premium text-on-surface-variant uppercase mb-6 flex items-center gap-3">
              <Database size={16} className="text-primary" /> Vật tư & Thiết bị dự phòng
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="pb-4">Tên vật tư</th>
                    <th className="pb-4 text-center">Số lượng</th>
                    <th className="pb-4 text-center">Định mức tối thiểu</th>
                    <th className="pb-4 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/[0.03]">
                  {inventory.map((item, i) => (
                    <tr key={i} className="group hover:bg-primary/[0.01]">
                      <td className="py-4 text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                        {item.name}
                      </td>
                      <td className="py-4 text-xs font-bold text-center text-on-surface-variant">
                        {item.count} {item.unit}
                      </td>
                      <td className="py-4 text-xs font-medium text-center text-on-surface-variant/75">
                        {item.min} {item.unit}
                      </td>
                      <td className="py-4 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          item.status === 'NORMAL' ? 'bg-emerald-500/10 text-emerald-600' :
                          item.status === 'WARNING' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-error/10 text-error'
                        }`}>
                          {item.status === 'NORMAL' ? 'Đầy đủ' :
                           item.status === 'WARNING' ? 'Sắp hết' : 'Thiếu hụt'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Checklist and Staff Assignments */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-[32px] flex flex-col">
            <h3 className="text-xs font-bold tracking-premium text-on-surface-variant uppercase mb-6 flex items-center gap-3">
              <ClipboardList size={16} className="text-primary" /> Checklist công việc hôm nay
            </h3>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                    task.done 
                      ? 'bg-emerald-500/[0.02] border-emerald-500/10 opacity-70' 
                      : 'bg-primary/[0.02] border-primary/5 hover:border-primary/20'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    task.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-outline/50'
                  }`}>
                    {task.done && <CheckSquare size={12} />}
                  </div>

                  <div className="flex-1">
                    <p className={`text-xs font-bold leading-normal ${task.done ? 'line-through text-on-surface-variant/50' : 'text-on-surface'}`}>
                      {task.text}
                    </p>
                    <span className={`inline-block mt-2 text-[8px] font-black tracking-widest px-2 py-0.5 rounded ${
                      task.priority === 'HIGH' ? 'bg-error/10 text-error' :
                      task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-slate-500/10 text-slate-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[32px] flex flex-col gap-4">
            <h3 className="text-xs font-bold tracking-premium text-on-surface-variant uppercase flex items-center gap-3">
              <UserCheck size={16} className="text-primary" /> Phân công nhân sự ca trực
            </h3>

            <div className="space-y-4">
              {[
                { name: 'Nguyễn Văn Hùng', zone: 'Cổng vào A1 (Trưởng ca)', time: '06:00 - 14:00' },
                { name: 'Trần Minh Hải', zone: 'Cổng ra A2', time: '06:00 - 14:00' },
                { name: 'Phan Văn Tiến', zone: 'Tuần tra Zone B/C', time: '08:00 - 16:00' },
              ].map((staff, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-primary/[0.03] last:border-0">
                  <div>
                    <p className="text-xs font-bold text-on-surface">{staff.name}</p>
                    <p className="text-[9px] text-on-surface-variant font-medium mt-1">{staff.zone}</p>
                  </div>
                  <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-1 rounded-md">
                    {staff.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </StaffLayout>
  );
};

export default LogisticsPage;
