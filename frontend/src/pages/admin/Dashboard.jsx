import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Tags, 
  CalendarCheck, 
  Users, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
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

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-600"></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 mt-4">نظرة عامة على النظام</h1>
        <p className="text-slate-500 font-medium">أهلاً بك مجدداً، إليك ملخص العمليات اليوم</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="إجمالي الفساتين" 
          value={data?.stats.total_dresses} 
          icon={ShoppingBag} 
          color="bg-blue-600" 
          trend={12}
        />
        <StatCard 
          title="إجمالي الحجوزات" 
          value={data?.stats.total_bookings} 
          icon={CalendarCheck} 
          color="bg-rose-600" 
          trend={8}
        />
        <StatCard 
          title="الأقسام المفعلة" 
          value={data?.stats.total_categories} 
          icon={Tags} 
          color="bg-amber-600" 
        />
        <StatCard 
          title="المستخدمين" 
          value={data?.stats.total_users} 
          icon={Users} 
          color="bg-indigo-600" 
          trend={5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-5xl p-10 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
                <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                    <Clock size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">أحدث الحجوزات</h2>
            </div>
            <button onClick={() => navigate('/admin/bookings')} className="text-rose-600 font-bold hover:text-rose-700 transition-colors">عرض الكل</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-50">
                  <th className="pb-6">العميل</th>
                  <th className="pb-6">الفستان/الخدمة</th>
                  <th className="pb-6">التاريخ</th>
                  <th className="pb-6">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.recent_bookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500">
                                {booking.user?.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900">{booking.user?.name}</span>
                        </div>
                    </td>
                    <td className="py-6 font-medium text-slate-600">
                        {booking.dress?.name || booking.service?.name || '---'}
                    </td>
                    <td className="py-6 text-slate-500 font-medium">
                        {new Date(booking.booking_date).toLocaleDateString('ar-YE')}
                    </td>
                    <td className="py-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tight ${
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

        {/* Quick Actions / Platform Info */}
        <div className="bg-slate-900 rounded-5xl p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-2xl font-black mb-10 relative z-10 flex items-center gap-3">
                <TrendingUp className="text-rose-500" />
                نشاط المنصة
            </h2>
            
            <div className="space-y-10 relative z-10">
                <div className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-rose-600 transition-all">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <p className="font-bold">الحجوزات المعلقة</p>
                            <p className="text-xs text-slate-400">تحتاج إلى تأكيد</p>
                        </div>
                    </div>
                    <span className="text-2xl font-black text-rose-500">{data?.stats.pending_bookings}</span>
                </div>

                <div className="p-8 bg-white/5 rounded-4xl border border-white/10 mt-12">
                    <h4 className="font-bold mb-4">نصيحة إدارية</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        تأكدي من متابعة الحجوزات المعلقة خلال اليوم لضمان أفضل تجربة للعملاء. تحديث حالة الفساتين غير المتوفرة يقلل من تضارب المواعيد.
                    </p>
                </div>

                <button 
                  onClick={() => navigate('/admin/bookings')}
                  className="w-full bg-rose-600 hover:bg-rose-700 py-5 rounded-2xl font-black transition-all shadow-xl shadow-rose-900/50 flex items-center justify-center gap-3 group"
                >
                    مراجعة كافة الحجوزات
                    <ArrowUpRight size={20} className="group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] transition-transform" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
