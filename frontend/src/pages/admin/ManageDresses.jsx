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
    image: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        const [dressesRes, categoriesRes] = await Promise.allSettled([
          api.getDresses(),
          api.getCategories()
        ]);
        
        if (dressesRes.status === 'fulfilled') {
            setDresses(dressesRes.value.data?.data || dressesRes.value.data || []);
        }
        if (categoriesRes.status === 'fulfilled') {
            setCategories(categoriesRes.value.data?.data || categoriesRes.value.data || []);
        }
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
        image: null
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else if (key !== 'image') {
        data.append(key, formData[key]);
      }
    });

    if (editingDress) {
      data.append('_method', 'PUT');
    }

    try {
      if (editingDress) {
        await api.updateDress(editingDress.id, data);
      } else {
        await api.createDress(data);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Submit error:', err);
      const message = err.response?.data?.message || (err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(' ')
        : 'حدث خطأ أثناء حفظ البيانات');
      alert(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنتِ متأكدة من حذف هذا الفستان؟')) {
      try {
        await api.deleteDress(id);
        fetchData();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const filteredDresses = dresses.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">إدارة الفساتين</h1>
          <p className="text-slate-500 font-medium">أضيفي، عدلي أو احذفي الفساتين من مجموعتكِ المختارة</p>
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
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative grow">
          <Search className="absolute right-4 top-4 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="البحث عن فستان..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none"
          />
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-slate-200 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold text-slate-600 hover:border-rose-500 transition-all">
            <Filter size={20} />
            تصفية
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-right">
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
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex justify-center items-center gap-3 text-rose-600">
                    <Loader2 className="animate-spin" />
                    <span className="font-bold">جاري تحميل البيانات...</span>
                  </div>
                </td>
              </tr>
            ) : filteredDresses.length === 0 ? (
                <tr>
                    <td colSpan="5" className="py-20 text-center text-slate-400 font-bold italic">لا توجد بيانات متاحة حالياً</td>
                </tr>
            ) : (
              filteredDresses.map((dress) => (
                <tr key={dress.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0">
                        <MediaRenderer 
                            src={dress.image} 
                            alt="" 
                            className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 group-hover:text-rose-600 transition-colors">{dress.name}</p>
                        <p className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-1">{dress.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {dress.category?.name}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-600">
                        {dress.size} <span className="text-slate-300 mx-2">|</span> {dress.type}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                      <Check size={16} />
                      متاح
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                         onClick={() => handleOpenModal(dress)}
                         className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(dress.id)}
                        className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
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
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] rounded-5xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in slide-in-from-top-4 duration-300">
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between shrink-0">
              <h2 className="text-2xl font-black">{editingDress ? 'تعديل الفستان' : 'إضافة فستان جديد'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"
                >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-3">اسم الفستان</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-rose-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-3">القسم</label>
                  <select 
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-rose-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold"
                  >
                    <option value="">اختر القسم</option>
                    {Array.isArray(categories) && categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-3">نوع الفستان</label>
                  <select 
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-rose-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold"
                  >
                    <option value="">اختر النوع</option>
                    <option value="زفاف">فستان زفاف</option>
                    <option value="خطوبة">فستان خطوبة</option>
                    <option value="سهرة">فستان سهرة</option>
                    <option value="حناء">فستان حناء</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-3">المقاس</label>
                  <input 
                    type="text" 
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    placeholder="S, M, L, XL"
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-rose-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-3">الوصف</label>
                  <textarea 
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-rose-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-3">صورة الفستان</label>
                  <div className="relative group cursor-pointer">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                        className="hidden" 
                        id="image-upload" 
                    />
                    <label 
                        htmlFor="image-upload" 
                        className="flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl group-hover:bg-rose-50 group-hover:border-rose-200 transition-all cursor-pointer"
                    >
                        <ImageIcon className="text-slate-400 group-hover:text-rose-600 mb-4 transition-colors" size={40} />
                        <span className="font-bold text-slate-500 group-hover:text-rose-600 transition-colors">
                            {formData.image ? formData.image.name : 'اضغطي لرفع صورة جديدة'}
                        </span>
                        <p className="text-xs text-slate-300 mt-2">JPG, PNG, GIF (Max 5MB)</p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-50 shrink-0">
                <button 
                   type="submit"
                   className="grow bg-slate-900 border-2 border-slate-900 hover:bg-rose-600 hover:border-rose-600 text-white py-5 rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                   <Check size={20} />
                   حفظ البيانات
                </button>
                <button 
                   type="button"
                   onClick={() => setIsModalOpen(false)}
                   className="grow bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-600 py-5 rounded-2xl font-black transition-all"
                >
                   إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDresses;
