import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tags, 
  CalendarCheck, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Bell,
  Search,
  User,
  UserCheck,
  Settings
} from 'lucide-react';
import NotificationBell from './NotificationBell';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== "undefined") {
        return JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Error parsing user:", e);
    }
    return null;
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'إدارة') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { title: 'الإحصائيات', icon: LayoutDashboard, path: '/admin' },
    { title: 'إدارة الفساتين', icon: ShoppingBag, path: '/admin/dresses' },
    { title: 'إدارة الأقسام', icon: Tags, path: '/admin/categories' },
    { title: 'إدارة الحجوزات', icon: CalendarCheck, path: '/admin/bookings' },
    { title: 'المستخدمين', icon: Users, path: '/admin/users' },
    { title: 'المزودين', icon: UserCheck, path: '/admin/vendors' },
    { title: 'الإعدادات', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-80' : 'w-24'
        } bg-slate-900 text-white transition-all duration-500 ease-in-out fixed inset-y-0 right-0 z-100 flex flex-col shadow-2xl overflow-hidden`}
      >
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
              <ShoppingBag className="text-white" size={24} />
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
                <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-slate-800'}`}>
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
            <div className="relative group w-96 hidden md:block">
              <Search className="absolute right-4 top-3 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="ابحث عن أي شيء..." 
                className="w-full bg-slate-100 border-none rounded-2xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <NotificationBell />
              
              <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-black text-slate-900">{user?.name}</p>
                  <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">{user?.role}</p>
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

export default AdminLayout;
