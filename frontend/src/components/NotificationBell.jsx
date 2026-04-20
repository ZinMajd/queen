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
        try {
            const response = await api.getNotifications();
            if (response.data) {
                setNotifications(response.data.notifications || []);
                setUnreadCount(response.data.unread_count || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Automatic polling every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            clearInterval(interval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.markNotificationRead(id);
            // Local update to avoid flicker
            setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date() } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        setLoading(true);
        try {
            await api.markAllNotificationsRead();
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date() })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('هل أنت متأكد من مسح جميع الإشعارات؟')) return;
        setLoading(true);
        try {
            await api.clearAllNotifications();
            setNotifications([]);
            setUnreadCount(0);
            setIsOpen(false);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-2xl transition-all border border-slate-100 hover:bg-slate-50 group ${isOpen ? 'bg-rose-50 border-rose-100' : 'bg-white'}`}
            >
                <Bell size={22} className={isOpen ? 'text-rose-600' : 'text-slate-600 group-hover:text-rose-600'} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                        {unreadCount > 9 ? '+9' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 mt-4 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
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
                                {notifications.map((notification) => (
                                    <div 
                                        key={notification.id}
                                        className={`p-5 flex gap-4 hover:bg-slate-50/80 transition-all cursor-pointer group/item text-right ${!notification.read_at ? 'bg-rose-50/30' : ''}`}
                                        onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-sm ${notification.data.type === 'booking_status' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                                            {notification.data.type === 'booking_status' ? <MessageSquare size={20} /> : <UserCheck size={20} />}
                                        </div>
                                        <div className="grow space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                                                    <Clock size={10} /> {formatDate(notification.created_at)}
                                                </span>
                                                {!notification.read_at && <div className="w-2 h-2 bg-rose-600 rounded-full shrink-0 mt-1"></div>}
                                            </div>
                                            <p className={`text-sm leading-relaxed ${!notification.read_at ? 'font-black text-slate-900' : 'font-medium text-slate-400'}`}>
                                                {notification.data.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
                            <button className="text-xs font-black text-slate-400 hover:text-rose-600 transition-colors uppercase tracking-widest">إغلاق القائمة</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
