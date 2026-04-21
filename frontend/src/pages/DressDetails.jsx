import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ArrowLeft, 
  Loader2, 
  ShoppingBag, 
  Calendar, 
  Share2, 
  ShieldCheck, 
  Info,
  ChevronRight,
  MessageCircle,
  Phone,
  Scissors
} from 'lucide-react';
import { getDress } from '../api/api';
import BookingModal from '../components/BookingModal';
import MediaRenderer from '../components/MediaRenderer';
import WhatsAppPopup from '../components/WhatsAppPopup';

const DressDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dress, setDress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState('rent');
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [whatsappMsg, setWhatsappMsg] = useState('');

  useEffect(() => {
    const fetchDress = async () => {
      try {
        const response = await getDress(id);
        setDress(response.data);
      } catch (error) {
        console.error('Error fetching dress details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDress();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <Loader2 className="animate-spin text-rose-600" size={64} />
      </div>
    );
  }

  if (!dress) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 text-center px-6">
        <div className="bg-white p-12 rounded-5xl shadow-xl border border-slate-100 max-w-lg">
          <Info className="mx-auto text-slate-200 mb-6" size={80} />
          <h2 className="text-3xl font-black text-slate-800 mb-4">عذراً، الفستان غير موجود</h2>
          <p className="text-slate-500 mb-8">ربما تم حذف الفستان أو المسار غير صحيح.</p>
          <Link to="/dresses" className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg inline-block">عودة للتصفح</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-800 hover:text-rose-600 transition-colors font-bold"
          >
            <ArrowLeft size={20} /> عودة
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-all border border-slate-100">
              <Share2 size={20} />
            </button>
            <button className="p-2.5 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-all border border-slate-100">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Media Section */}
          <div className="relative group">
            <div className="sticky top-28 rounded-5xl overflow-hidden shadow-2xl bg-slate-100 aspect-3/4 border-8 border-slate-50">
              <MediaRenderer 
                src={dress.image} 
                alt={dress.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute top-8 right-8">
                <span className="bg-rose-600 text-white px-8 py-2 rounded-2xl text-xs font-black shadow-2xl tracking-[0.2em] uppercase">
                  {dress.type}
                </span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col text-right">
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 justify-end">
              <Link to="/" className="hover:text-rose-600">الرئيسية</Link>
              <ChevronRight size={14} />
              <Link to="/dresses" className="hover:text-rose-600">الفساتين</Link>
              <ChevronRight size={14} />
              <span className="text-slate-900 font-bold">{dress.name}</span>
            </nav>

            <div className="mb-10">
              <span className="text-rose-500 font-black uppercase tracking-widest block mb-2">{dress.category?.name}</span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                {dress.name}
              </h1>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${dress.bookings_count > 0 ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                <ShieldCheck size={18} /> {dress.bookings_count > 0 ? 'محجوز حالياً' : 'متاح في المعرض'}
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <div className="bg-slate-50 p-8 rounded-4xl border border-slate-100 shadow-sm">
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  "{dress.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-2">المقاسات المتوفرة</p>
                  <p className="text-slate-900 font-black text-xl">{dress.size}</p>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-2">نوع التصميم</p>
                  <p className="text-slate-900 font-black text-xl">{dress.type}</p>
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex gap-4 mb-8">
              {dress.is_for_rent && (
                <div className="flex-1 bg-blue-50 border border-blue-100 p-6 rounded-3xl">
                   <p className="text-blue-400 text-xs font-bold uppercase mb-1">سعر الإيجار</p>
                   <p className="text-blue-900 font-black text-2xl">{dress.rent_price || 'يتحدد في الواتساب'}</p>
                </div>
              )}
              {dress.is_for_sale && (
                <div className="flex-1 bg-green-50 border border-green-100 p-6 rounded-3xl">
                   <p className="text-green-400 text-xs font-bold uppercase mb-1">سعر البيع</p>
                   <p className="text-green-900 font-black text-2xl">{dress.sale_price || 'يتحدد في الواتساب'}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-6 lg:relative lg:bottom-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dress.is_for_rent && (
                  <button 
                    onClick={() => { setBookingType('rent'); setIsModalOpen(true); }}
                    disabled={dress.bookings_count > 0}
                    className={`flex-1 py-6 rounded-4xl text-xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 group ${
                      dress.bookings_count > 0 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-900 hover:bg-rose-600 text-white hover:-translate-y-1'
                    }`}
                  >
                    <Calendar size={24} className={dress.bookings_count > 0 ? '' : 'group-hover:rotate-12 transition-transform'} />
                    {dress.bookings_count > 0 ? 'محجوز حالياً' : 'حجز للإيجار'}
                  </button>
                )}
                
                {dress.is_for_sale && (
                  <button 
                    onClick={() => { setBookingType('sale'); setIsModalOpen(true); }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 rounded-4xl text-xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 hover:-translate-y-1"
                  >
                    <ShoppingBag size={24} /> شراء الفستان
                  </button>
                )}
              </div>
              
              <button 
                onClick={() => { setWhatsappMsg(`استفسار عن فستان: ${dress.name}`); setWhatsappOpen(true); }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-3xl font-bold transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <MessageCircle size={20} /> استفسار عام عبر واتساب
              </button>
            </div>

            {isModalOpen && (
              <BookingModal 
                dress={dress} 
                type={bookingType}
                onClose={() => setIsModalOpen(false)} 
              />
            )}

            <WhatsAppPopup
              isOpen={whatsappOpen}
              onClose={() => setWhatsappOpen(false)}
              message={whatsappMsg}
            />

            {/* Extra Info */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-12">
              {[
                { title: 'غسيل وكوي', desc: 'خدمة احترافية مجانية قبل الاستلام', icon: ShoppingBag },
                { title: 'تعديلات دقيقة', desc: 'إمكانية تعديل المقاس حسب الطلب', icon: Scissors },
                { title: 'حجز مؤكد', desc: 'ضمان نظافة وجودة الفستان', icon: ShieldCheck },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="bg-slate-50 p-4 rounded-2xl mb-4 text-rose-600">
                    <item.icon size={24} />
                  </div>
                  <h4 className="font-black text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DressDetails;
