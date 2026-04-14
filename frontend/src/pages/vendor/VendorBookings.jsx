import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  MessageSquare, 
  Loader2, 
  Package,
  Calendar,
  User,
  ShieldCheck,
  ShieldAlert,
  ArrowLeftRight,
  Info
} from 'lucide-react';
import api from '../../api/api';

const VendorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vendor/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching vendor bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await api.put(`/vendor/bookings/${id}/status`, { status });
      // Update local state with the returned booking (which has the unmasked phone if confirmed)
      setBookings(bookings.map(b => b.id === id ? response.data.booking : b));
    } catch (err) {
      console.error('Update status error:', err);
      alert('حدث خطأ أثناء تحديث حالة الحجز');
    }
  };

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-black border border-amber-100 flex items-center gap-2"><Clock size={14} /> بانتظار قراركِ</span>;
      case 'confirmed':
        return <span className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-black border border-green-100 flex items-center gap-2"><CheckCircle2 size={14} /> تم قبولكِ للطلب</span>;
      case 'completed':
        return <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black border border-blue-100 flex items-center gap-2"><Package size={14} /> تم الإنجاز</span>;
      case 'cancelled':
        return <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-black border border-rose-100 flex items-center gap-2"><XCircle size={14} /> ملغي</span>;
      default:
        return <span className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-black">{status}</span>;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">طلبات الحجز الواردة</h1>
          <p className="text-slate-500 font-medium text-lg">تابعي طلبات العرائس ونسقي مواعيدكِ باحترافية</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           {['all', 'pending', 'confirmed'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                 filter === f 
                 ? 'bg-slate-900 text-white shadow-lg' 
                 : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
               }`}
             >
               {f === 'all' ? 'الكل' : f === 'pending' ? 'جديد' : 'مقبول'}
             </button>
           ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-40">
          <Loader2 className="animate-spin text-rose-600" size={64} />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-5xl p-20 text-center border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
            <Calendar size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">لا توجد طلبات حجز حالياً</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                {/* Client Info with Privacy Check */}
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-xl">
                        {booking.user?.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-black text-slate-900">{booking.user?.name}</h3>
                          {booking.status === 'pending' ? (
                            <div className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-100 font-black">
                              <ShieldAlert size={10} /> البيانات محمية
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-lg border border-green-100 font-black">
                              <ShieldCheck size={10} /> متاحة للتواصل
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400 font-bold">
                            <span className="flex items-center gap-2">
                               <Phone size={14} className={booking.status === 'pending' ? 'text-slate-300' : 'text-rose-500'} /> 
                               <span className={booking.status === 'pending' ? 'tracking-widest' : ''}>{booking.user?.phone}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Service/Date Details */}
                <div className="grow grid grid-cols-1 md:grid-cols-2 gap-8 lg:px-12 lg:border-x border-slate-100">
                    <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">الخدمة المطلوبة</p>
                        <p className="text-lg font-black text-slate-800">{booking.service?.name}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">موعد المناسبة</p>
                        <p className="text-lg font-black text-slate-800 flex items-center justify-end gap-2">
                             <Calendar size={20} className="text-rose-600" />
                             {new Date(booking.booking_date).toLocaleDateString('ar-YE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Status & Quick Actions */}
                <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
                    {getStatusBadge(booking.status)}
                    
                    <div className="flex gap-3 w-full lg:w-auto">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              className="grow lg:grow-0 bg-slate-900 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95"
                            >
                              قبول الحجز وكشف البيانات
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              className="p-4 bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"
                            >
                              <XCircle size={24} />
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <div className="flex gap-3 animate-in slide-in-from-bottom duration-500">
                             <a 
                               href={`https://wa.me/${booking.user?.phone}`} 
                               target="_blank" 
                               rel="noreferrer"
                               className="flex items-center gap-2 bg-green-500 text-white px-6 py-4 rounded-2xl font-black hover:bg-green-600 transition-all shadow-lg shadow-green-200"
                             >
                                <MessageSquare size={20} /> تواصل واتساب
                             </a>
                             <a 
                               href={`tel:${booking.user?.phone}`} 
                               className="flex items-center gap-2 bg-blue-500 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
                             >
                                <Phone size={20} /> اتصال هاتف
                             </a>
                             <button 
                                onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-green-600 transition-all shadow-xl"
                                title="تم إنجاز الخدمة بنجاح"
                             >
                                <CheckCircle2 size={24} />
                             </button>
                          </div>
                        )}
                    </div>
                </div>
              </div>

              {booking.status === 'pending' && (
                <div className="mt-8 p-4 bg-amber-50 rounded-2xl flex items-center gap-3 text-amber-700 text-sm font-bold border border-amber-100">
                   <Info size={18} />
                   <span>بموجب سياسة الخصوصية، سيظهر رقم هاتف العروس كاملاً بمجرد قبولكِ لطلب الحجز.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorBookings;
