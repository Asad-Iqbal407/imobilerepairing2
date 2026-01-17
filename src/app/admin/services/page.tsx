'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useData, Service } from '@/context/DataContext';
import { getServiceEmoji } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import DynamicText from '@/components/DynamicText';

export default function ManageServices() {
  const { services, addService, updateService, deleteService } = useData();
  const { t } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentService, setCurrentService] = useState<Service>({
    id: '',
    title: '',
    description: '',
    price: 0,
    image: '',
  });

  // Simulate loading state for consistency with other pages
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isValidUrl = (url: string) => {
    try {
      if (!url || typeof url !== 'string') return false;
      if (url.startsWith('/uploads/')) return true;
      if (!url.startsWith('http') && !url.startsWith('/')) return false;
      new URL(url.startsWith('http') ? url : `http://localhost${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(t.admin.uploadFailed);

      const data = await response.json();
      setCurrentService({ ...currentService, image: data.url });
    } catch (error) {
      console.error('Upload error:', error);
      alert(t.admin.uploadError);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateService(currentService);
      } else {
        await addService({ ...currentService, id: Date.now().toString() });
      }
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t.admin.saveError);
    }
  };

  const handleEdit = (service: Service) => {
    setCurrentService({
      id: service.id || '',
      title: service.title || '',
      description: service.description || '',
      price: service.price || 0,
      image: service.image || '',
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t.admin.confirmDelete)) {
      deleteService(id);
    }
  };

  const resetForm = () => {
    setCurrentService({ id: '', title: '', description: '', price: 0, image: '' });
    setIsEditing(false);
  };

  const totalServices = services.length;
  const avgPrice = services.length > 0 
    ? services.reduce((sum, s) => sum + s.price, 0) / services.length 
    : 0;
  const premiumServices = services.filter(s => s.price >= 100).length;
  const entryServices = services.filter(s => s.price < 50).length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.admin.manageServices}</h1>
          <p className="text-slate-500 mt-1">{t.admin.manageServicesDesc}</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t.admin.addService}
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.totalServices}</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalServices}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.avgPrice}</p>
              <h3 className="text-2xl font-bold text-slate-900">{t.admin.currencySymbol}{Math.round(avgPrice)}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.premium} (+{t.admin.currencySymbol}100)</p>
              <h3 className="text-2xl font-bold text-slate-900">{premiumServices}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.entry} (&lt;{t.admin.currencySymbol}50)</p>
              <h3 className="text-2xl font-bold text-slate-900">{entryServices}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t.admin.searchServices}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.admin.serviceDetails}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{t.admin.startingPrice}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 relative shrink-0">
                        {service.image ? (
                          <Image 
                            src={isValidUrl(service.image) ? service.image : "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop"} 
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">{getServiceEmoji(service.title, service.description)}</div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{getServiceEmoji(service.title, service.description)}</span>
                          <DynamicText text={service.title} />
                        </span>
                        <span className="text-xs text-slate-500 line-clamp-1"><DynamicText text={service.description} /></span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-700">
                      {t.admin.currencySymbol}{service.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title={t.admin.editService}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title={t.admin.delete}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.admin.noServicesFound}</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">{t.admin.noServicesFoundDesc}</p>
          </div>
        )}
      </div>

      {/* Form Slide-over/Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFormOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">{isEditing ? t.admin.editService : t.admin.addService}</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} id="service-form" className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.admin.serviceTitle}</label>
                <input
                    type="text"
                    required
                    placeholder={t.admin.serviceTitlePlaceholder}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    value={currentService.title || ''}
                    onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.admin.serviceImage}</label>
                  <div className="flex flex-col gap-4">
                    {/* File Upload */}
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                          isUploading 
                            ? 'bg-slate-50 border-slate-200 cursor-not-allowed' 
                            : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-sm font-medium text-slate-500">{t.admin.uploading}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-sm font-medium text-slate-500">{t.admin.uploadLocal}</span>
                          </div>
                        )}
                      </label>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">{t.admin.orUseUrl}</span>
                      </div>
                    </div>

                    {/* URL Input */}
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                      value={currentService.image || ''}
                      onChange={(e) => setCurrentService({ ...currentService, image: e.target.value })}
                    />
                  </div>
                  {currentService.image && (
                    <div className="mt-4 w-full h-48 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center relative group/preview">
                      <Image 
                        src={isValidUrl(currentService.image) ? currentService.image : "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop"} 
                        alt="Preview" 
                        fill
                        className="object-cover transition-transform duration-500 group-hover/preview:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">{t.admin.preview}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.admin.description}</label>
                  <textarea
                    required
                    rows={4}
                    placeholder={t.admin.descriptionPlaceholder}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium resize-none"
                    value={currentService.description || ''}
                    onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.admin.price} ({t.admin.currencySymbol})</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{t.admin.currencySymbol}</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-bold"
                      value={currentService.price || 0}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        setCurrentService({ ...currentService, price: isNaN(val) ? 0 : val });
                      }}
                    />
                  </div>
                <p className="text-[11px] text-slate-400 font-medium italic mt-1 uppercase tracking-tighter">{t.admin.startingPriceDesc}</p>
              </div>
            </form>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-white/80 transition-all"
              >
                {t.admin.cancel}
              </button>
              <button
                type="submit"
                form="service-form"
                className="flex-[2] py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                {isEditing ? t.admin.saveChanges : t.admin.createService}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
