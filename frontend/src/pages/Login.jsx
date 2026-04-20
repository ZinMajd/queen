import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, Heart, AlertCircle } from 'lucide-react';
import { login as loginApi } from '../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginApi({ email, password });
      const user = response.data.user;
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Smart redirection based on role
      if (user.role === 'إدارة') {
        navigate('/admin');
      } else if (user.role === 'مزود خدمة') {
        navigate('/vendor');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || 'فشل تسجيل الدخول. يرجى التأكد من البيانات.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-rose-600 items-center justify-center p-20">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1594462757504-89913d8603e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover opacity-20 scale-110"
            alt=""
          />
          <div className="absolute inset-0 bg-linear-to-br from-rose-600/80 to-slate-900/80"></div>
        </div>
        
        <div className="relative z-10 text-right text-white max-w-lg">
          <Heart className="mb-8 text-rose-300 animate-pulse" size={64} />
          <h2 className="text-5xl font-black mb-6 leading-tight">مرحباً بكِ مجدداً في عائلة الملكة</h2>
          <p className="text-xl text-rose-100 font-medium leading-relaxed">
            سجلي دخولكِ لمتابعة حجوزاتكِ واكتشاف أحدث كولكشن فساتين الزفاف الحصرية.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-20 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12 text-center lg:text-right">
            <Link to="/" className="text-3xl font-black text-rose-600 tracking-tighter italic inline-block mb-8">الملكة</Link>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">تسجيل الدخول</h1>
            <p className="text-slate-500 font-medium text-lg">أهلاً بكِ، أدخلي بياناتكِ للمتابعة</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {/* Near-invisible decoy fields (not display:none to fool smart browsers) */}
            <input type="text" name="prevent_autofill" style={{ opacity: 0, position: 'absolute', height: 0, width: 0, zIndex: -1 }} />
            <input type="password" name="password_fake" style={{ opacity: 0, position: 'absolute', height: 0, width: 0, zIndex: -1 }} />

            <div className="text-right">
              <label className="block text-slate-700 font-bold mb-2 mr-2">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="user_identifier"
                  required
                  autoComplete="chrome-off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold text-slate-800"
                />
                <Mail className="absolute right-4 top-4 text-slate-400" size={24} />
              </div>
            </div>

            <div className="text-right">
              <label className="block text-slate-700 font-bold mb-2 mr-2">كلمة المرور</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="user_security_token"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold text-slate-800"
                />
                <Lock className="absolute right-4 top-4 text-slate-400" size={24} />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100 text-right">
                <AlertCircle size={20} className="shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-rose-600 text-white py-5 rounded-2xl text-xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'دخول'}
            </button>
          </form>

          <div className="mt-12 text-center text-slate-500 font-medium pt-8 border-t border-slate-100">
            ليس لديكِ حساب؟{' '}
            <Link to="/register" className="text-rose-600 font-black hover:underline">إنشاء حساب جديد</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
