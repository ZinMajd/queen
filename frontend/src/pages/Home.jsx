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
    } catch {
      localStorage.clear();
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans" dir="rtl">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brand-gold px-6 py-5 flex justify-between items-center transition-all border-b border-black/10 shadow-sm">
        <div className="text-4xl font-black text-black drop-shadow-sm cursor-pointer tracking-tighter" onClick={() => navigate('/')}>الملكة</div>
        
        <nav className="hidden lg:flex items-center gap-10 text-black/80 font-bold text-sm uppercase tracking-widest">
          <button onClick={() => navigate('/')} className="cursor-pointer hover:text-white transition-colors">الرئيسية</button>
          <button onClick={() => navigate('/dresses')} className="cursor-pointer hover:text-white transition-colors">الفساتين</button>
          <button onClick={() => navigate('/services')} className="cursor-pointer hover:text-white transition-colors">الخدمات</button>
          <button onClick={() => navigate('/vendors')} className="cursor-pointer hover:text-white transition-colors">مزودينا</button>
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer hover:text-white transition-colors">عن المحل</button>
        </nav>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="bg-white/40 p-2.5 rounded-2xl hover:bg-white text-black transition-all cursor-pointer group relative" onClick={() => navigate('/bookings')}>
                <User size={22} />
              </div>
              <button onClick={handleLogout} className="bg-white/20 p-2.5 rounded-2xl hover:bg-white text-black transition-all border border-black/10">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button onClick={() => navigate('/login')} className="text-black/80 font-black hover:text-white transition-colors px-4">دخول</button>
              <button onClick={() => navigate('/register')} className="bg-white text-black px-8 py-3 rounded-2xl font-black hover:bg-white/90 transition-all shadow-md active:scale-95">انضمي إلينا</button>
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
          <div className="absolute inset-0 bg-pink-300/10"></div>
        </div>
        


        <div className="absolute bottom-16 left-0 right-0 z-20 px-4 flex flex-col sm:flex-row items-center justify-center gap-6">
             {!user && (
                <>
                    <button 
                      onClick={() => navigate('/register')}
                      className="w-full sm:w-auto bg-brand-gold text-black px-12 py-5 rounded-3xl text-xl font-black transition-all shadow-2xl hover:bg-black hover:text-white active:scale-95"
                    >
                      ابدئي رحلتكِ معنا
                    </button>
                   <button 
                     onClick={() => navigate('/login')}
                     className="w-full sm:w-auto bg-brand-gold text-black px-12 py-5 rounded-3xl text-xl font-black transition-all shadow-2xl hover:bg-black hover:text-white active:scale-95"
                   >
                     تسجيل الدخول
                   </button>
                </>
             )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-8">
            <span className="text-brand-red font-black text-3xl tracking-widest">عن المحل</span>
            <div className="w-24 h-1 bg-brand-gold rounded-full"></div>
            <h2 className="text-4xl md:text-6xl font-black text-black leading-tight">حيث تلتقي الفخامة <br/> بجمال التراث</h2>
            <p className="text-xl md:text-2xl text-black/70 max-w-4xl mx-auto leading-loose font-bold">
              اجعلي ليلة حلمكِ ذكرى لا تُنسى مع مجموعتنا الفاخرة وخدماتنا المتكاملة. في "الملكة"، نؤمن أن كل عروس تستحق أن تكون أيقونة للجمال في أغلى لياليها. نحن هنا لنقدم لكِ أكثر من مجرد فستان؛ نحن نقدم لكِ الثقة والإشراق عبر فريق محترف وتشكيلة عالمية الفريدة.
            </p>
          </div>
        </div>
      </section>

      {/* Occasions / Dynamic Categories Grid */}
      <section className="py-32 bg-brand-cream/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-brand-red drop-shadow-md tracking-tighter leading-tight italic">تألقي كالملكة</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-right grow border-r-8 border-brand-red pr-8">
              <h3 className="text-5xl font-black text-black mb-4 tracking-tight">اختاري مناسبتـكِ</h3>
              <p className="text-xl text-brand-gold-dark font-bold uppercase tracking-widest">مجموعات مصممة لكل لحظة سعيدة</p>
            </div>
            <button onClick={() => navigate('/dresses')} className="text-brand-red font-black border-b-2 border-brand-red pb-1 hover:text-brand-red/80 hover:border-brand-red/80 transition-all text-lg tracking-widest uppercase">عرض الكل</button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-brand-red" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {categories.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/dresses/${item.id}`)}
                  className="group cursor-pointer bg-white rounded-5xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-brand-gold/10 flex flex-col h-128"
                >
                  <div className="relative h-full overflow-hidden">
                    <MediaRenderer 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-white/60 via-white/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity"></div>
                    <div className="absolute bottom-8 right-8 text-black">
                      <h3 className="text-3xl font-black uppercase mb-2">{item.name}</h3>
                      <button className="bg-black/10 backdrop-blur-md px-6 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all -translate-y-4 group-hover:translate-y-0 text-black">اكتشفي الآن</button>
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
          <h2 className="text-5xl font-black text-black mb-20 leading-tight">خدمات الملكة الفاخرة</h2>
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
                className="group flex flex-col items-center p-12 rounded-5xl bg-brand-cream/40 hover:bg-white transition-all cursor-pointer border-2 border-transparent hover:border-rose-100 shadow-sm hover:shadow-2xl"
              >
                <div className="bg-white p-8 rounded-3xl mb-8 group-hover:bg-brand-red group-hover:text-white transition-all">
                  <service.icon size={48} className="text-brand-red group-hover:text-white" />
                </div>
                <h3 className="font-black text-black text-2xl mb-2">{service.name}</h3>
                <p className="text-brand-gold-dark font-bold">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-brand-gold text-black py-32 text-right">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-5xl font-black mb-10 italic text-white tracking-tighter drop-shadow-md">الملكة</h3>
            <p className="text-black/80 text-xl leading-relaxed max-w-md font-medium">
               شريككِ المثالي لكل ليلة فخر واعتزاز. نضمن لكِ التميز في أدق التفاصيل.
            </p>
          </div>
          <div>
            <h4 className="text-2xl font-black mb-10 border-r-4 border-white pr-4 text-white drop-shadow-sm">روابط سريعة</h4>
            <ul className="space-y-6 text-black/80 text-lg font-bold">
              <li><button onClick={() => navigate('/dresses')} className="hover:text-white transition-colors">فساتين الزفاف</button></li>
              <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">خدمات التجميل</button></li>
              <li><button onClick={() => navigate('/vendors')} className="hover:text-white transition-colors">مزودي الخدمات</button></li>
               <li><button onClick={() => navigate('/register')} className="hover:text-white transition-colors">انضمي إلينا</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-black mb-10 border-r-4 border-white pr-4 text-white drop-shadow-sm">تواصل مباشر</h4>
            <div className="space-y-6">
              <button className="w-full flex items-center justify-between gap-4 bg-green-600 text-white px-8 py-5 rounded-3xl hover:bg-green-700 transition-all font-black shadow-xl">
                <span>واتساب الملكة</span>
                <MessageSquare size={24} />
              </button>
              <button className="w-full flex items-center justify-between gap-4 bg-white/40 text-black px-8 py-5 rounded-3xl hover:bg-white transition-all font-black shadow-xl">
                <span>اتصال هاتفي</span>
                <Phone size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-black/10 mt-32 pt-12 text-center text-black/60 font-bold">
          <p>&copy; {new Date().getFullYear()} الملكة لفساتين الزفاف. صُنع بفخر وشغف.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
