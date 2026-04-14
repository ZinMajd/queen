import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Filter, ArrowRight, ArrowLeft, Loader2, Search, X } from 'lucide-react';
import { getDresses, getCategories } from '../api/api';
import MediaRenderer from '../components/MediaRenderer';

const DressList = () => {
  const { categoryId } = useParams();
  const [dresses, setDresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryId || 'all');

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    size: '',
    status: ''
  });

  useEffect(() => {
    if (categoryId) {
        setActiveCategory(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = {
            ...(activeCategory !== 'all' ? { category_id: activeCategory } : {}),
            ...(searchTerm ? { search: searchTerm } : {}),
            ...(filters.type ? { type: filters.type } : {}),
            ...(filters.size ? { size: filters.size } : {}),
            ...(filters.status ? { status: filters.status } : {})
        };

        const [dressesRes, categoriesRes] = await Promise.all([
          getDresses(queryParams),
          getCategories()
        ]);
        setDresses(dressesRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [activeCategory, searchTerm, filters]);

  return (
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
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحثي عن فستان أحلامك..." 
              className="w-full pr-12 pl-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute left-4 top-3.5 text-slate-400 hover:text-rose-500"
              >
                <X size={20} />
              </button>
            )}
            <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
          </div>
        </div>
        
        {/* Categories Bar */}
        <div className="container mx-auto px-6 py-3 overflow-x-auto no-scrollbar flex gap-4 border-t border-slate-50">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-8 py-2 rounded-xl whitespace-nowrap transition-all font-semibold ${activeCategory === 'all' ? 'bg-rose-600 text-white shadow-xl scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'}`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id.toString())}
              className={`px-8 py-2 rounded-xl whitespace-nowrap transition-all font-semibold ${activeCategory === cat.id.toString() ? 'bg-rose-600 text-white shadow-xl scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div className="text-right">
            <p className="text-rose-600 font-bold mb-2 tracking-widest uppercase">مجموعتنا الفاخرة</p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                {activeCategory === 'all' ? 'جميع الفساتين' : categories.find(c => c.id.toString() === activeCategory)?.name}
            </h1>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all active:scale-95 shadow-sm
              ${showFilters || Object.values(filters).some(v => v) ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
            `}
          >
            <Filter size={18} /> تصفية النتائج
            {Object.values(filters).filter(v => v).length > 0 && (
              <span className="bg-white text-rose-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black mr-2">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Section Dropdown */}
        {showFilters && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row gap-6">
            <div className="flex-1 text-right">
              <label className="block text-slate-700 font-bold mb-2">نوع الفستان</label>
              <select 
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full bg-slate-100 rounded-xl py-3 px-4 outline-none border-2 border-transparent focus:bg-white focus:border-rose-500 transition-all font-semibold"
              >
                <option value="">الكل</option>
                <option value="ملكي">ملكي</option>
                <option value="ناعم">ناعم</option>
                <option value="منفوش">منفوش</option>
                <option value="حورية البحر">حورية البحر</option>
                <option value="كلاسيكي">كلاسيكي</option>
                <option value="تراثي">تراثي</option>
              </select>
            </div>
            
            <div className="flex-1 text-right">
              <label className="block text-slate-700 font-bold mb-2">المقاس</label>
              <select 
                value={filters.size}
                onChange={(e) => setFilters({...filters, size: e.target.value})}
                className="w-full bg-slate-100 rounded-xl py-3 px-4 outline-none border-2 border-transparent focus:bg-white focus:border-rose-500 transition-all font-semibold"
              >
                <option value="">الكل</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="مفصل">مفصل (Custom)</option>
              </select>
            </div>

            <div className="flex-1 text-right">
              <label className="block text-slate-700 font-bold mb-2">تاريخ التوفر</label>
              <select 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full bg-slate-100 rounded-xl py-3 px-4 outline-none border-2 border-transparent focus:bg-white focus:border-rose-500 transition-all font-semibold"
              >
                <option value="">الكل</option>
                <option value="متاح">متاح</option>
                <option value="محجوز">محجوز</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
               <button 
                 onClick={() => setFilters({ type: '', size: '', status: '' })}
                 className="text-slate-400 hover:text-rose-600 font-bold text-sm bg-slate-100 hover:bg-rose-50 px-6 py-3 rounded-xl transition-all"
               >
                 مسح الفلاتر
               </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="animate-spin text-rose-600" size={64} />
          </div>
        ) : dresses.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-4xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="bg-rose-50 p-8 rounded-full mb-8">
                <Heart className="text-rose-300" size={80} />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-4">لا توجد فساتين في هذا القسم حالياً</h3>
            <p className="text-slate-500 mb-8 max-w-md">نحن نقوم بتحديث مجموعتنا باستمرار، يرجى التحقق من الأقسام الأخرى أو العودة لاحقاً.</p>
            <button 
                onClick={() => setActiveCategory('all')} 
                className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:shadow-rose-200 transition-all hover:-translate-y-1"
            >
                عرض جميع الفساتين
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {dresses.map((dress) => (
              <div key={dress.id} className="group bg-white rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100 flex flex-col">
                <div className="relative h-112 overflow-hidden">
                  <MediaRenderer 
                    src={dress.image} 
                    alt={dress.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                  />
                  <div className="absolute top-6 right-6 group-hover:scale-110 transition-transform">
                    <button className="bg-white/90 backdrop-blur-md p-3 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl">
                      <Heart size={24} />
                    </button>
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <span className="bg-rose-600 text-white px-6 py-2 rounded-2xl text-xs font-black shadow-2xl tracking-[0.2em] uppercase">
                      {dress.type}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="p-8 flex flex-col grow text-right">
                  <div className="mb-4">
                    <span className="text-rose-500 text-xs font-bold uppercase tracking-widest">{dress.category?.name}</span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1 leading-tight group-hover:text-rose-600 transition-colors uppercase">
                      {dress.name}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    {dress.description}
                  </p>
                  <div className="mt-auto pt-6 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <span>نوع الفستان:</span>
                       <span className="text-slate-900">{dress.type}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <span>المقاس:</span>
                       <span className="text-slate-900">{dress.size}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <span>تاريخ التوفر:</span>
                       <span className={dress.status === 'متاح' ? 'text-green-600' : 'text-rose-600'}>{dress.status}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end">
                    <Link 
                      to={`/dress/${dress.id}`}
                      className="w-full bg-slate-900 text-white py-3 rounded-2xl text-sm font-black hover:bg-rose-600 transition-all flex items-center justify-center gap-3 group/btn shadow-lg"
                    >
                      التفاصيل
                      <ArrowRight size={18} className="group-hover/btn:translate-x-[-5px] transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DressList;
