import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  ArrowLeft, 
  Stars, 
  Camera, 
  Scissors, 
  MapPin, 
  Phone, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Filter,
  Search,
  X,
  Star,
  ChevronRight,
  User,
  Heart
} from 'lucide-react';
import { getServices, toggleFavorite } from '../api/api';
import MediaRenderer from '../components/MediaRenderer';
import WhatsAppPopup from '../components/WhatsAppPopup';

const ServiceIcon = ({ type, size = 24, className = "" }) => {
  switch (type) {
    case 'تجميل ومكياج': return <Stars size={size} className={className} />;
    case 'تصوير احترافي': return <Camera size={size} className={className} />;
    case 'منسق حفلات': return <MapPin size={size} className={className} />;
    default: return <Scissors size={size} className={className} />;
  }
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    service_type: '',
    min_rating: ''
  });
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [whatsappMsg, setWhatsappMsg] = useState('');

  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== "undefined") {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
    }
    return null;
  });

  const handleFavoriteToggle = async (e, serviceId) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await toggleFavorite('service', serviceId);
      setServices(services.map(s => {
        if (s.id === serviceId) {
          const isAdded = response.data.status === 'added';
          return { 
             ...s, 
             favorites_count: response.data.favorite_count,
             is_favorited: isAdded
          };
        }
        return s;
      }));
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchServices = useCallback(async (page = 1) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    
    try {
      const queryParams = {
          page,
          ...(searchTerm ? { search: searchTerm } : {}),
          ...(filters.service_type ? { service_type: filters.service_type } : {}),
          ...(filters.min_rating ? { min_rating: filters.min_rating } : {})
      };
      const response = await getServices(queryParams);
      
      if (page === 1) {
        setServices(response?.data?.data || []);
      } else {
        setServices(prev => [...prev, ...(response?.data?.data || [])]);
      }
      
      setPagination({
        current_page: response?.data?.current_page || 1,
        last_page: response?.data?.last_page || 1
      });
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        fetchServices(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchServices]);

  const handleLoadMore = () => {
    if (pagination.current_page < pagination.last_page) {
      fetchServices(pagination.current_page + 1);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header / Search Area */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
            <Link to="/" className="text-3xl font-black text-rose-600 tracking-tighter italic">الملكة</Link>
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-rose-600 font-bold transition-colors">
              <ArrowLeft size={20} /> العودة للرئيسية
            </Link>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="ابحثي عن خدمة (كوافير، تصوير...)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 rounded-2xl py-3 pr-12 pl-4 outline-none border-2 border-transparent focus:border-rose-500 focus:bg-white transition-all font-bold text-right"
                />
                <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute left-4 top-3.5 text-slate-400 hover:text-rose-600"><X size={20} /></button>
                )}
            </div>
            {user && (
              <div className="flex items-center gap-3 shrink-0">
                <div 
                  className="w-10 h-10 rounded-xl overflow-hidden cursor-pointer border-2 border-slate-100 hover:border-rose-500 transition-all shadow-sm"
                  onClick={() => navigate('/profile')}
                >
                  {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <User size={20} />
                      </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl text-xs font-black tracking-widest uppercase mb-6">
            <Sparkles size={16} /> خدماتنا المتكاملة
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
            نعتني بكل تفاصيل <span className="text-rose-600">ليلة العمر</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            في "الملكة"، لا نوفر لكِ الفستان فحسب، بل نرافقكِ في رحلة الجمال المتكاملة من المكياج الاحترافي وتنسيق القاعات وحتى تخليد اللحظة بالتصوير.
          </p>

          <div className="mt-12 overflow-x-auto no-scrollbar pb-4 flex justify-center gap-4">
            <button 
              onClick={() => setFilters({...filters, service_type: ''})}
              className={`px-8 py-3 rounded-2xl whitespace-nowrap transition-all font-black text-sm uppercase tracking-widest shadow-lg ${!filters.service_type ? 'bg-rose-600 text-white scale-105' : 'bg-white text-slate-500 border border-slate-100 hover:border-rose-200'}`}
            >
              الكل
            </button>
            {['تجميل ومكياج', 'تصوير احترافي', 'منسق حفلات'].map((type) => (
              <button 
                key={type}
                onClick={() => setFilters({...filters, service_type: type})}
                className={`px-8 py-3 rounded-2xl whitespace-nowrap transition-all font-black text-sm uppercase tracking-widest shadow-lg ${filters.service_type === type ? 'bg-rose-600 text-white scale-105' : 'bg-white text-slate-500 border border-slate-100 hover:border-rose-200'}`}
              >
                {type}
              </button>
            ))}
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl border transition-all active:scale-95 shadow-lg font-black text-sm
                ${showFilters || filters.min_rating ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                `}
            >
                <Filter size={18} /> تصفية إضافية
            </button>
          </div>

          {showFilters && (
              <div className="mt-8 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-300 max-w-xl mx-auto">
                    <div className="text-right">
                        <label className="block text-slate-700 font-black mb-3 text-xs uppercase tracking-widest">التقييم الأدنى</label>
                        <select 
                            value={filters.min_rating}
                            onChange={(e) => setFilters({...filters, min_rating: e.target.value})}
                            className="w-full bg-slate-50 rounded-2xl py-4 px-6 outline-none border-2 border-transparent focus:bg-white focus:border-rose-500 transition-all font-bold"
                        >
                            <option value="">أي تقييم</option>
                            <option value="4">4 نجوم فأعلى</option>
                            <option value="3">3 نجوم فأعلى</option>
                            <option value="2">2 نجوم فأعلى</option>
                        </select>
                    </div>
              </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="animate-spin text-rose-600" size={64} />
          </div>
        ) : (
          <div className="space-y-12">
            {Array.isArray(services) && services.map((service, index) => (
              <div 
                key={service.id} 
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100 group`}
              >
                {/* Image Section */}
                <div className="lg:w-1/2 relative h-96 overflow-hidden">
                  <MediaRenderer 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-10 right-10 left-10 text-white">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="bg-white bg-opacity-20 inline-flex p-4 rounded-3xl mb-4">
                                <ServiceIcon type={service.service_type} size={30} className="text-white" />
                            </div>
                            <h3 className="text-3xl font-black mb-2">{service.service_type}</h3>
                            <p className="text-white text-opacity-80 font-medium">خدمة متميزة بلمسة ملكية</p>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                             <button 
                                onClick={(e) => handleFavoriteToggle(e, service.id)}
                                className="p-4 rounded-full bg-white bg-opacity-10 border border-white border-opacity-20 hover:bg-white hover:text-rose-600 transition-all shadow-2xl"
                             >
                                <Heart size={24} className={service.is_favorited ? 'fill-rose-500 text-rose-500' : 'text-white'} />
                             </button>
                             <div className="bg-slate-900 bg-opacity-60 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 border border-white border-opacity-10">
                                <Heart size={10} className="fill-rose-500 text-rose-500" /> {service.favorites_count || 0}
                             </div>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center text-right">
                  <div className="mb-8">
                    <h2 className="text-4xl font-black text-slate-900 mb-6 group-hover:text-rose-600 transition-colors">
                      {service.name}
                    </h2>
                    <p className="text-lg text-slate-500 leading-relaxed mb-8 italic">
                      "{service.description}"
                    </p>
                  </div>

                  <div className="space-y-6 mb-12">
                    <div className="flex items-center gap-4 justify-end text-slate-700 font-bold">
                      <span>فريق عمل متخصص ذو كفاءة عالية</span>
                      <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                    <div className="flex items-center gap-4 justify-end text-slate-700 font-bold">
                      <span>أسعار تنافسية وباقات مرنة</span>
                      <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                    <div className="flex items-center gap-4 justify-end text-slate-700 font-bold">
                      <span>استخدام أفضل الأدوات والمستحضرات العالمية</span>
                      <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
                    <div className="text-3xl font-black text-rose-600 ml-auto order-last sm:order-first">
                      تبدأ من {service.price}$
                    </div>
                    <button 
                      onClick={() => { setWhatsappMsg(`استفسار عن خدمة: ${service.name}`); setWhatsappOpen(true); }}
                      className="w-full sm:w-auto bg-slate-900 hover:bg-rose-600 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-xl flex items-center gap-3"
                    >
                      استفسار وحجز
                      <MessageSquare size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pagination.current_page < pagination.last_page && (
              <div className="flex justify-center mt-20">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-white text-rose-600 border-2 border-rose-600 px-12 py-5 rounded-3xl font-black shadow-xl hover:bg-rose-600 hover:text-white transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      تحميل المزيد من الخدمات
                      <ChevronRight className="rotate-90" size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-32 bg-rose-600 rounded-3xl p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              هل لديكِ استفسار عن خدماتنا؟
            </h2>
            <p className="text-xl text-rose-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              نحن هنا لمساعدتكِ في كل خطوة. طاقم العمل لدينا جاهز للرد على جميع استفساراتكِ على مدار الساعة.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => { setWhatsappMsg('تواصل مع خدمات الملكة'); setWhatsappOpen(true); }}
                className="bg-white text-rose-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
              >
                <MessageSquare size={24} /> واتساب مباشر
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <WhatsAppPopup
      isOpen={whatsappOpen}
      onClose={() => setWhatsappOpen(false)}
      message={whatsappMsg}
    />
    </>
  );
};

export default Services;
