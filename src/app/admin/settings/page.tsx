"use client";

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSettingsPage() {
  const { t } = useLanguage();
  const [logoDataUri, setLogoDataUri] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/site-settings', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { logoDataUri?: string };
        if (!cancelled) setLogoDataUri(typeof data.logoDataUri === 'string' ? data.logoDataUri : '');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasLogo = useMemo(() => Boolean(logoDataUri && logoDataUri.startsWith('data:image/')), [logoDataUri]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'upload-failed');
      }
      const data = (await res.json()) as { url?: string };
      const url = typeof data.url === 'string' ? data.url : '';
      if (!url.startsWith('data:image/')) throw new Error('invalid-upload');
      setLogoDataUri(url);
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      alert(msg || t.admin.uploadError);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const save = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoDataUri }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'save-failed');
      }
      localStorage.setItem('site-logo-updated-at', String(Date.now()));
      window.dispatchEvent(new Event('site-logo-updated'));
      alert('Saved');
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      alert(msg || t.admin.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.admin.settings || 'Settings'}</h1>
          <p className="text-slate-500 mt-1">Update website logo used in navbar and home page.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logo Configuration</p>
              <p className="text-sm text-slate-600 font-medium">
                Upload your logo. It will be stored in the database as a Base64 image and used across the site.
              </p>
            </div>

            <div className="relative group">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <div className={`p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer ${
                  isUploading 
                    ? 'border-slate-200 bg-slate-50' 
                    : 'border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/30'
                }`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all ${
                      isUploading ? 'bg-slate-200 text-slate-400 animate-pulse' : 'bg-blue-50 text-blue-600 group-hover:scale-110'
                    }`}>
                      {isUploading ? (
                        <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{t.admin.uploadLocal}</p>
                      <p className="text-xs text-slate-500 font-medium">PNG, JPG or SVG recommended.</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={save}
                disabled={isLoading || isSaving || !hasLogo}
                className="flex-1 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Configuration'}
              </button>
              <button
                onClick={() => setLogoDataUri('')}
                disabled={isSaving || !logoDataUri}
                className="px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logo Preview</p>
            <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-10 flex items-center justify-center min-h-[320px] shadow-inner">
              {hasLogo ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in zoom-in duration-300">
                  <img src={logoDataUri} alt="Logo preview" className="max-h-48 w-auto object-contain" />
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-4xl">
                    🖼️
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold">No logo saved yet</p>
                    <p className="text-slate-500 text-sm font-medium">Upload and save to update the website.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
