import React, { useEffect, useState } from 'react';
import { 
  Heart, 
  Stars, 
  Camera, 
  Scissors, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Loader2, 
  User, 
  LogOut, 
  Sparkles,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategories, logout as logoutApi } from '../api/api';
import MediaRenderer from '../components/MediaRenderer';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.clear();
      setUser(null);
      navigate('/login');
    } catch (err) {
      localStorage.clear();
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans" dir="rtl">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg px-6 py-5 flex justify-between items-center transition-all border-b border-white/10">
        <div className="text-3xl font-black text-white hover:text-rose-400 transition-colors cursor-pointer tracking-tighter" onClick={() => navigate('/')}>الملكة</div>
        
        <nav className="hidden lg:flex items-center gap-10 text-white font-bold text-sm uppercase tracking-widest">
          <button onClick={() => navigate('/')} className="hover:text-rose-400 border-b-2 border-rose-500 pb-1 flex items-center gap-2 animate-pulse"><Sparkles size={16}/> الرئيسية</button>
          <button onClick={() => navigate('/dresses')} className="hover:text-rose-400 transition-colors">الفساتين</button>
          <button onClick={() => navigate('/services')} className="hover:text-rose-400 transition-colors">الخدمات</button>
          <button onClick={() => navigate('/vendors')} className="hover:text-rose-400 transition-colors">مزودينا</button>
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-rose-400 transition-colors">عن المحل</button>
        </nav>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2.5 rounded-2xl hover:bg-rose-600 text-white transition-all cursor-pointer group relative" onClick={() => navigate('/bookings')}>
                <User size={22} />
              </div>
              <button onClick={handleLogout} className="bg-rose-600/20 p-2.5 rounded-2xl hover:bg-rose-700 text-rose-400 transition-all border border-rose-500/30">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button onClick={() => navigate('/login')} className="text-white font-black hover:text-rose-400 transition-colors px-4">دخول</button>
              <button onClick={() => navigate('/register')} className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/40 active:scale-95">انضمي إلينا</button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <MediaRenderer 
            src="/uploads/dresses/واجهه رئيسية.png" 
            className="w-full h-full object-contain scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/80"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <div className="bg-rose-600/20 backdrop-blur-sm border border-rose-400/20 inline-block px-6 py-2 rounded-full text-xs font-black tracking-[0.2em] mb-8">
             وجهة العروس الأولى في اليمن
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-10 drop-shadow-2xl tracking-tighter leading-tight italic">
            تألقي كالملكة
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium text-white/80 leading-relaxed">
            اجعلي ليلة حلمكِ ذكرى لا تُنسى مع مجموعتنا الفاخرة وخدماتنا المتكاملة
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             {!user && (
                <>
                   <button 
                     onClick={() => navigate('/register')}
                     className="w-full sm:w-auto bg-rose-600 text-white px-12 py-5 rounded-3xl text-xl font-black transition-all shadow-2xl hover:bg-rose-700 active:scale-95"
                   >
                     ابدئي رحلتكِ معنا
                   </button>
                   <button 
                     onClick={() => navigate('/login')}
                     className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-3xl text-xl font-black transition-all hover:bg-white/20"
                   >
                     تسجيل الدخول
                   </button>
                </>
             )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-8">
            <div className="w-24 h-1 bg-rose-600 rounded-full"></div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">حيث تلتقي الفخامة <br/> بجمال التراث</h2>
            <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto leading-loose font-medium">
              في "الملكة"، نؤمن أن كل عروس تستحق أن تكون أيقونة للجمال في أغلى لياليها. نحن هنا لنقدم لكِ أكثر من مجرد فستان؛ نحن نقدم لكِ الثقة والإشراق عبر فريق محترف وتشكيلة عالمية الفريدة.
            </p>
          </div>
        </div>
      </section>

      {/* Occasions / Dynamic Categories Grid */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-right grow border-r-8 border-rose-600 pr-8">
              <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">اختاري مناسبتـكِ</h2>
              <p className="text-xl text-slate-400 font-bold uppercase tracking-widest">مجموعات مصممة لكل لحظة سعيدة</p>
            </div>
            <button onClick={() => navigate('/dresses')} className="text-rose-600 font-black border-b-2 border-rose-600 pb-1 hover:text-rose-700 hover:border-rose-700 transition-all text-lg tracking-widest uppercase">عرض الكل</button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-rose-600" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {categories.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/dresses/${item.id}`)}
                  className="group cursor-pointer bg-white rounded-5xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 flex flex-col h-128"
                >
                  <div className="relative h-full overflow-hidden">
                    <MediaRenderer 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                    <div className="absolute bottom-8 right-8 text-white">
                      <h3 className="text-3xl font-black uppercase mb-2">{item.name}</h3>
                      <button className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all -translate-y-4 group-hover:translate-y-0">اكتشفي الآن</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-black text-slate-800 mb-20 leading-tight">خدمات الملكة الفاخرة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { name: 'فساتين زفاف', icon: Scissors, desc: 'أحدث الصيحات العالمية' },
              { name: 'كوافير وتجميل', icon: Stars, desc: 'إطلالة ملكية ساحرة' },
              { name: 'تصوير احترافي', icon: Camera, desc: 'تخليد أجمل اللحظات' },
              { name: 'منسق حفلات', icon: MapPin, desc: 'فخامة التنفيذ والديكور' }
            ].map((service, index) => (
              <div 
                key={index} 
                onClick={() => navigate('/services')}
                className="group flex flex-col items-center p-12 rounded-5xl bg-slate-50 hover:bg-white transition-all cursor-pointer border-2 border-transparent hover:border-rose-100 shadow-sm hover:shadow-2xl"
              >
                <div className="bg-white p-8 rounded-3xl mb-8 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <service.icon size={48} className="text-rose-600 group-hover:text-white" />
                </div>
                <h3 className="font-black text-slate-900 text-2xl mb-2">{service.name}</h3>
                <p className="text-slate-400 font-bold">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 text-white py-32 text-right">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-5xl font-black mb-10 italic text-rose-600 tracking-tighter">الملكة</h3>
            <p className="text-slate-400 text-xl leading-relaxed max-w-md font-medium">
               شريككِ المثالي لكل ليلة فخر واعتزاز. نضمن لكِ التميز في أدق التفاصيل.
            </p>
          </div>
          <div>
            <h4 className="text-2xl font-black mb-10 border-r-4 border-rose-600 pr-4">روابط سريعة</h4>
            <ul className="space-y-6 text-slate-400 text-lg font-bold">
              <li><button onClick={() => navigate('/dresses')} className="hover:text-rose-600 transition-colors">فساتين الزفاف</button></li>
              <li><button onClick={() => navigate('/services')} className="hover:text-rose-600 transition-colors">خدمات التجميل</button></li>
              <li><button onClick={() => navigate('/vendors')} className="hover:text-rose-600 transition-colors">مزودي الخدمات</button></li>
               <li><button onClick={() => navigate('/register')} className="hover:text-rose-600 transition-colors">انضمي إلينا</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-black mb-10 border-r-4 border-rose-600 pr-4">تواصل مباشر</h4>
            <div className="space-y-6">
              <button className="w-full flex items-center justify-between gap-4 bg-green-600 text-white px-8 py-5 rounded-3xl hover:bg-green-700 transition-all font-black shadow-xl">
                <span>واتساب الملكة</span>
                <MessageSquare size={24} />
              </button>
              <button className="w-full flex items-center justify-between gap-4 bg-slate-800 text-white px-8 py-5 rounded-3xl hover:bg-rose-600 transition-all font-black shadow-xl">
                <span>اتصال هاتفي</span>
                <Phone size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-900 mt-32 pt-12 text-center text-slate-600 font-bold">
          <p>&copy; {new Date().getFullYear()} الملكة لفساتين الزفاف. صُنع بفخر وشغف.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
