import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Clock, 
  MessageSquare, 
  UserCheck, 
  Loader2,
  X
} from 'lucide-react';
import * as api from '../api/api';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await api.getNotifications();
            setNotifications(response?.data?.notifications || []);
            setUnreadCount(response?.data?.unread_count || 0);

        } catch (error) {
            if (import.meta.env.DEV) {
                console.warn('Notifications fetch skipped.');
            }
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleMarkAsRead = async (id) => {
        try {
            await api.markNotificationRead(id);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('هل أنت متأكد من مسح جميع الإشعارات؟')) return;
        try {
            await api.clearAllNotifications();
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'الآن';
        if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} د`;
        if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} س`;
        return date.toLocaleDateString('ar-EG');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={isOpen ? "relative p-2.5 rounded-2xl transition-all border border-rose-100 bg-rose-50" : "relative p-2.5 rounded-2xl transition-all border border-slate-100 bg-white hover:bg-slate-50 group"}
            >
                <Bell size={22} className={isOpen ? 'text-rose-600' : 'text-slate-600 group-hover:text-rose-600'} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        {unreadCount > 9 ? '+9' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 mt-4 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-black tracking-tight">الإشعارات</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">لديك {unreadCount} إشعار جديد</p>
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleMarkAllRead}
                                title="تمييز الكل كمقروء"
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
                             >
                                <CheckCheck size={18} />
                             </button>
                             <button 
                                onClick={handleClearAll}
                                title="مسح الكل"
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-rose-400"
                             >
                                <Trash2 size={18} />
                             </button>
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                        {loading ? (
                            <div className="p-20 text-center"><Loader2 className="animate-spin text-rose-600 mx-auto" size={32} /></div>
                        ) : notifications.length === 0 ? (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="bg-slate-50 p-6 rounded-full text-slate-200"><Bell size={48} /></div>
                                <p className="text-slate-500 font-bold">لا توجد إشعارات حالياً</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {Array.isArray(notifications) && notifications.map((notification) => (
                                    <div 
                                        key={notification.id}
                                        className={`p-5 flex gap-4 hover:bg-slate-50/80 transition-all cursor-pointer group/item text-right ${!notification.read_at ? 'bg-rose-50/30' : ''}`}
                                        onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-sm ${notification.data?.type === 'booking_status' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                                            {notification.data?.type === 'booking_status' ? <UserCheck size={20} /> : <MessageSquare size={20} />}
                                        </div>
                                        <div className="flex flex-col gap-1 grow">
                                            <p className={`text-sm leading-relaxed ${!notification.read_at ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                                                {notification.data?.message}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                                <Clock size={10} />
                                                {getRelativeTime(notification.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
