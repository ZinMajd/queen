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

const MediaRenderer = ({ src, alt, className }) => {
  if (!src) return <div className={`${className} bg-slate-200 animate-pulse`} />;
  const isVideo = src.toLowerCase().endsWith('.mp4');
  const fullSrc = src.startsWith('http') ? src : `http://localhost:8000${src}`;

  if (isVideo) {
    return (
      <video 
        src={fullSrc} 
        className={className} 
        autoPlay 
        muted 
        loop 
        playsInline
        controls={false}
      />
    );
  }
  return <img src={fullSrc} alt={alt} className={className} />;
};

const DressDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dress, setDress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 max-w-lg">
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
            <div className="sticky top-28 rounded-[3.5rem] overflow-hidden shadow-2xl bg-slate-100 aspect-[3/4] border-8 border-slate-50">
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
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold border border-green-100">
                <ShieldCheck size={18} /> {dress.status} في المعرض
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
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

            {/* Actions */}
            <div className="sticky bottom-6 lg:relative lg:bottom-0 space-y-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-slate-900 hover:bg-rose-600 text-white py-6 rounded-[2rem] text-xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 hover:-translate-y-1 active:scale-95 group"
              >
                <Calendar size={24} className="group-hover:rotate-12 transition-transform" />
                حجز موعد للقياس
              </button>
              
              <div className="flex gap-4">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-5 rounded-[2rem] font-bold transition-all flex items-center justify-center gap-3">
                  <MessageCircle size={20} /> استفسار واتساب
                </button>
                <button className="flex-1 bg-white border-2 border-slate-900 text-slate-900 py-5 rounded-[2rem] font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3">
                  <Phone size={20} /> اتصال هاتفي
                </button>
              </div>
            </div>

            {isModalOpen && (
              <BookingModal 
                dress={dress} 
                onClose={() => setIsModalOpen(false)} 
              />
            )}

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
