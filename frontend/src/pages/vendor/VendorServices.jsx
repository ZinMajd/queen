import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2, 
  Image as ImageIcon,
  DollarSign,
  Tag,
  AlertCircle,
  X,
  CheckCircle2
} from 'lucide-react';
import api from '../../api/api';
import MediaRenderer from '../../components/MediaRenderer';

const VendorServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    service_type: '',
    price: '',
    image_file: null
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.status === 'active') {
      fetchServices();
    }
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vendor/services');
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setIsEditing(true);
      setCurrentService(service);
      setFormData({
        name: service.name,
        description: service.description,
        service_type: service.service_type,
        price: service.price,
        image_file: null
      });
    } else {
      setIsEditing(false);
      setCurrentService(null);
      setFormData({
        name: '',
        description: '',
        service_type: '',
        price: '',
        image_file: null
      });
    }
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('service_type', formData.service_type);
    data.append('price', formData.price);
    if (formData.image_file) {
      data.append('image_file', formData.image_file);
    }
    
    // In Laravel, PUT requests don't handle FormData well, so we use POST with _method spoofing if editing
    const url = isEditing ? `/vendor/services/${currentService.id}` : '/vendor/services';
    if (isEditing) {
        data.append('_method', 'PUT');
    }

    try {
      await api.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ الخدمة');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنتِ متأكدة من حذف هذه الخدمة نهائياً؟')) {
      try {
        await api.delete(`/vendor/services/${id}`);
        setServices(services.filter(s => s.id !== id));
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">إدارة خدماتي</h1>
          <p className="text-slate-500 font-medium text-lg">أضيفي لمساتك الإبداعية واعرضي خدماتك للعرائس</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-5 rounded-3xl font-black flex items-center gap-3 shadow-xl shadow-rose-200 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={24} />
          إضافة خدمة جديدة
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-40">
          <Loader2 className="animate-spin text-rose-600" size={64} />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-5xl p-20 text-center border border-slate-100 shadow-sm animate-in fade-in zoom-in duration-500">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <Sparkles className="text-slate-300" size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">لا توجد خدمات مضافة بعد</h2>
          <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
            ابدئي رحلتكِ برفع أول خدمة لكِ اليوم. العرائس بانتظار إبداعكِ!
          </p>
          <button 
            onClick={() => handleOpenModal()}
            className="text-rose-600 font-black text-lg underline hover:text-rose-700 transition-colors"
          >
            اضغطي هنا لإضافة خدمتكِ الأولى
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-4xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all group flex flex-col">
              <div className="h-64 relative overflow-hidden shrink-0">
                 <MediaRenderer 
                    src={service.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-6">
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleOpenModal(service)}
                         className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-xl"
                       >
                         <Edit2 size={18} />
                       </button>
                       <button 
                         onClick={() => handleDelete(service.id)}
                         className="p-3 bg-white text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-xl"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                 </div>
              </div>
              <div className="p-8 grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">{service.name}</h3>
                   <span className="bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-xs font-black border border-rose-100 italic">
                     {service.service_type}
                   </span>
                </div>
                <p className="text-slate-500 font-medium mb-8 line-clamp-2 leading-relaxed shrink-0">
                  {service.description}
                </p>
                <div className="mt-auto flex justify-between items-center bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">
                   <div className="flex items-center gap-2">
                      <DollarSign size={20} className="text-rose-500" />
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">{service.price}</span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">ريال</span>
                   </div>
                   <div className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">نشط</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-5xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-rose-600 p-8 text-white flex justify-between items-center">
               <div>
                  <h2 className="text-3xl font-black">{isEditing ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</h2>
                  <p className="text-rose-100 font-medium opacity-80">املئي البيانات التالية بدقة</p>
               </div>
               <button onClick={() => setModalOpen(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl">
                 <X size={24} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-right">
                    <label className="block text-slate-700 font-bold mb-2 mr-2">اسم الخدمة</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="مثال: مكياج عروس ملكي"
                        className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold text-slate-800"
                      />
                      <Sparkles className="absolute right-4 top-4 text-slate-400" size={24} />
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="block text-slate-700 font-bold mb-2 mr-2">نوع الخدمة</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.service_type}
                        onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                        className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold text-slate-800 appearance-none"
                      >
                         <option value="">اختر النوع...</option>
                         <option value="مكياج">مكياج</option>
                         <option value="تصوير">تصوير</option>
                         <option value="تصفيف شعر">تصفيف شعر</option>
                         <option value="كوافير">كوافير</option>
                         <option value="تنسيق">تنسيق</option>
                         <option value="أخرى">أخرى</option>
                      </select>
                      <Tag className="absolute right-4 top-4 text-slate-400" size={24} />
                    </div>
                  </div>
               </div>

               <div className="text-right">
                <label className="block text-slate-700 font-bold mb-2 mr-2">الوصف التفصيلي</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="صفي خدمتكِ بطريقة تجذب العرائس..."
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold text-slate-800 h-32"
                />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-right">
                    <label className="block text-slate-700 font-bold mb-2 mr-2">السعر (بالريال)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold text-slate-800"
                      />
                      <DollarSign className="absolute right-4 top-4 text-slate-400" size={24} />
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="block text-slate-700 font-bold mb-2 mr-2">صورة الخدمة</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        onChange={(e) => setFormData({...formData, image_file: e.target.files[0]})}
                        className="hidden"
                        id="image-upload"
                      />
                      <label 
                        htmlFor="image-upload"
                        className="w-full bg-slate-100 border-2 border-dashed border-slate-300 hover:border-rose-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 transition-all font-bold text-slate-600 block cursor-pointer"
                      >
                         {formData.image_file ? formData.image_file.name : 'اختر صورة...'}
                      </label>
                      <ImageIcon className="absolute right-4 top-4 text-slate-400" size={24} />
                    </div>
                  </div>
               </div>

               {error && (
                 <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100">
                    <AlertCircle size={20} />
                    {error}
                 </div>
               )}

               <button 
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-slate-900 hover:bg-rose-600 text-white py-6 rounded-3xl text-xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
               >
                  {submitLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      {isEditing ? 'تحديث الخدمة' : 'إضافة الخدمة الآن'}
                      <CheckCircle2 size={24} />
                    </>
                  )}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorServices;
