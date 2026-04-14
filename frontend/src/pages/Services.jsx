import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  CheckCircle2
} from 'lucide-react';
import { getServices } from '../api/api';
import MediaRenderer from '../components/MediaRenderer';

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-black text-rose-600 tracking-tighter italic">الملكة</Link>
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-rose-600 font-bold transition-colors">
            <ArrowLeft size={20} /> العودة للرئيسية
          </Link>
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
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="animate-spin text-rose-600" size={64} />
          </div>
        ) : (
          <div className="space-y-12">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white rounded-5xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100 group`}
              >
                {/* Image Section */}
                <div className="lg:w-1/2 relative h-120 overflow-hidden">
                  <MediaRenderer 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-10 right-10 left-10 text-white">
                    <div className="bg-white/20 backdrop-blur-md inline-flex p-4 rounded-3xl mb-4">
                      <ServiceIcon type={service.service_type} size={32} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-black mb-2">{service.service_type}</h3>
                    <p className="text-white/80 font-medium">خدمة متميزة بلمسة ملكية</p>
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
                    <button className="w-full sm:w-auto bg-slate-900 hover:bg-rose-600 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-xl flex items-center gap-3">
                      استفسار وحجز
                      <MessageSquare size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-32 bg-rose-600 rounded-5xl p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              هل لديكِ استفسار عن خدماتنا؟
            </h2>
            <p className="text-xl text-rose-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              نحن هنا لمساعدتكِ في كل خطوة. طاقم العمل لدينا جاهز للرد على جميع استفساراتكِ على مدار الساعة.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-white text-rose-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                <MessageSquare size={24} /> واتساب مباشر
              </button>
              <button className="bg-rose-700 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-rose-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                <Phone size={24} /> اتصلي بنا
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
