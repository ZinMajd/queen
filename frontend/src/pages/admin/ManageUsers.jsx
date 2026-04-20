import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  Loader2, 
  Mail, 
  Phone, 
  Shield, 
  Store, 
  Trash2,
  CheckCircle,
  Clock
} from 'lucide-react';
import * as api from '../../api/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.adminGetUsers();
      // Handle Laravel pagination: response.data.data
      setUsers(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateUserStatus(id, status);
      // Update local state for immediate feedback
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    } catch (err) {
      console.error('Status update error:', err);
      alert('حدث خطأ أثناء تحديث حالة المستخدم');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنتِ متأكدة من حذف هذا المستخدم نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await api.deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (user) => {
    if (user.role === 'إدارة') return <span className="bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-xs font-black border border-purple-100 flex items-center gap-2"><Shield size={14} /> مسؤول النظام</span>;
    
    if (user.status === 'active') {
      return <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-black border border-green-100 flex items-center gap-2"><CheckCircle size={14} /> نشط</span>;
    }
    return <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-xs font-black border border-amber-100 flex items-center gap-2"><Clock size={14} /> قيد المراجعة</span>;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">إدارة المستخدمين</h1>
          <p className="text-slate-500 font-medium text-lg">تحكمي في صلاحيات العميلات وفعّلي حسابات مزودي الخدمات الجدد</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
           <div className="text-right">
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">إجمالي المستخدمين</p>
             <p className="text-2xl font-black text-slate-900">{users.length}</p>
           </div>
           <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
             <Users size={24} />
           </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative grow">
          <Search className="absolute right-4 top-4 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="البحث بالاسم أو البريد الإلكتروني..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
          >
            <option value="all">كل الرتب</option>
            <option value="عروس">العرائس</option>
            <option value="مزود خدمة">مزودي الخدمات</option>
            <option value="إدارة">المسؤولين</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="animate-spin text-rose-600" size={48} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-slate-400 text-xs font-black uppercase tracking-widest">المستخدم</th>
                  <th className="px-8 py-5 text-slate-400 text-xs font-black uppercase tracking-widest">الرتبة</th>
                  <th className="px-8 py-5 text-slate-400 text-xs font-black uppercase tracking-widest">الحالة</th>
                  <th className="px-8 py-5 text-slate-400 text-xs font-black uppercase tracking-widest">تاريخ الانضمام</th>
                  <th className="px-8 py-5 text-slate-400 text-xs font-black uppercase tracking-widest">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black shadow-md">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{user.name}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-bold mt-1">
                            <span className="flex items-center gap-1"><Mail size={12} /> {user.email}</span>
                            {user.phone && <span className="flex items-center gap-1"><Phone size={12} /> {user.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 font-bold text-slate-600">
                        {user.role === 'مزود خدمة' ? <Store size={16} className="text-rose-500" /> : user.role === 'عروس' ? <Shield size={16} className="text-blue-500" /> : <Shield size={16} className="text-purple-500" />}
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString('ar-YE')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {user.role === 'مزود خدمة' && user.status === 'pending' && (
                          <button 
                            onClick={() => handleUpdateStatus(user.id, 'active')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-green-900/20 transition-all active:scale-95"
                          >
                            تفعيل الحساب
                          </button>
                        )}
                        {user.role !== 'إدارة' && (
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="حذف المستخدم"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
