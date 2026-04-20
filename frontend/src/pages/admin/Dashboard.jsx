import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Tags, 
  CalendarCheck, 
  Users, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: iconProp, color, trend }) => {
    const Icon = iconProp;
    return (
      <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
            <Icon className={color.replace('bg-', 'text-')} size={28} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 font-black text-sm ${trend > 0 ? 'text-green-500' : 'text-rose-500'}`}>
              {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h3 className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-xs">{title}</h3>
        <p className="text-4xl font-black text-slate-900">{value}</p>
      </div>
    );
  };

  const ProgressBar = ({ label, value, max, color }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-bold">
        <span className="text-slate-600 truncate max-w-[150px]">{label}</span>
        <span className="text-slate-900">{value} طلب</span>
      </div>
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-600"></div>
    </div>
  );

  const maxServiceCount = Math.max(...(data?.top_services?.map(s => s.count) || [1]));
  const maxDressCount = Math.max(...(data?.top_dresses?.map(d => d.count) || [1]));

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 mt-4">تقارير المنصة التحليلية</h1>
          <p className="text-slate-500 font-medium text-lg">أهلاً بكِ في مركز التحكم، إليكِ تحليل شامل لنشاط الملكة</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">نمو المستخدمين (30 يوم)</p>
                <div className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-500" />
                    <span className="text-2xl font-black text-slate-900">+{data?.stats.new_users_30d}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="إجمالي الأرباح" 
          value={`${data?.stats.total_revenue || 0} ر.ي`} 
          icon={TrendingUp} 
          color="bg-green-600" 
          trend={15}
        />
        <StatCard 
          title="إجمالي الحجوزات" 
          value={data?.stats.total_bookings} 
          icon={CalendarCheck} 
          color="bg-rose-600" 
          trend={8}
        />
        <StatCard 
          title="المستخدمين" 
          value={data?.stats.total_users} 
          icon={Users} 
          color="bg-indigo-600" 
          trend={5}
        />
        <StatCard 
          title="مزودي الخدمات" 
          value={data?.stats.total_vendors} 
          icon={Sparkles} 
          color="bg-amber-600" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl">
                <Clock size={24} />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase">حجوزات معلقة</p>
                <p className="text-2xl font-black text-slate-900">{data?.stats.pending_bookings}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
                <ShoppingBag size={24} />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase">إجمالي الفساتين</p>
                <p className="text-2xl font-black text-slate-900">{data?.stats.total_dresses}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl">
                <Users size={24} />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase">مزودين قيد المراجعة</p>
                <p className="text-2xl font-black text-slate-900">{data?.stats.pending_vendors}</p>
            </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Services Report */}
         <div className="bg-white p-10 rounded-5xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-10">
                <div className="bg-indigo-100 p-4 rounded-3xl text-indigo-600">
                    <BarChart3 size={28} />
                </div>
                <div>
                     <h2 className="text-2xl font-black text-slate-900">أكثر الخدمات طلباً</h2>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">بناءً على إجمالي الحجوزات</p>
                </div>
            </div>
            <div className="space-y-8">
                {data?.top_services?.length > 0 ? data.top_services.map(item => (
                    <ProgressBar 
                        key={item.service_id}
                        label={item.service?.name}
                        value={item.count}
                        max={maxServiceCount}
                        color="bg-indigo-600"
                    />
                )) : (
                    <p className="text-center py-10 text-slate-400 italic">لا توجد بيانات كافية حالياً</p>
                )}
            </div>
         </div>

         {/* Top Dresses Report */}
         <div className="bg-white p-10 rounded-5xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-10">
                <div className="bg-rose-100 p-4 rounded-3xl text-rose-600">
                    <Sparkles size={28} />
                </div>
                <div>
                     <h2 className="text-2xl font-black text-slate-900">الفساتين الأكثر تميزاً</h2>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">أعلى معدلات حجز في المتجر</p>
                </div>
            </div>
            <div className="space-y-8">
                {data?.top_dresses?.length > 0 ? data.top_dresses.map(item => (
                    <ProgressBar 
                        key={item.dress_id}
                        label={item.dress?.name}
                        value={item.count}
                        max={maxDressCount}
                        color="bg-rose-600"
                    />
                )) : (
                    <p className="text-center py-10 text-slate-400 italic">لا توجد بيانات كافية حالياً</p>
                )}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-5xl p-10 shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-3 rounded-2xl text-slate-600">
                    <Clock size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">أحدث الحجوزات</h2>
            </div>
            <button onClick={() => navigate('/admin/bookings')} className="text-rose-600 font-bold hover:text-rose-700 transition-colors bg-rose-50 px-4 py-2 rounded-xl">عرض الكل</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-50 text-xs uppercase tracking-widest">
                  <th className="pb-6">العميل</th>
                  <th className="pb-6">النوع</th>
                  <th className="pb-6">البيان</th>
                  <th className="pb-6">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.recent_bookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-xs">
                                {booking.user?.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900">{booking.user?.name}</span>
                        </div>
                    </td>
                    <td className="py-6">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${booking.dress_id ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {booking.dress_id ? 'فستان' : 'خدمة'}
                        </span>
                    </td>
                    <td className="py-6 font-bold text-slate-600 text-sm">
                        {booking.dress?.name || booking.service?.name || '---'}
                    </td>
                    <td className="py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {booking.status === 'pending' ? 'جاري المراجعة' : 
                         booking.status === 'confirmed' ? 'تم التأكيد' : booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Distribution Visual */}
        <div className="bg-slate-900 rounded-5xl p-10 text-white shadow-2xl relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-2xl font-black mb-10 relative z-10 flex items-center gap-3">
                <PieChartIcon className="text-rose-500" />
                توزيع الحالات
            </h2>
            
            <div className="space-y-6 relative z-10 grow">
                {data?.status_distribution?.map(item => (
                    <div key={item.status} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                                item.status === 'pending' ? 'bg-amber-500' :
                                item.status === 'confirmed' ? 'bg-green-500' : 'bg-slate-400'
                            }`}></div>
                            <span className="font-bold text-slate-300 capitalize">{item.status}</span>
                        </div>
                        <span className="font-black text-xl">{item.count}</span>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-8 bg-rose-600/10 rounded-4xl border border-rose-500/20 relative z-10">
                <div className="flex items-center gap-3 mb-3 text-rose-500">
                    <Activity size={20} />
                    <h4 className="font-bold">ملخص النشاط</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                    يتم تحديث هذه البيانات لحظياً. يمكنكِ تتبع معدلات التحويل بين الطلبات المعلقة والمؤكدة لتحسين أداء المنصة.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
