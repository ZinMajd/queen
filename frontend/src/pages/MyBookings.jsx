import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Info,
  Package,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import api from '../api/api';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'قيد الانتظار', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
    confirmed: { label: 'تم التأكيد', color: 'bg-green-50 text-green-600 border-green-100', icon: CheckCircle2 },
    cancelled: { label: 'ملغي', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: XCircle },
    completed: { label: 'مكتمل', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Package }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-black ${config.color}`}>
      <Icon size={16} />
      {config.label}
    </div>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get('/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="text-3xl font-black text-rose-600 tracking-tighter italic">الملكة</Link>
          <Link to="/" className="flex items-center gap-3 text-slate-600 hover:text-rose-600 font-black transition-all group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            العودة للرئيسية
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl text-xs font-black tracking-widest uppercase mb-4">
              <Sparkles size={16} /> مساحتكِ الخاصة
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">حجوزاتي</h1>
            <p className="text-slate-500 font-medium text-lg mt-2">تابعي حالة طلباتكِ وتفاصيل مواعيدكِ</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="animate-spin text-rose-600" size={64} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm animate-in fade-in zoom-in duration-500">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Package className="text-slate-300" size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">لا توجد حجوزات حالياً</h2>
            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
              لم تقومي بحجز أي فستان أو خدمة بعد. تصفحي مجموعتنا الفريدة وابدئي رحلة التألق.
            </p>
            <button 
              onClick={() => navigate('/dresses')}
              className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-5 rounded-2xl font-black shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              استعرضي الفساتين
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-white rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 group overflow-hidden relative"
              >
                {/* Image */}
                <div className="w-full md:w-40 h-48 md:h-40 rounded-3xl overflow-hidden shrink-0 shadow-md">
                  <img 
                    src={booking.dress?.image || booking.service?.image} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>

                {/* Info */}
                <div className="flex-grow text-right space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <StatusBadge status={booking.status} />
                    <div className="text-slate-400 text-sm font-bold flex items-center gap-2 justify-end">
                      رقم الحجز: #{booking.id}
                      <Info size={16} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                    {booking.dress?.name || booking.service?.name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 justify-end text-slate-600 font-bold bg-slate-50 px-5 py-3 rounded-2xl">
                      <span>{new Date(booking.booking_date).toLocaleDateString('ar-YE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <Calendar size={20} className="text-rose-600" />
                    </div>
                    {booking.dress && (
                      <div className="flex items-center gap-3 justify-end text-slate-600 font-bold bg-slate-50 px-5 py-3 rounded-2xl">
                        <span>نوع الطلب: {booking.dress.type}</span>
                        <Sparkles size={20} className="text-rose-600" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0">
                  <button 
                    onClick={() => booking.dress ? navigate(`/dress/${booking.dress.id}`) : navigate('/services')}
                    className="bg-slate-900 hover:bg-rose-600 text-white p-4 rounded-2xl transition-all shadow-lg hover:rotate-12"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Support Banner */}
        <div className="mt-20 bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 text-right">
            <h3 className="text-2xl font-black mb-3">هل لديكِ استفسار عن حجزكِ؟</h3>
            <p className="text-slate-400 font-medium">نحن هنا لخدمتكِ على مدار الساعة للإجابة على جميع تساؤلاتكِ.</p>
          </div>
          <button className="relative z-10 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-xl font-black transition-all flex items-center gap-3 shadow-xl active:scale-95">
            تحدثي مع خدمة العملاء
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
