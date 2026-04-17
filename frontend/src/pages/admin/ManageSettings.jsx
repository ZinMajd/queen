import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Upload, 
  Settings as SettingsIcon, 
  Phone, 
  Search, 
  Globe, 
  MapPin, 
  Facebook, 
  Instagram,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { getAdminSettings, updateSettings } from '../../api/api';

const ManageSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await getAdminSettings();
            // Flatten settings for easier form handling
            const flattened = {};
            Object.values(response.data).forEach(group => {
                group.forEach(s => {
                    flattened[s.key] = s.value;
                });
            });
            setSettings(flattened);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSettings({ ...settings, site_logo: file });
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            const formData = new FormData();
            Object.keys(settings).forEach(key => {
                if (key === 'site_logo' && settings[key] instanceof File) {
                    formData.append('site_logo', settings[key]);
                } else if (key !== 'site_logo') {
                    formData.append(key, settings[key] || '');
                }
            });

            await updateSettings(formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('حدث خطأ أثناء حفظ الإعدادات');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="animate-spin text-rose-600" size={64} />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2 mt-4">إعدادات المنصة</h1>
                    <p className="text-slate-500 font-medium text-lg">تحكم في هوية الموقع، بيانات التواصل، والتواصل الاجتماعي من مكان واحد</p>
                </div>
                {success && (
                    <div className="bg-green-50 text-green-600 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold animate-bounce shadow-sm border border-green-100">
                        <CheckCircle2 size={20} /> تم الحفظ بنجاح
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - General & Logo */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-5xl shadow-sm border border-slate-100 space-y-8 text-right">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-rose-100 p-3 rounded-2xl text-rose-600"><SettingsIcon size={24} /></div>
                            <h2 className="text-2xl font-black text-slate-900">الهوية الأساسية</h2>
                        </div>

                        <div className="space-y-6">
                             <div>
                                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">اسم الموقع</label>
                                <input 
                                    name="site_name"
                                    value={settings.site_name || ''}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold"
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">وصف الموقع (Tagline)</label>
                                <input 
                                    name="site_tagline"
                                    value={settings.site_tagline || ''}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold"
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">شعار الموقع (Logo)</label>
                                <div className="flex items-center gap-8">
                                    <div className="w-32 h-32 bg-slate-100 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200 group relative">
                                        {(logoPreview || settings.site_logo) ? (
                                            <img src={logoPreview || `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${settings.site_logo}`} alt="Logo" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <Globe size={48} className="text-slate-200" />
                                        )}
                                        <label className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                            <Upload size={24} />
                                            <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                                        </label>
                                    </div>
                                    <div className="text-slate-400 text-sm font-medium">
                                        <p>يفضل استخدام صورة بخلفية شفافة</p>
                                        <p>بصيغة PNG أو SVG</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-5xl shadow-sm border border-slate-100 space-y-8 text-right">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Phone size={24} /></div>
                            <h2 className="text-2xl font-black text-slate-900">بيانات التواصل</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                             <div>
                                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider text-right">رقم الهاتف</label>
                                <input 
                                    name="contact_phone"
                                    value={settings.contact_phone || ''}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold"
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider text-right">رقم الواتساب</label>
                                <input 
                                    name="contact_whatsapp"
                                    value={settings.contact_whatsapp || ''}
                                    onChange={handleChange}
                                    placeholder="9677XXXXXXXX"
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold"
                                />
                             </div>
                             <div className="md:col-span-2">
                                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider text-right">العنوان</label>
                                <div className="relative">
                                    <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        name="site_address"
                                        value={settings.site_address || ''}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-slate-500 focus:bg-white rounded-2xl py-4 px-6 pl-12 outline-none transition-all font-bold"
                                    />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Social & Save */}
                <div className="space-y-8">
                     <div className="bg-white p-10 rounded-5xl shadow-sm border border-slate-100 space-y-8">
                        <h3 className="text-xl font-black text-slate-900 mb-6 text-right">التواصل الاجتماعي</h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Instagram className="text-rose-500" size={24} />
                                <input 
                                    name="instagram_url"
                                    value={settings.instagram_url || ''}
                                    onChange={handleChange}
                                    placeholder="رابط انستقرام"
                                    className="grow bg-slate-50 border-b-2 border-transparent focus:border-rose-500 rounded-xl py-3 px-4 outline-none transition-all font-bold"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <Facebook className="text-blue-600" size={24} />
                                <input 
                                    name="facebook_url"
                                    value={settings.facebook_url || ''}
                                    onChange={handleChange}
                                    placeholder="رابط فيسبوك"
                                    className="grow bg-slate-50 border-b-2 border-transparent focus:border-blue-600 rounded-xl py-3 px-4 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>
                     </div>

                     <button 
                        type="submit"
                        disabled={saving}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-rose-900/40 transition-all flex items-center justify-center gap-4 disabled:opacity-50 group hover:scale-[1.02] active:scale-95"
                     >
                        {saving ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <Save size={24} className="group-hover:rotate-12 transition-transform" />
                                حفظ جميع التغييرات
                            </>
                        )}
                     </button>

                     <div className="bg-rose-50 p-8 rounded-4xl border border-rose-100">
                        <h4 className="text-rose-600 font-black mb-3">تنبيه إداري</h4>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed text-right">
                            التعديلات في هذه الصفحة ستؤثر مباشرة على واجهة المستخدم الرئيسية وتطبيق العرائس. يرجى التأكد من دقة المعلومات المدخلة.
                        </p>
                     </div>
                </div>
            </form>
        </div>
    );
};

export default ManageSettings;
