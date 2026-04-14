import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Image as ImageIcon, 
  Loader2, 
  X, 
  Check,
  LayoutGrid
} from 'lucide-react';
import api from '../../api/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    image: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        image: null
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        image: null
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.image) {
      data.append('image', formData.image);
    }

    if (editingCategory) {
      data.append('_method', 'PUT');
    }

    try {
      if (editingCategory) {
        await api.post(`/admin/categories/${editingCategory.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/categories', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Submit error:', err);
      alert('حدث خطأ أثناء حفظ البيانات');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنتِ متأكدة من حذف هذا القسم؟ سيتم حذف جميع الفساتين المرتبطة به أيضاً.')) {
      try {
        await api.delete(`/admin/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">إدارة الأقسام</h1>
          <p className="text-slate-500 font-medium">نظمي مجموعتكِ من خلال تصنيفات واضحة وجذابة</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-900 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 transition-all active:scale-95"
        >
          <Plus size={20} />
          إضافة قسم جديد
        </button>
      </div>

      <div className="relative grow">
        <Search className="absolute right-4 top-4 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="ابحث عن قسم..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-12 pl-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none max-w-lg"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-40">
           <Loader2 className="animate-spin text-rose-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-5xl p-4 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group">
              <div className="relative h-64 rounded-4xl overflow-hidden mb-6">
                <img 
                    src={cat.image ? (cat.image.startsWith('http') ? cat.image : `http://localhost:8000${cat.image}`) : ''} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              
              <div className="px-4 pb-4">
                <h3 className="text-2xl font-black text-slate-900 mb-6">{cat.name}</h3>
                <div className="flex gap-3">
                    <button 
                        onClick={() => handleOpenModal(cat)}
                        className="grow flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                        <Pencil size={18} />
                        تعديل
                    </button>
                    <button 
                        onClick={() => handleDelete(cat.id)}
                        className="bg-rose-50 text-rose-600 p-4 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-5xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-rose-600 p-8 text-white flex items-center justify-between">
              <h2 className="text-2xl font-black">{editingCategory ? 'تعديل القسم' : 'إضافة قسم جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div>
                <label className="block text-slate-700 font-bold mb-3">اسم القسم</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-rose-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-3">صورة ترويجية للقسم</label>
                <div className="relative group cursor-pointer">
                  <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} className="hidden" id="logo-upload" />
                  <label htmlFor="logo-upload" className="flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl group-hover:bg-rose-50 group-hover:border-rose-200 transition-all cursor-pointer text-center">
                    <ImageIcon className="text-slate-400 group-hover:text-rose-600 mb-4 transition-colors" size={40} />
                    <span className="font-bold text-slate-500 group-hover:text-rose-600 transition-colors">
                        {formData.image ? formData.image.name : 'اضغطي لرفع صورة للقسم'}
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-slate-50">
                <button type="submit" className="grow bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-3">
                   <Check size={20} />
                   حفظ القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
