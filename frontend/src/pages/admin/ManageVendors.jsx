import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import * as api from '../../api/api';

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVendors();
  }, [filter]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.adminGetVendors(params);
      setVendors(response.data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateUserStatus(id, status);
      fetchVendors(); // Refresh list
    } catch (err) {
      console.error('Error updating status:', err);
      alert('حدث خطأ أثناء تحديث الحالة');
    }
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">اعتماد مزودي الخدمات</h1>
          <p className="text-slate-500 font-medium">راجعي طلبات الانضمام وتحكمي في صلاحيات المزودين</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative grow">
          <Search className="absolute right-4 top-4 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="البحث عن مزود..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none"
          />
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'pending', label: 'قيد الانتظار' },
            { id: 'active', label: 'مقبول' },
            { id: 'rejected', label: 'مرفوض' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${filter === opt.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Grid */}
      {loading ? (
        <div className="py-40 text-center">
            <Loader2 className="animate-spin text-rose-600 mx-auto mb-4" size={40} />
            <p className="text-slate-500 font-bold">جاري تحميل قائمة المزودين...</p>
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="py-40 text-center bg-white rounded-5xl border-2 border-dashed border-slate-100">
            <AlertCircle className="text-slate-200 mx-auto mb-6" size={64} />
            <p className="text-slate-400 font-black text-xl italic">لا يوجد مزودون في هذا القسم حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-xl group-hover:scale-110 transition-transform">
                    {vendor.name.charAt(0)}
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    vendor.status === 'pending' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                    vendor.status === 'active' ? 'bg-green-100 text-green-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {vendor.status === 'pending' ? 'قيد المراجعة' : 
                     vendor.status === 'active' ? 'نشط' : 'مرفوض'}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2">{vendor.name}</h3>
                <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">مزود خدمة انضم بتاريخ {new Date(vendor.created_at).toLocaleDateString('ar-YE')}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Mail size={16} />
                    <span className="text-sm font-bold truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Phone size={16} />
                    <span className="text-sm font-bold">{vendor.phone || 'غير مسجل'}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {vendor.status !== 'active' && (
                    <button 
                      onClick={() => handleUpdateStatus(vendor.id, 'active')}
                      className="grow bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} />
                      قبول
                    </button>
                  )}
                  {vendor.status !== 'rejected' && (
                    <button 
                      onClick={() => handleUpdateStatus(vendor.id, 'rejected')}
                      className="grow bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      رفض
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                 <button className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                    <MoreVertical size={14} />
                    عرض التفاصيل الكاملة
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageVendors;
