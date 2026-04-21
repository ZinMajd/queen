import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Phone,
  MessageSquare,
  Loader2,
  Trash2,
  Package,
  X
} from 'lucide-react';
import api from '../../api/api';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/bookings/${id}`, { status });
      alert('تم تأكيد الحجز، الفستان الآن سيظهر كمحجوز للجميع');
      fetchBookings();
    } catch (err) {
      alert('حدث خطأ أثناء تحديث الحالة');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنتِ متأكدة من حذف هذا الحجز نهائياً؟')) {
      try {
        await api.delete(`/admin/bookings/${id}`);
        fetchBookings();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-black border border-amber-100 flex items-center gap-2"><Clock size={14} /> في انتظار الاتفاق (معلق)</span>;
      case 'confirmed': return <span className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-black border border-green-100 flex items-center gap-2"><CheckCircle2 size={14} /> تم الاتفاق (مؤكد)</span>;
      case 'completed': return <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black border border-blue-100 flex items-center gap-2"><Package size={14} /> مكتمل</span>;
      case 'cancelled': return <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-black border border-rose-100 flex items-center gap-2"><XCircle size={14} /> ملغي</span>;
      default: return <span className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-black">{status}</span>;
    }
  };

  const filteredBookings = bookings.filter(b => {
    const name = b.user?.name || b.customer_name || '';
    const dressName = b.dress?.name || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dressName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700 p-4 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">طلبات الحجز</h1>
          <p className="text-slate-500 font-medium">راجعي الطلبات، اتفقي على السعر واتساب، ثم اضغطي "تأكيد" لحجز الفستان</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative grow">
          <Search className="absolute right-4 top-4 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="البحث باسم العميل أو الفستان..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none font-bold"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold text-slate-600 outline-none transition-all"
        >
          <option value="all">كل الحالات</option>
          <option value="pending">في انتظار الاتفاق (معلقة)</option>
          <option value="confirmed">تم الاتفاق (مؤكدة)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex justify-center py-40"><Loader2 className="animate-spin text-rose-600" size={48} /></div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-4xl border border-slate-100 font-bold text-slate-400">لا توجد طلبات حجز حالياً</div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl font-black shadow-lg">
                        {(booking.user?.name || booking.customer_name || '?').charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">{booking.user?.name || booking.customer_name}</h3>
                        <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                          <Phone size={14} className="text-rose-500" /> {booking.user?.phone || booking.customer_phone}
                        </p>
                    </div>
                </div>

                <div className="grow flex flex-col md:flex-row gap-8 lg:px-12 lg:border-x border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                            <img src={booking.dress?.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">الفستان المطلوب</p>
                            <p className="font-black text-slate-800">{booking.dress?.name || '---'}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">تاريخ المناسبة</p>
                        <p className="font-black text-slate-800 flex items-center gap-2">
                             <Calendar className="text-rose-600" size={16} />
                             {booking.booking_date}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-4 w-full lg:w-auto">
                    {getStatusBadge(booking.status)}
                    <div className="flex gap-2 w-full lg:w-auto">
                        {booking.status === 'pending' ? (
                            <button 
                                onClick={() => handleUpdateStatus(booking.id, 'confirmed')} 
                                className="grow lg:grow-0 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <CheckCircle2 size={18} /> تأكيد الاتفاق (حجز)
                            </button>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600 font-black text-sm px-4 py-2 bg-green-50 rounded-xl">
                             <CheckCircle2 size={16} /> تم الحجز بنجاح
                          </div>
                        )}
                        <button onClick={() => handleDelete(booking.id)} className="p-3 bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-600 rounded-2xl transition-all"><Trash2 size={20} /></button>
                    </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-4">
                <a href={`https://api.whatsapp.com/send?phone=${booking.user?.phone || booking.customer_phone}`} target="_blank" className="flex items-center gap-2 bg-green-50 text-green-600 px-6 py-3 rounded-2xl text-sm font-black hover:bg-green-600 hover:text-white transition-all">
                    <MessageSquare size={18} /> تواصل واتساب للاتفاق على السعر
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
