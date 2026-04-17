import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Camera, 
  ArrowLeft, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import api from '../api/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setFormData({
      ...formData,
      name: parsedUser.name || '',
      phone: parsedUser.phone || ''
    });
    if (parsedUser.avatar) {
      setAvatarPreview(parsedUser.avatar);
    }
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      if (avatar) {
        data.append('avatar', avatar);
      }
      if (formData.password) {
        data.append('password', formData.password);
        data.append('password_confirmation', formData.password_confirmation);
      }

      const response = await api.post('/profile/update', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('تم تحديث الملف الشخصي بنجاح!');
      setFormData({ ...formData, password: '', password_confirmation: '' });
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء التحديث. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-3xl font-black text-rose-600 tracking-tighter italic">الملكة</Link>
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-rose-600 font-bold transition-colors">
              <ArrowLeft size={20} /> العودة للرئيسية
            </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-2xl">
        <div className="bg-white rounded-5xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 h-32 relative">
             <div className="absolute -bottom-16 right-10 flex items-end gap-6">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-2xl relative overflow-hidden">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                                <User size={48} />
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={24} />
                            <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                        </label>
                    </div>
                </div>
                <div className="pb-4">
                    <h1 className="text-2xl font-black text-white">{user.name}</h1>
                    <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">{user.role}</p>
                </div>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 pt-24 space-y-8">
            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl flex items-center gap-3 font-bold border border-green-100 animate-in fade-in duration-300">
                    <CheckCircle2 size={24} />
                    {success}
                </div>
            )}
            
            {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 font-bold border border-rose-100 animate-in fade-in duration-300">
                    <AlertCircle size={24} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 text-right">
                    <label className="block text-slate-700 font-black mr-2 text-sm">الاسم بالكامل</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-rose-500 rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold"
                        />
                        <User className="absolute right-4 top-4 text-slate-300" size={20} />
                    </div>
                </div>

                <div className="space-y-2 text-right">
                    <label className="block text-slate-700 font-black mr-2 text-sm">رقم الهاتف</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-rose-500 rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold"
                        />
                        <Phone className="absolute right-4 top-4 text-slate-300" size={20} />
                    </div>
                </div>
            </div>

            <div className="space-y-2 text-right">
                <label className="block text-slate-700 font-black mr-2 text-sm">البريد الإلكتروني (غير قابل للتعديل)</label>
                <div className="relative">
                    <input 
                        type="email" 
                        disabled
                        value={user.email}
                        className="w-full bg-slate-100 text-slate-400 border-2 border-transparent rounded-2xl py-4 pr-12 pl-4 outline-none font-bold cursor-not-allowed"
                    />
                    <Mail className="absolute right-4 top-4 text-slate-300" size={20} />
                </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-6">تغيير كلمة المرور</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 text-right">
                        <label className="block text-slate-700 font-black mr-2 text-sm">كلمة المرور الجديدة</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-rose-500 rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold"
                            />
                            <Lock className="absolute right-4 top-4 text-slate-300" size={20} />
                        </div>
                    </div>
                    <div className="space-y-2 text-right">
                        <label className="block text-slate-700 font-black mr-2 text-sm">تأكيد كلمة المرور</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                                className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-rose-500 rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold"
                            />
                            <Lock className="absolute right-4 top-4 text-slate-300" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-10">
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-5 rounded-3xl font-black shadow-xl shadow-rose-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={28} />
                    ) : (
                        <>
                            حفظ التغييرات
                            <Save size={24} />
                        </>
                    )}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
