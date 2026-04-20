import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Filter, ArrowRight, ArrowLeft, Loader2, Search, X, ChevronRight, User } from 'lucide-react';
import { getDresses, getCategories, toggleFavorite } from '../api/api';
import MediaRenderer from '../components/MediaRenderer';

const DressList = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [dresses, setDresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryId || 'all');
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

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    size: '',
    status: '',
    min_rating: ''
  });

  const handleFavoriteToggle = async (e, dressId) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await toggleFavorite('dress', dressId);
      setDresses(dresses.map(d => {
        if (d.id === dressId) {
          const isAdded = response.data.status === 'added';
          return { 
             ...d, 
             favorites_count: response.data.favorite_count,
             is_favorited: isAdded
          };
        }
        return d;
      }));
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  useEffect(() => {
    if (categoryId) {
        setActiveCategory(categoryId);
    }
  }, [categoryId]);

  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = useCallback(async (page = 1) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    
    try {
      const queryParams = {
          page,
          ...(activeCategory !== 'all' ? { category_id: activeCategory } : {}),
          ...(searchTerm ? { search: searchTerm } : {}),
          ...(filters.type ? { type: filters.type } : {}),
          ...(filters.size ? { size: filters.size } : {}),
          ...(filters.status ? { status: filters.status } : {}),
          ...(filters.min_rating ? { min_rating: filters.min_rating } : {})
      };

      const [dressesRes, categoriesRes] = await Promise.all([
        getDresses(queryParams),
        getCategories()
      ]);

      if (page === 1) {
        setDresses(dressesRes.data.data || []);
      } else {
        setDresses(prev => [...prev, ...(dressesRes.data.data || [])]);
      }
      
      setPagination({
        current_page: dressesRes.data.current_page,
        last_page: dressesRes.data.last_page
      });
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, searchTerm, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchData]);

  const handleLoadMore = () => {
    if (pagination.current_page < pagination.last_page) {
      fetchData(pagination.current_page + 1);
    }
  };

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
          <div className="flex items-center gap-4 w-full md:w-auto">
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
        
        {/* Categories Bar */}
        <div className="container mx-auto px-6 py-4 overflow-x-auto no-scrollbar flex justify-center gap-4 border-t border-slate-50">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-8 py-3 rounded-2xl whitespace-nowrap transition-all font-black text-sm uppercase tracking-widest shadow-lg ${activeCategory === 'all' ? 'bg-rose-600 text-white scale-105' : 'bg-white text-slate-500 border border-slate-100 hover:border-rose-200'}`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id.toString())}
              className={`px-8 py-3 rounded-2xl whitespace-nowrap transition-all font-black text-sm uppercase tracking-widest shadow-lg ${activeCategory === cat.id.toString() ? 'bg-rose-600 text-white scale-105' : 'bg-white text-slate-500 border border-slate-100 hover:border-rose-200'}`}
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
              <label className="block text-slate-700 font-bold mb-2">التقييم</label>
              <div className="flex flex-col gap-2">
                {[
                  { value: '', label: 'الكل', stars: 0 },
                  { value: '2', label: 'فأعلى', stars: 2 },
                  { value: '3', label: 'فأعلى', stars: 3 },
                  { value: '4', label: 'فأعلى', stars: 4 },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFilters({...filters, min_rating: opt.value})}
                    className={`flex items-center justify-between px-4 py-2 rounded-xl border-2 transition-all font-bold text-sm ${
                      filters.min_rating === opt.value
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-700 border-transparent hover:border-rose-200'
                    }`}
                  >
                    <span>{opt.stars === 0 ? 'الكل' : opt.label}</span>
                    {opt.stars > 0 && (
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={i < opt.stars ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                      </span>
                    )}
                  </button>
                ))}
              </div>
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
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {dresses.map((dress) => (
                /* ... rest of mapping ... */
                <div key={dress.id} className="group bg-white rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100 flex flex-col">
                  {/* ... contents ... */}
                  <div className="relative h-112 overflow-hidden">
                    <MediaRenderer 
                      src={dress.image} 
                      alt={dress.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                    />
                    {/* Favorite Button */}
                    <button 
                      onClick={(e) => handleFavoriteToggle(e, dress.id)}
                      className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/90 backdrop-blur-md text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                    >
                      <Heart size={24} className={dress.is_favorited ? 'fill-rose-600 text-rose-600' : ''} />
                    </button>
                    <div className="absolute top-6 left-6 z-10 bg-slate-900/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-xl border border-white/10 uppercase tracking-widest">
                      <Heart size={10} className="fill-rose-500 text-rose-500" /> {dress.favorites_count || 0}
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

            {pagination.current_page < pagination.last_page && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-white text-rose-600 border-2 border-rose-600 px-12 py-4 rounded-2xl font-black shadow-lg hover:bg-rose-600 hover:text-white transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      تحميل المزيد من الفساتين
                      <ChevronRight className="rotate-90" size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DressList;
