"use client";

import { useState, useEffect, Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CameraIcon, XMarkIcon, PhotoIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, ClockIcon, DeviceTabletIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import { isValidEmail } from '@/lib/utils';

function QuoteForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    category: '',
    part: '',
    deviceType: '',
    problem: '',
    name: '',
    email: '',
    phone: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const service = searchParams.get('service');
    if (service) {
      // Try to map the service title to a part if possible
      const lowerService = service.toLowerCase();
      let partKey = '';
      if (lowerService.includes('screen')) partKey = 'screen';
      else if (lowerService.includes('battery')) partKey = 'battery';
      else if (lowerService.includes('charging')) partKey = 'chargingPort';
      else if (lowerService.includes('camera')) partKey = 'camera';
      else if (lowerService.includes('water')) partKey = 'waterDamage';
      else if (lowerService.includes('software')) partKey = 'software';
      
      setFormData(prev => ({ 
        ...prev, 
        part: partKey || 'other',
        problem: `Interested in: ${service}\n` 
      }));
    }
  }, [searchParams]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const remainingSlots = 3 - images.length;
      const filesToAdd = selectedFiles.slice(0, remainingSlots);

      if (filesToAdd.length > 0) {
        const newImages = [...images, ...filesToAdd];
        setImages(newImages);

        const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      setEmailError('Please enter a valid email address.');
      // Scroll to email field or just let the user see the error
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Convert images to base64 strings
      const base64Images = await Promise.all(
        images.map(file => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        }))
      );

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: formData.category,
          part: formData.part,
          deviceModel: formData.deviceType,
          problem: formData.problem,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          images: base64Images,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');
      
      setMessage({ type: 'success', text: t.getQuote.success });
      setFormData({ 
        category: '', 
        part: '', 
        deviceType: '', 
        problem: '',
        name: '',
        email: '',
        phone: '',
      });
      setImages([]);
      previews.forEach(url => URL.revokeObjectURL(url));
      setPreviews([]);
    } catch (error) {
      setMessage({ type: 'error', text: t.getQuote.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: 'smartphones', name: t.getQuote.categories.smartphones, icon: DevicePhoneMobileIcon },
    { id: 'tablets', name: t.getQuote.categories.tablets, icon: DeviceTabletIcon },
    { id: 'laptops', name: t.getQuote.categories.laptops, icon: ComputerDesktopIcon },
    { id: 'smartwatches', name: t.getQuote.categories.smartwatches, icon: ClockIcon },
    { id: 'others', name: t.getQuote.categories.others, icon: SquaresPlusIcon },
  ];

  const parts = [
    { id: 'screen', name: t.getQuote.parts.screen },
    { id: 'battery', name: t.getQuote.parts.battery },
    { id: 'chargingPort', name: t.getQuote.parts.chargingPort },
    { id: 'camera', name: t.getQuote.parts.camera },
    { id: 'waterDamage', name: t.getQuote.parts.waterDamage },
    { id: 'software', name: t.getQuote.parts.software },
    { id: 'buttons', name: t.getQuote.parts.buttons },
    { id: 'other', name: t.getQuote.parts.other },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative py-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-purple-600/10 -skew-x-12 -translate-x-1/4 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              {t.getQuote.title}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              {t.getQuote.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24 relative z-20">
        <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100">
          <div className="md:grid md:grid-cols-5">
            {/* Left Sidebar - Info */}
            <div className="bg-blue-600 p-8 text-white md:col-span-2 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-6">Why get a quote?</h2>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="bg-blue-500 p-2 rounded-lg mr-4">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Free Estimate</p>
                      <p className="text-blue-100 text-sm">No commitment required.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-500 p-2 rounded-lg mr-4">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Fast Response</p>
                      <p className="text-blue-100 text-sm">Usually within 1-2 hours.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-500 p-2 rounded-lg mr-4">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Quality Parts</p>
                      <p className="text-blue-100 text-sm">Only premium components.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mt-12 pt-8 border-t border-blue-500">
                <p className="text-blue-100 text-sm italic">&quot;Fastest repair service I&apos;ve ever used. Got my quote and fixed the same day!&quot;</p>
                <p className="mt-2 font-bold">- John D.</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 md:col-span-3">
              {message && (
                <div className={`mb-8 p-4 rounded-xl flex items-center ${
                  message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t.getQuote.category}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 ${
                          formData.category === cat.id
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-blue-200 hover:bg-white'
                        }`}
                      >
                        <cat.icon className="h-6 w-6 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Part Selection */}
                  <div>
                    <label htmlFor="part" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.getQuote.partToFix}
                    </label>
                    <select
                      id="part"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-gray-50 appearance-none"
                      value={formData.part}
                      onChange={(e) => setFormData({ ...formData, part: e.target.value })}
                    >
                      <option value="">{t.getQuote.selectPart}</option>
                      {parts.map(part => (
                        <option key={part.id} value={part.id}>{part.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Device Model */}
                  <div>
                    <label htmlFor="deviceType" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.getQuote.deviceType}
                    </label>
                    <input
                      type="text"
                      id="deviceType"
                      required
                      placeholder={t.getQuote.deviceTypePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-gray-50"
                      value={formData.deviceType}
                      onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                    />
                  </div>
                </div>

                {/* Problem Description */}
                <div>
                  <label htmlFor="problem" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.getQuote.problem}
                  </label>
                  <textarea
                    id="problem"
                    required
                    rows={3}
                    placeholder={t.getQuote.problemPlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none resize-none bg-gray-50"
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.contact.name}
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-gray-50"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.contact.email}
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className={`w-full px-4 py-3 rounded-xl border ${emailError ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-gray-50`}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (emailError) setEmailError('');
                        }}
                      />
                      {emailError && <p className="mt-1 text-xs text-red-600 font-bold">{emailError}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.contact.phone || 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-gray-50"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t.getQuote.uploadImages}
                  </label>
                  
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    {previews.map((url, index) => (
                      <div key={url} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group">
                        <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-200"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < 3 && (
                      <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                        <PhotoIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-xs font-bold text-gray-500 mt-2 group-hover:text-blue-600">Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={images.length >= 3}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                    {images.length}/3 images uploaded
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-200 relative overflow-hidden group ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-2xl active:transform active:scale-[0.98]'
                  }`}
                >
                  <span className={`flex items-center justify-center transition-all duration-200 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                    {t.getQuote.submit}
                    <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  {isSubmitting && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GetQuote() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your quote form...</p>
        </div>
      </div>
    }>
      <QuoteForm />
    </Suspense>
  );
}
