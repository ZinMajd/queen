import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader2, Heart, AlertCircle } from 'lucide-react';
import { register as registerApi } from '../api/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'عروس' // Match backend validation
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await registerApi(formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      console.error('Register error:', err.response?.data);
      const errorMessage = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-20">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover opacity-30"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-rose-600/60"></div>
        </div>
        
        <div className="relative z-10 text-right text-white max-w-lg">
          <Heart className="mb-8 text-rose-500" size={64} fill="currentColor" />
          <h2 className="text-5xl font-black mb-6 leading-tight">انضمي لنا وخططي لزفاف أحلامكِ</h2>
          <p className="text-xl text-slate-100 font-medium leading-relaxed">
            أنشئي حسابكِ الآن لتتمكني من حجز أرقى الفساتين والخدمات بكل سهولة.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-20 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-right">
            <Link to="/" className="text-3xl font-black text-rose-600 tracking-tighter italic inline-block mb-6">الملكة</Link>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">حساب جديد</h1>
            <p className="text-slate-500 font-medium">ابدئي رحلة التألق معنا</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-right">
              <label className="block text-slate-700 font-bold mb-1.5 mr-2 text-sm">الاسم الكامل</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="الاسم الثلاثي"
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-3.5 pr-12 pl-4 outline-none transition-all font-bold text-slate-800"
                />
                <User className="absolute right-4 top-3.5 text-slate-400" size={22} />
              </div>
            </div>

            <div className="text-right">
              <label className="block text-slate-700 font-bold mb-1.5 mr-2 text-sm">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-3.5 pr-12 pl-4 outline-none transition-all font-bold text-slate-800"
                />
                <Mail className="absolute right-4 top-3.5 text-slate-400" size={22} />
              </div>
            </div>

            <div className="text-right">
              <label className="block text-slate-700 font-bold mb-1.5 mr-2 text-sm">رقم الهاتف</label>
              <div className="relative">
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="77XXXXXXX"
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-3.5 pr-12 pl-4 outline-none transition-all font-bold text-slate-800"
                />
                <Phone className="absolute right-4 top-3.5 text-slate-400" size={22} />
              </div>
            </div>

            <div className="text-right">
              <label className="block text-slate-700 font-bold mb-1.5 mr-2 text-sm">كلمة المرور</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="كلمة مرور قوية"
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-3.5 pr-12 pl-4 outline-none transition-all font-bold text-slate-800"
                />
                <Lock className="absolute right-4 top-3.5 text-slate-400" size={22} />
              </div>
            </div>

            <div className="text-right">
              <label className="block text-slate-700 font-bold mb-1.5 mr-2 text-sm">تأكيد كلمة المرور</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="password_confirmation"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="أعيدي كتابة كلمة المرور"
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-3.5 pr-12 pl-4 outline-none transition-all font-bold text-slate-800"
                />
                <Lock className="absolute right-4 top-3.5 text-slate-400" size={22} />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border border-rose-100 text-right">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-rose-600 text-white py-5 rounded-2xl text-xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'فتح حساب'}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 font-medium pt-8 border-t border-slate-100">
            لديكِ حساب بالفعل؟{' '}
            <Link to="/login" className="text-rose-600 font-black hover:underline">سجلي دخولك</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
