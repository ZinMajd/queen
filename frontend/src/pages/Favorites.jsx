import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getFavorites, toggleFavorite } from '../api/api';
import MediaRenderer from '../components/MediaRenderer';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchFavorites = async () => {
        try {
            const response = await getFavorites();
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        fetchFavorites();
    }, [navigate]);

    const handleRemove = async (e, id, type) => {
        e.stopPropagation();
        try {
            const typeStr = type.includes('Dress') ? 'dress' : 'service';
            await toggleFavorite(typeStr, id);
            setFavorites(favorites.filter(f => f.favoritable_id !== id || f.favoritable_type !== type));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <Loader2 className="animate-spin text-rose-600" size={64} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24" dir="rtl">
            {/* Elegant Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                    <Link to="/" className="text-3xl font-black text-rose-600 tracking-tighter italic">الملكة</Link>
                    <div className="flex gap-6 items-center">
                        <Link to="/dresses" className="text-slate-600 hover:text-rose-600 font-bold transition-all text-sm uppercase tracking-widest hidden md:block">الفساتين</Link>
                        <Link to="/services" className="text-slate-600 hover:text-rose-600 font-bold transition-all text-sm uppercase tracking-widest hidden md:block">الخدمات</Link>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-5 py-2.5 rounded-2xl transition-all font-bold text-sm">
                            <ArrowLeft size={18} /> العودة
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-6 py-3 rounded-full text-xs font-black tracking-[0.2em] uppercase mb-6 shadow-sm">
                        <Heart size={16} className="fill-rose-600" /> اختياراتكِ المفضلة
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">قائمة الأماني</h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">هنا تجتمع أحلامكِ التي اخترتيها بعناية من "الملكة". تابعي حجزها أو استكشفي المزيد.</p>
                </div>

                {favorites.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-slate-100 flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
                        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <Heart size={64} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4">قائمة مفضلتكِ فارغة حالياً</h2>
                            <p className="text-slate-500 font-medium">ابدئي بإضافة الفساتين والخدمات التي تعجبكِ أثناء التصفح لجعل ليلة عمركِ لا تُنسى.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <button onClick={() => navigate('/dresses')} className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-rose-200 transition-all flex items-center gap-3">
                                تصفح الفساتين <ChevronRight size={20} />
                            </button>
                            <button onClick={() => navigate('/services')} className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-2xl font-black transition-all flex items-center gap-3">
                                تصفح الخدمات <Sparkles size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {favorites.map((fav) => (
                            <div key={fav.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full">
                                {/* Media Section */}
                                <div className="relative h-96 overflow-hidden">
                                    <MediaRenderer 
                                        src={fav.favoritable.image} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                    />
                                    <div className="absolute top-6 left-6 z-10">
                                        <button 
                                            onClick={(e) => handleRemove(e, fav.favoritable_id, fav.favoritable_type)}
                                            className="p-4 rounded-3xl bg-white/20 hover:bg-rose-600 text-white backdrop-blur-md transition-all border border-white/10 group/btn"
                                            title="حذف من المفضلة"
                                        >
                                            <Trash2 size={24} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-6 right-6">
                                        <span className="bg-slate-900/40 backdrop-blur-md text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                                            {fav.favoritable_type.includes('Dress') ? 'فستان' : 'خدمة'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex flex-col grow">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{fav.favoritable.name}</h3>
                                        <div className="text-xl font-bold text-rose-600">{fav.favoritable.price}$</div>
                                    </div>
                                    
                                    <p className="text-slate-400 text-sm leading-relaxed mb-auto line-clamp-2 italic">
                                        "{fav.favoritable.description}"
                                    </p>

                                    <div className="mt-10 pt-8 border-t border-slate-50 flex gap-4">
                                        <button 
                                            onClick={() => navigate(fav.favoritable_type.includes('Dress') ? `/dress/${fav.favoritable_id}` : '/services')}
                                            className="grow bg-slate-900 hover:bg-rose-600 text-white py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                                        >
                                            عرض وتأكيد
                                            < ChevronRight size={18} />
                                        </button>
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

export default Favorites;
