import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  Image as ImageIcon, 
  Loader2, 
  X, 
  Check,
  AlertCircle
} from 'lucide-react';
import * as api from '../../api/api';
import MediaRenderer from '../../components/MediaRenderer';

const ManageDresses = () => {
  const [dresses, setDresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDress, setEditingDress] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    size: '',
    type: '',
    is_for_sale: false,
    is_for_rent: true,
    sale_price: '',
    rent_price: '',
    image: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        // Fetch all dresses without pagination for admin management
        const [dressesRes, categoriesRes] = await Promise.all([
          api.getDresses({ all: true }), 
          api.getCategories()
        ]);
        
        const dData = dressesRes.data?.data || dressesRes.data || [];
        setDresses(Array.isArray(dData) ? dData : []);

        const cData = categoriesRes.data?.data || categoriesRes.data || [];
        setCategories(Array.isArray(cData) ? cData : []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dress = null) => {
    if (dress) {
      setEditingDress(dress);
      setFormData({
        name: dress.name,
        category_id: dress.category_id,
        description: dress.description,
        size: dress.size || '',
        type: dress.type || '',
        is_for_sale: dress.is_for_sale == 1 || dress.is_for_sale === true,
        is_for_rent: dress.is_for_rent == 1 || dress.is_for_rent === true,
        sale_price: dress.sale_price || '',
        rent_price: dress.rent_price || '',
        image: null
      });
    } else {
      setEditingDress(null);
      setFormData({
        name: '',
        category_id: '',
        description: '',
        size: '',
        type: '',
        is_for_sale: false,
        is_for_rent: true,
        sale_price: '',
        rent_price: '',
        image: null
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category_id', formData.category_id);
    data.append('description', formData.description || '');
    data.append('size', formData.size || 'M');
    data.append('type', formData.type || 'زفاف');
    data.append('is_for_sale', formData.is_for_sale ? 1 : 0);
    data.append('is_for_rent', formData.is_for_rent ? 1 : 0);
    data.append('sale_price', formData.sale_price || '');
    data.append('rent_price', formData.rent_price || '');
    if (formData.image) data.append('image', formData.image);

    if (editingDress) data.append('_method', 'PUT');

    try {
      if (editingDress) {
        await api.updateDress(editingDress.id, data);
        alert('تم التعديل بنجاح');
      } else {
        await api.createDress(data);
        alert('تمت الإضافة بنجاح');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('خطأ في الحفظ: ' + (err.response?.data?.message || 'حاول مرة أخرى'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('حذف هذا الفستان؟')) {
      try {
        await api.deleteDress(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredDresses = dresses.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 p-4 md:p-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">إدارة الفساتين</h1>
          <p className="text-slate-500 font-medium">تحكم بكامل تفاصيل مجموعتكِ الملكية</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-900 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 transition-all active:scale-95"
        >
          <Plus size={20} />
          إضافة فستان جديد
        </button>
      </div>

      {/* Toolbar */}
      <div className="relative">
        <Search className="absolute right-4 top-4 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="البحث بالاسم أو الوصف..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-12 pl-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none font-bold"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-right min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-xs">
              <th className="px-8 py-6">الفستان</th>
              <th className="px-8 py-6">القسم</th>
              <th className="px-8 py-6">المقاس/النوع</th>
              <th className="px-8 py-6">الحالة</th>
              <th className="px-8 py-6 text-center">العمليات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="5" className="py-20 text-center font-bold text-rose-600">جاري التحميل...</td></tr>
            ) : filteredDresses.length === 0 ? (
                <tr><td colSpan="5" className="py-20 text-center text-slate-400 font-bold">لا توجد فساتين للعرض</td></tr>
            ) : (
              filteredDresses.map((dress) => (
                <tr key={dress.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0">
                        <MediaRenderer src={dress.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 group-hover:text-rose-600 transition-colors">{dress.name}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">{dress.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-[10px] font-black">{dress.category?.name}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-600">{dress.size} | {dress.type}</div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold">
                    <div className="flex flex-col gap-1">
                      {dress.is_for_rent && (
                        <span className="text-blue-600 flex items-center gap-2">
                          {dress.bookings_count > 0 ? <X size={14} /> : <Check size={14} />} 
                          إيجار {dress.rent_price && `(${dress.rent_price})`}
                        </span>
                      )}
                      {dress.is_for_sale && (
                        <span className="text-green-600 flex items-center gap-2">
                          <Check size={14} /> بيع {dress.sale_price && `(${dress.sale_price})`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleOpenModal(dress)} className="p-3 bg-slate-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(dress.id)} className="p-3 bg-slate-100 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] rounded-5xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
              <h2 className="text-2xl font-black">{editingDress ? 'تعديل الفستان' : 'إضافة فستان'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-xl"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <input type="text" required placeholder="اسم الفستان" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-rose-500 font-bold" />
              <select required value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-rose-500 font-bold">
                <option value="">اختر القسم</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="المقاس (S, M, L...)" value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-rose-500 font-bold" />
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-rose-500 font-bold">
                  <option value="زفاف">زفاف</option>
                  <option value="خطوبة">خطوبة</option>
                  <option value="سهرة">سهرة</option>
                  <option value="حناء">حناء</option>
                </select>
              </div>
              <textarea placeholder="الوصف" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-rose-500 font-bold h-24 resize-none"></textarea>
              
              <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-3xl border-2 border-slate-100">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="is_for_rent"
                    checked={formData.is_for_rent} 
                    onChange={(e) => setFormData({...formData, is_for_rent: e.target.checked})}
                    className="w-5 h-5 accent-rose-600"
                  />
                  <label htmlFor="is_for_rent" className="font-bold text-slate-700">متاح للإيجار</label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="is_for_sale"
                    checked={formData.is_for_sale} 
                    onChange={(e) => setFormData({...formData, is_for_sale: e.target.checked})}
                    className="w-5 h-5 accent-rose-600"
                  />
                  <label htmlFor="is_for_sale" className="font-bold text-slate-700">متاح للبيع</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="سعر الإيجار (مثلاً: 500$)" 
                  value={formData.rent_price} 
                  disabled={!formData.is_for_rent}
                  onChange={(e) => setFormData({...formData, rent_price: e.target.value})} 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-rose-500 font-bold disabled:opacity-50" 
                />
                <input 
                  type="text" 
                  placeholder="سعر البيع (مثلاً: 2000$)" 
                  value={formData.sale_price} 
                  disabled={!formData.is_for_sale}
                  onChange={(e) => setFormData({...formData, sale_price: e.target.value})} 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-rose-500 font-bold disabled:opacity-50" 
                />
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-rose-300 transition-all cursor-pointer relative">
                <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} className="absolute inset-0 opacity-0 cursor-pointer" />
                <ImageIcon className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-sm font-bold text-slate-500">{formData.image ? formData.image.name : 'اضغطي لرفع صورة'}</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="grow bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-rose-600 transition-all">حفظ</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="grow bg-slate-100 text-slate-600 py-4 rounded-2xl font-black">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDresses;
