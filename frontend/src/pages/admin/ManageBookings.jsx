import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Phone,
  MessageSquare,
  Loader2,
  Trash2,
  Package
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
      fetchBookings();
    } catch (err) {
      console.error('Update status error:', err);
      alert('حدث خطأ أثناء تحديث الحالة');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنتِ متأكدة من حذف هذا الحجز نهائياً؟')) {
      try {
        await api.delete(`/admin/bookings/${id}`);
        fetchBookings();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-black border border-amber-100 flex items-center gap-2"><Clock size={14} /> معلق</span>;
      case 'confirmed':
        return <span className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-black border border-green-100 flex items-center gap-2"><CheckCircle2 size={14} /> مؤكد</span>;
      case 'completed':
        return <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black border border-blue-100 flex items-center gap-2"><Package size={14} /> مكتمل</span>;
      case 'cancelled':
        return <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-black border border-rose-100 flex items-center gap-2"><XCircle size={14} /> ملغي</span>;
      default:
        return <span className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-black">{status}</span>;
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.dress?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">إدارة الحجوزات</h1>
        <p className="text-slate-500 font-medium">تابعي طلبات العميلات ونظمي مواعيد الاستلام والقياس</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative grow">
          <Search className="absolute right-4 top-4 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="البحث باسم العميل أو الفستان..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
          >
            <option value="all">كل الحالات</option>
            <option value="pending">المعلقة</option>
            <option value="confirmed">المؤكدة</option>
            <option value="completed">المكتملة</option>
            <option value="cancelled">الملغاة</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="animate-spin text-rose-600" size={48} />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-4xl border border-slate-100 italic font-bold text-slate-400">لا توجد حجوزات تتوافق مع البحث</div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                {/* Client Info */}
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl font-black shadow-lg">
                        {booking.user?.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">{booking.user?.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500 font-bold">
                            <span className="flex items-center gap-1"><Phone size={14} className="text-rose-500" /> {booking.user?.phone || 'بدون هاتف'}</span>
                            <span className="bg-slate-100 w-1 h-1 rounded-full"></span>
                            <span className="flex items-center gap-1 text-xs">{booking.user?.email}</span>
                        </div>
                    </div>
                </div>

                {/* Booking Info */}
                <div className="grow flex flex-col md:flex-row gap-8 lg:px-12 lg:border-x border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                            <img 
                                src={booking.dress?.image ? (booking.dress.image.startsWith('http') ? booking.dress.image : `http://localhost:8000${booking.dress.image}`) : ''} 
                                alt="" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-widest">الصنف المختار</p>
                            <p className="font-black text-slate-800">{booking.dress?.name || booking.service?.name || '---'}</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-widest">تاريخ الحجز</p>
                        <p className="font-black text-slate-800 flex items-center gap-2">
                             <Calendar size={18} className="text-rose-600" />
                             {new Date(booking.booking_date).toLocaleDateString('ar-YE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
                    {getStatusBadge(booking.status)}
                    <div className="flex gap-2">
                        {booking.status === 'pending' && (
                            <button 
                                onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 active:scale-95 text-sm"
                            >
                                تأكيد الحجز
                            </button>
                        )}
                        {booking.status === 'confirmed' && (
                             <button 
                                onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 active:scale-95 text-sm"
                            >
                                سجل كمكتمل
                            </button>
                        )}
                        <button 
                            onClick={() => handleDelete(booking.id)}
                            className="p-3 bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-600 rounded-2xl transition-all"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
              </div>

              {/* Contact Actions hover bar */}
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">تواصل سريع:</p>
                <div className="flex gap-3">
                    <a href={`https://wa.me/${booking.user?.phone}`} target="_blank" className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-green-600 hover:text-white transition-all">
                        <MessageSquare size={14} /> واتساب
                    </a>
                    <a href={`tel:${booking.user?.phone}`} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-all">
                        <Phone size={14} /> اتصال
                    </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
