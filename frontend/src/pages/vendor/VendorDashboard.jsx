import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  CalendarCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingDown,
  ShoppingBag
} from 'lucide-react';

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
  <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color.replace('text-', 'bg-')}/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110`}></div>
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${color.replace('text-', 'bg-')}/10 ${color}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  </div>
);

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0
  });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // In a real app, we fetch vendor-specific stats
    // Placeholder logic for now
    setTimeout(() => {
      setStats({
        totalServices: 4,
        totalBookings: 12,
        pendingBookings: 3,
        completedBookings: 8
      });
    }, 800);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl text-xs font-black tracking-widest uppercase mb-4">
             <TrendingUp size={16} /> أداء متميز اليوم
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">أهلاً بكِ، {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 font-medium text-lg mt-2 tracking-wide">إليكِ نظرة سريعة على آخر نشاطات خدماتكِ</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي الخدمات" 
          value={stats.totalServices} 
          icon={Sparkles} 
          color="text-rose-600" 
          trend="up" 
          trendValue="+1" 
        />
        <StatCard 
          title="إجمالي الحجوزات" 
          value={stats.totalBookings} 
          icon={CalendarCheck} 
          color="text-indigo-600" 
          trend="up" 
          trendValue="+15%" 
        />
        <StatCard 
          title="حجوزات معلقة" 
          value={stats.pendingBookings} 
          icon={Clock} 
          color="text-amber-600" 
        />
        <StatCard 
          title="طلبات منجزة" 
          value={stats.completedBookings} 
          icon={CheckCircle2} 
          color="text-green-600" 
          trend="up" 
          trendValue="80%" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Welcome Section */}
        <div className="lg:col-span-2 bg-slate-900 rounded-5xl p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
             <div className="grow space-y-6 text-right">
                <h2 className="text-3xl font-black">جاهزة لاستقبال المزيد من الحجوزات؟</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  احرصي دائماً على تحديث صور خدماتكِ وأوصافها لجذب المزيد من العرائس. خدماتكِ المتميزة هي سر جمال "الملكة".
                </p>
                <div className="flex gap-4">
                   <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95">
                     إضافة خدمة جديدة
                   </button>
                   <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black transition-all">
                     عرض الأسئلة الشائعة
                   </button>
                </div>
             </div>
             <div className="shrink-0 w-48 h-48 bg-white/5 rounded-4xl flex items-center justify-center p-8 backdrop-blur-sm border border-white/10">
                <ShoppingBag size={80} className="text-rose-500" />
             </div>
          </div>
        </div>

        {/* Tip of the day */}
        <div className="bg-white rounded-5xl p-10 border border-slate-100 shadow-sm">
           <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
              <Sparkles size={24} />
           </div>
           <h3 className="text-xl font-black text-slate-900 mb-4">نصيحة اليوم</h3>
           <p className="text-slate-500 font-medium leading-relaxed mb-6">
             الصور ذات الإضاءة الطبيعية والخلفيات البسيطة تزيد من فرصة حجز الخدمة بنسبة تتجاوز 40% كوني دقيقة في التفاصيل.
           </p>
           <button className="text-rose-600 font-black flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-xs">
             تعلمي المزيد <ArrowUpRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
