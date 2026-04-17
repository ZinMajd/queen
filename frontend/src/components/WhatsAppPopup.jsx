import React from 'react';
import { X, MessageCircle, Phone } from 'lucide-react';

const PHONE = '967777512939';

const WhatsAppPopup = ({ isOpen, onClose, message = '' }) => {
  if (!isOpen) return null;

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(message);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${PHONE}&text=${text}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${PHONE}&text=${text}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900 bg-opacity-60"
        onClick={onClose}
      />

      {/* Popup Card */}
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-[#25D366] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2.5 rounded-2xl">
              <MessageCircle className="text-white" size={28} />
            </div>
            <div className="text-right">
              <h3 className="text-white font-black text-xl">واتساب</h3>
              <p className="text-white text-opacity-80 text-xs font-bold">تواصل مباشر مع الملكة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-xl transition-all text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 text-right space-y-6">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-2">رقم التواصل</p>
            <p className="text-2xl font-black text-slate-900 tracking-wider" dir="ltr">
              +967 777 512 939
            </p>
          </div>

          {message && (
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <p className="text-xs text-green-600 font-black uppercase tracking-widest mb-1">الرسالة</p>
              <p className="text-sm text-slate-700 font-bold">{message}</p>
            </div>
          )}

          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-[#25D366] hover:bg-[#1ebe5e] text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-green-200 flex items-center justify-center gap-3 active:scale-95"
          >
            <MessageCircle size={24} />
            فتح تطبيق واتساب
          </button>

          <a
            href={`tel:+${PHONE}`}
            onClick={(e) => {
               if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                 e.preventDefault();
                 navigator.clipboard.writeText(`+${PHONE}`);
                 alert(`أنت تتصفح من الكمبيوتر، تم نسخ رقم الهاتف: +${PHONE}`);
               }
            }}
            className="w-full bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-700 hover:text-slate-900 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Phone size={20} />
            اتصال هاتفي مباشر
          </a>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPopup;
