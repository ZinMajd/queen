import React, { useState } from 'react';
import { Calendar, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/api';

const BookingModal = ({ dress, service, onClose }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Check if user is logged in (simplified for now)
      const token = localStorage.getItem('token');
      if (!token) {
        setError('يرجى تسجيل الدخول أولاً لإتمام الحجز.');
        setLoading(false);
        return;
      }

      await api.post('/bookings', {
        dress_id: dress?.id || null,
        service_id: service?.id || null,
        booking_date: bookingDate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال الحجز. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {success ? (
          <div className="p-12 text-center">
            <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 className="text-green-500" size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">تم طلب الحجز بنجاح!</h2>
            <p className="text-slate-500 leading-relaxed text-lg">
              سنتواصل معكِ هاتفياً خلال 24 ساعة لتأكيد الموعد وتفاصيل الاستلام.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-rose-600 p-8 text-white flex justify-between items-start">
              <div className="text-right">
                <h2 className="text-3xl font-black mb-2">تأكيد الحجز</h2>
                <p className="text-rose-100 font-medium">خطوة واحدة وتكتمل فرحتكِ</p>
              </div>
              <button 
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleBooking} className="p-8 lg:p-12 space-y-8">
              {/* Item Summary */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm">
                  <img src={dress?.image || service?.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-right flex-grow">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">العنصر المختار</p>
                  <h3 className="text-xl font-bold text-slate-900">{dress?.name || service?.name}</h3>
                </div>
              </div>

              {/* Date Input */}
              <div className="text-right">
                <label className="block text-slate-700 font-bold mb-3 mr-2">تاريخ الموعد (القياس أو المناسبة)</label>
                <div className="relative">
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold text-slate-800"
                  />
                  <Calendar className="absolute right-4 top-4 text-slate-400" size={24} />
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-rose-600 text-white py-6 rounded-[2rem] text-xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    إتمام طلب الحجز
                    <CheckCircle2 size={24} />
                  </>
                )}
              </button>
              
              <p className="text-center text-slate-400 text-sm font-medium">
                * لن يتم خصم أي مبالغ الآن، الدفع يتم في المعرض
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
