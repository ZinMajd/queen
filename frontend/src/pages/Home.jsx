import React, { useEffect, useState } from 'react';
import { Heart, Stars, Camera, Scissors, MapPin, Phone, MessageSquare, Loader2, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategories, logout as logoutApi } from '../api/api';

const MediaRenderer = ({ src, alt, className }) => {
  if (!src) return <div className={`${className} bg-slate-200 animate-pulse`} />;
  const isVideo = src.toLowerCase().endsWith('.mp4');
  const fullSrc = src.startsWith('http') ? src : `http://localhost:8000${src}`;

  if (isVideo) {
    return (
      <video src={fullSrc} className={className} autoPlay muted loop playsInline />
    );
  }
  return <img src={fullSrc} alt={alt} className={className} />;
};

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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Fallback: clear local storage anyway
      localStorage.clear();
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md px-6 py-4 flex justify-between items-center transition-all border-b border-white/10">
        <div className="text-3xl font-black text-white hover:text-rose-400 transition-colors cursor-pointer" onClick={() => navigate('/')}>الملكة</div>
        
        {/* Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-8 text-white font-bold">
          <button onClick={() => navigate('/')} className="hover:text-rose-400 transition-colors">الرئيسية</button>
          <button onClick={() => navigate('/dresses')} className="hover:text-rose-400 transition-colors">الفساتين</button>
          <button onClick={() => navigate('/services')} className="hover:text-rose-400 transition-colors">الخدمات</button>
          <button onClick={() => navigate('/vendors')} className="hover:text-rose-400 transition-colors">مزودي الخدمات</button>
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-rose-400 transition-colors">عن المحل</button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-rose-400 transition-colors">تواصل معنا</button>
        </nav>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-xs text-white/70 font-bold uppercase tracking-tight">أهلاً بكِ</p>
                <p className="text-white font-black">{user.name}</p>
              </div>
              <div className="bg-white/20 p-2.5 rounded-2xl hover:bg-rose-600 text-white transition-all cursor-pointer group relative" onClick={() => navigate('/bookings')}>
                <User size={22} />
                <span className="absolute -bottom-10 right-0 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">حجوزاتي</span>
              </div>
              <button onClick={handleLogout} className="bg-white/10 p-2.5 rounded-2xl hover:bg-rose-600 text-white transition-all">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button onClick={() => navigate('/login')} className="text-white font-bold hover:text-rose-400 transition-colors">تسجيل الدخول</button>
              <button onClick={() => navigate('/register')} className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg active:scale-95">انشاء حساب</button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <MediaRenderer 
            src="/uploads/dresses/واجهه رئيسية.png" 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black mb-8 drop-shadow-2xl tracking-tighter">
            تألقي كالملكة
          </h1>
          <p className="text-xl md:text-3xl mb-12 max-w-3xl mx-auto font-light drop-shadow-xl leading-relaxed">
            اختياركِ الأول لفساتين الزفاف الفاخرة وخدمات التجميل المتكاملة في اليمن
          </p>
          <button 
            onClick={() => navigate('/dresses')}
            className="bg-white text-slate-900 hover:bg-rose-600 hover:text-white px-12 py-5 rounded-[2.5rem] text-xl font-black transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto"
          >
            تصفحي الكولكشن
            <Stars size={24} />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-block bg-rose-50 text-rose-600 px-6 py-2 rounded-full text-sm font-black tracking-widest uppercase mb-8">رسالتنا</div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 leading-tight">جمالكِ في ليلة العمر <br/> هو شغفنا الأول</h2>
          <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto leading-loose font-medium">
            محل "الملكة" ليس مجرد متجر، بل هو رفيقكِ في رحلة التحول الأجمل. نوفر لكِ التصاميم العالمية بروح يمنية أصيلة، مع خدمات احترافية تضمن لكِ الراحة والثقة الكاملة في يومكِ المنشود.
          </p>
        </div>
      </section>

      {/* Occasions / Dynamic Categories */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-right">
              <h2 className="text-5xl font-black text-slate-900 mb-4">اختاري مناسبتكِ</h2>
              <p className="text-xl text-slate-500 font-medium">مجموعات مختارة بعناية لكل لحظة سعيدة</p>
            </div>
            <button onClick={() => navigate('/dresses')} className="text-rose-600 font-black border-b-2 border-rose-600 pb-1 hover:text-rose-700 hover:border-rose-700 transition-all text-lg">عرض كل الأقسام</button>
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
                  className="group cursor-pointer bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 flex flex-col h-[32rem]"
                >
                  <div className="relative h-full overflow-hidden">
                    <MediaRenderer 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
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
                className="group flex flex-col items-center p-12 rounded-[3.5rem] bg-slate-50 hover:bg-white transition-all cursor-pointer border-2 border-transparent hover:border-rose-100 shadow-sm hover:shadow-2xl"
              >
                <div className="bg-white p-8 rounded-3xl mb-8 group-hover:bg-rose-600 group-hover:text-white group-hover:scale-110 transition-all shadow-md group-hover:shadow-rose-200">
                  <service.icon size={48} className="text-rose-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-black text-slate-900 text-2xl mb-2">{service.name}</h3>
                <p className="text-slate-400 font-bold">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 text-white py-24 text-right">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-4xl font-black mb-8 italic text-rose-600 tracking-tighter">الملكة</h3>
            <p className="text-slate-400 text-xl leading-relaxed max-w-md font-medium">
              الوجهة رقم #1 للعروس في اليمن. نجمع بين التراث والحداثة لنصنع لكِ أجمل ذكريات العمر.
            </p>
          </div>
          <div>
            <h4 className="text-2xl font-black mb-8 border-r-4 border-rose-600 pr-4">روابط سريعة</h4>
            <ul className="space-y-6 text-slate-400 text-lg font-bold">
              <li><a href="#" className="hover:text-rose-600 transition-colors">عن المحل</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors" onClick={() => navigate('/dresses')}>تصفح الفساتين</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors" onClick={() => navigate('/services')}>خدماتنا</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">تواصل معنا</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-black mb-8 border-r-4 border-rose-600 pr-4">تواصلي معنا</h4>
            <div className="space-y-6">
              <button className="w-full flex items-center justify-between gap-4 bg-green-600/10 text-green-500 border border-green-600/20 px-6 py-4 rounded-2xl hover:bg-green-600 hover:text-white transition-all font-black">
                <span>واتساب مباشر</span>
                <MessageSquare size={24} />
              </button>
              <button className="w-full flex items-center justify-between gap-4 bg-blue-600/10 text-blue-500 border border-blue-600/20 px-6 py-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all font-black">
                <span>اتصال هاتفي</span>
                <Phone size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-900 mt-24 pt-12 text-center text-slate-600 font-bold">
          <p>&copy; {new Date().getFullYear()} الملكة لفساتين الزفاف. صُنع بكل حب لجعل ليلتكِ أجمل.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
