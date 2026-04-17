import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  Store,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Loader2,
  Lock,
  MessageCircle,
  Phone
} from 'lucide-react';
import api from '../api/api';

const BookingModal = ({ isOpen, onClose, dress, service }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    booking_date: '',
    delivery_method: 'pickup',
    delivery_address: '',
    payment_method: 'cash',
  });
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fetchLoading, setFetchLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookedDates = async () => {
      setFetchLoading(true);
      try {
        const response = await api.get(`/dresses/${dress.id}/booked-dates`);
        setBookedDates(response.data);
      } catch (err) {
        console.error('Error fetching booked dates:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    if (isOpen && dress) {
      fetchBookedDates();
    }
  }, [isOpen, dress]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateObj = new Date(year, month, day);
      const isPast = dateObj < today;
      const isBooked = bookedDates.includes(dateStr);
      const isSelected = formData.booking_date === dateStr;

      days.push(
        <button
          key={day}
          disabled={isPast || isBooked}
          onClick={() => setFormData({ ...formData, booking_date: dateStr })}
          className={`
            relative p-2 rounded-xl font-black transition-all flex flex-col items-center justify-center gap-1
            ${isSelected ? 'bg-rose-600 text-white shadow-xl scale-110 z-10' : ''}
            ${!isSelected && !isPast && !isBooked ? 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-600' : ''}
            ${isPast ? 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50' : ''}
            ${isBooked ? 'bg-rose-50 text-rose-600 cursor-not-allowed border-2 border-rose-500 ring-2 ring-rose-200' : ''}
          `}
        >
          <span className="text-sm">{day}</span>
          {isBooked && (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-rose-600 rounded-full flex items-center justify-center animate-pulse">
                   <div className="w-4 h-0.5 bg-rose-600 rotate-45 absolute"></div>
                   <div className="w-4 h-0.5 bg-rose-600 -rotate-45 absolute"></div>
                </div>
             </div>
          )}
          {isSelected && <CheckCircle2 size={12} className="text-white" />}
        </button>
      );
    }
    return days;
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('يرجى تسجيل الدخول أولاً لإتمام الحجز.');
        setLoading(false);
        return;
      }

      await api.post('/bookings', {
        dress_id: dress?.id || null,
        service_id: service?.id || null,
        ...formData
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

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          /* Step 1: Calendar Selection */
          <div className="space-y-4 animate-in fade-in slide-in-from-left duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900">اختاري تاريخ المناسبة</h3>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                 <button type="button" onClick={prevMonth} className="p-1 hover:bg-white rounded-lg transition-all"><ChevronRight size={16} /></button>
                 <span className="font-black text-slate-800 text-xs min-w-[80px] text-center">
                   {currentDate.toLocaleDateString('ar-YE', { month: 'short', year: 'numeric' })}
                 </span>
                 <button type="button" onClick={nextMonth} className="p-1 hover:bg-white rounded-lg transition-all"><ChevronLeft size={16} /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-400 py-1">{d}</div>
              ))}
              {fetchLoading ? (
                <div className="col-span-7 py-20 flex justify-center"><Loader2 className="animate-spin text-rose-600" /></div>
              ) : (
                renderCalendar()
              )}
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                 <div className="w-2.5 h-2.5 bg-rose-600 rounded-full"></div> المختار
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                 <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-full"></div> محجوز
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                 <div className="w-3 h-3 bg-slate-50 border border-slate-200 rounded-full"></div> متاح
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-300">
            <div className="text-right">
              <label className="block text-slate-700 font-bold mb-4 mr-2">خيار الاستلام / التوصيل</label>
              <div className="grid grid-cols-2 gap-4">
                {['استلام من المحل', 'توصيل للمنزل'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({...formData, delivery_method: method})}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold ${
                      formData.delivery_method === method 
                      ? 'border-rose-500 bg-rose-50 text-rose-600' 
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
            {formData.delivery_method === 'توصيل للمنزل' && (
              <div className="text-right animate-in slide-in-from-top duration-300">
                <label className="block text-slate-700 font-bold mb-2 mr-2">عنوان التوصيل بالتفصيل</label>
                <textarea 
                  required
                  value={formData.delivery_address}
                  onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
                  placeholder="المدينة، الحي، الشارع، المعالم القريبة..."
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold text-slate-800 h-32"
                />
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-300">
            <div className="text-right">
              <label className="block text-slate-700 font-bold mb-4 mr-2">طريقة الدفع المفضلة</label>
              <div className="space-y-3">
                {['كاش عند الاستلام', 'حوالة بنكية', 'الكريمي لخدمات الدفع'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({...formData, payment_method: method})}
                    className={`w-full p-5 rounded-2xl border-2 transition-all font-bold flex items-center justify-between ${
                      formData.payment_method === method 
                      ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-md' 
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.payment_method === method ? 'border-rose-500' : 'border-slate-300'}`}>
                      {formData.payment_method === method && <div className="w-3 h-3 bg-rose-500 rounded-full" />}
                    </div>
                    <span>{method}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {success ? (
          <div className="p-12 text-center">
            <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 className="text-green-500" size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">تم طلب الحجز بنجاح!</h2>
            <p className="text-slate-500 leading-relaxed text-lg mb-8">
              سنتواصل معكِ هاتفياً خلال 24 ساعة لتأكيد الموعد وتفاصيل التوصيل.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`whatsapp://send?phone=967777512939&text=تم حجز فستان ${dress?.name || ''} وأريد تأكيد الطلب`}
                className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5e] text-white py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95"
              >
                <MessageCircle size={22} />
                تأكيد الحجز عبر واتساب
              </a>
              <a
                href="tel:+967777512939"
                className="flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-800 py-4 rounded-2xl font-black transition-all active:scale-95"
              >
                <Phone size={20} />
                اتصال هاتفي مباشر
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-slate-900 p-4 text-white">
              <div className="flex justify-between items-start">
                <div className="flex-2 text-right">
                  <h2 className="text-xl font-black mb-1">تأكيد الحجز</h2>
                  <p className="text-slate-400 text-xs font-medium">الخطوة {step} من 3</p>
                </div>
                <button 
                  onClick={onClose}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex gap-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 bg-rose-500 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
              </div>
            </div>

            <form onSubmit={handleBooking} className="p-5 space-y-5">
              {/* Step indicator header */}
              <div className="flex items-center gap-3 text-right mb-2">
                <div className="bg-rose-100 text-rose-600 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm">
                  {step === 1 ? '١' : step === 2 ? '٢' : '٣'}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">
                    {step === 1 ? 'متى المناسبة؟' : step === 2 ? 'كيف نصل إليكِ؟' : 'كيف تودين الدفع؟'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">يرجى ملء البيانات بدقة</p>
                </div>
              </div>

              {renderStep()}

              {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100 shadow-sm">
                  <AlertCircle size={20} className="shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                {step > 1 && (
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-sm font-black transition-all"
                  >
                    السابق
                  </button>
                )}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-2xl text-sm font-black shadow-xl shadow-rose-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      {step === 3 ? 'إتمام الطلب النهائي' : 'المتابعة'}
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
