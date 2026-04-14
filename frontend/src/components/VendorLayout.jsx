import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  CalendarCheck, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Bell,
  Search,
  User,
  Clock,
  MessageSquare
} from 'lucide-react';

const VendorLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'مزود خدمة' && user.role !== 'إدارة') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return null;

  // Handling Pending State for Vendors
  if (user.role === 'مزود خدمة' && user.status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
        <div className="max-w-xl w-full bg-white rounded-5xl p-12 text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-500">
           <div className="bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
             <Clock className="text-amber-500" size={48} />
           </div>
           <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">حسابكِ قيد المراجعة</h1>
           <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
             أهلاً بكِ في عائلة "الملكة". لقد استلمنا طلب انضمامكِ كمزودة خدمة، وفريق الإدارة يقوم حالياً بمراجعة بياناتكِ لضمان جودة الخدمات المقدمة.
           </p>
           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-10">
             <p className="text-slate-600 font-bold">يرجى الانتظار لمدة تصل إلى 24 ساعة عمل.</p>
           </div>
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 bg-slate-900 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-black transition-all mx-auto"
           >
             <LogOut size={20} />
             تسجيل الخروج والانتظار
           </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { title: 'نظرة عامة', icon: LayoutDashboard, path: '/vendor' },
    { title: 'خدماتي', icon: Sparkles, path: '/vendor/services' },
    { title: 'طلبات الحجز', icon: CalendarCheck, path: '/vendor/bookings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Sidebar - Shared style with Admin but Vendor colored */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-80' : 'w-24'
        } bg-slate-900 text-white transition-all duration-500 ease-in-out fixed inset-y-0 right-0 z-100 flex flex-col shadow-2xl overflow-hidden`}
      >
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center rotate-12">
               <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter italic text-rose-500">الملكة</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="grow py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
                  isActive 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                   <item.icon size={20} />
                </div>
                {isSidebarOpen && (
                  <>
                    <span className="font-bold grow">{item.title}</span>
                    <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive && 'opacity-100'}`} />
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-900/20 transition-all font-bold ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`grow transition-all duration-500 ${
          isSidebarOpen ? 'mr-80' : 'mr-24'
        } min-h-screen`}
      >
        {/* Top Header */}
        <header className="fixed top-0 left-0 transition-all duration-500 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200"
          style={{ right: isSidebarOpen ? '20rem' : '6rem' }}
        >
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-sm">
                <Store size={18} /> لوحة تحكم المزود
            </div>

            <div className="flex items-center gap-6">
              <button className="relative p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all">
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-3 h-3 bg-rose-600 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-black text-slate-900">{user?.name}</p>
                  <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">مزودة خدمة معتمدة</p>
                </div>
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white border-2 border-white shadow-xl">
                  <User size={24} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 pt-32 grow overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default VendorLayout;
