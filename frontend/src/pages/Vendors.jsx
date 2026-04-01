import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Award, ShieldCheck, MapPin } from 'lucide-react';

const Vendors = () => {
  const vendors = [
    {
      id: 1,
      name: "صالون لمسات سحرية",
      category: "تجميل ومكياج",
      rating: 4.9,
      reviews: 128,
      location: "صنعاء - حدة",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: 2,
      name: "ستوديو ذكرياتنا",
      category: "تصوير احترافي",
      rating: 4.8,
      reviews: 95,
      location: "عدن - خورمكسر",
      image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: 3,
      name: "رويال للافراح",
      category: "منسق حفلات",
      rating: 5.0,
      reviews: 210,
      location: "صنعاء - الحصبة",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    }
  ];

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
            <ShieldCheck size={16} /> شركاء النجاح
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
            نخبة من <span className="text-rose-600">أفضل مزودي الخدمات</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            تعرفي على أفضل الصالونات، المصورين، ومنسقي الحفلات المعتمدين لدى منصة الملكة لضمان جودة استثنائية في يومك المميز.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={vendor.image} 
                  alt={vendor.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
                {vendor.featured && (
                  <div className="absolute top-6 right-6 bg-rose-600 text-white px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                    <Award size={14} /> موثوق
                  </div>
                )}
                <div className="absolute bottom-6 right-6 text-white text-right">
                  <div className="text-sm font-bold bg-white/20 backdrop-blur-md inline-block px-3 py-1 rounded-lg mb-2">
                    {vendor.category}
                  </div>
                </div>
              </div>
              
              <div className="p-8 text-right">
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-rose-600 transition-colors">{vendor.name}</h3>
                
                <div className="flex items-center justify-end gap-6 mb-6 text-slate-500">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-slate-700">{vendor.rating}</span>
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs">({vendor.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <span>{vendor.location}</span>
                    <MapPin size={16} className="text-slate-400" />
                  </div>
                </div>

                <button className="w-full bg-slate-50 hover:bg-rose-600 text-slate-900 hover:text-white py-4 rounded-xl font-black transition-colors">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vendors;
