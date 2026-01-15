"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useData, Product } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ManageProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const { t, language } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: '',
    name: '',
    category: 'New Phones',
    price: 0,
    image: '',
    description: '',
  });

  // Simulate loading state for consistency with other pages
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'All', label: t.admin.all, icon: '🏷️' },
    { id: 'New Phones', label: t.shop.filterNewPhones, icon: '📱' },
    { id: 'Refurbished Phones', label: t.shop.filterRefurbishedPhones, icon: '🔄' },
    { id: '2nd Hand Phones', label: t.shop.filterSecondHandPhones, icon: '🤝' },
    { id: 'Tablets', label: t.shop.filterTablets, icon: '📟' },
    { id: 'Cables', label: t.shop.filterCables, icon: '🔌' },
    { id: 'Chargers', label: t.shop.filterChargers, icon: '⚡' },
    { id: 'Powerbanks', label: t.shop.filterPowerbanks, icon: '🔋' },
    { id: 'Earbuds', label: t.shop.filterEarbuds, icon: '🎧' },
    { id: 'Adapters', label: t.shop.filterAdapters, icon: '🔌' },
    { id: 'Speakers', label: t.shop.filterSpeakers, icon: '🔊' },
    { id: 'Cases', label: t.shop.filterCases, icon: '📱' },
    { id: 'Other', label: t.shop.filterOther, icon: '📦' }
  ];

  const isValidUrl = (url: string) => {
    try {
      if (!url || typeof url !== 'string') return false;
      if (url.startsWith('data:image')) return true;
      if (url.startsWith('/uploads/')) return true;
      if (!url.startsWith('http') && !url.startsWith('/')) return false;
      new URL(url.startsWith('http') ? url : `http://localhost${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct(currentProduct);
      } else {
        await addProduct({ ...currentProduct, id: Date.now().toString() });
      }
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t.admin.saveError);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct({
      id: product.id || '',
      name: product.name || '',
      category: product.category || 'New Phones',
      price: product.price || 0,
      image: product.image || '',
      description: product.description || '',
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        const width = scale < 1 ? MAX_WIDTH : img.width;
        const height = scale < 1 ? img.height * scale : img.height;

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });
              resolve(newFile);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          }, 'image/jpeg', 0.7);
        } else {
          reject(new Error('Canvas context failed'));
        }
      };
      img.onerror = (e) => reject(e);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Resize image before upload to avoid large payloads
      const resizedFile = await resizeImage(file);
      
      const formData = new FormData();
      formData.append('file', resizedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setCurrentProduct({ ...currentProduct, image: data.url });
    } catch (error) {
      console.error('Upload error:', error);
      alert(t.admin.uploadError);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(t.admin.confirmDelete)) {
      deleteProduct(id);
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      id: '',
      name: '',
      category: 'New Phones',
      price: 0,
      image: '',
      description: '',
    });
    setIsEditing(false);
  };

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const categoriesCount = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.admin.manageProducts}</h1>
          <p className="text-slate-500 mt-1">{t.admin.manageProductsDesc}</p>
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
          {t.admin.addProduct}
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.admin.totalProducts}</p>
              <p className="text-2xl font-bold text-slate-900">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.admin.inventoryValue}</p>
              <p className="text-2xl font-bold text-slate-900">{t.admin.currencySymbol}{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.admin.phonesAndTablets}</p>
              <p className="text-2xl font-bold text-slate-900">
                {(categoriesCount['New Phones'] || 0) + (categoriesCount['Refurbished Phones'] || 0) + (categoriesCount['2nd Hand Phones'] || 0) + (categoriesCount['Tablets'] || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.admin.allAccessories}</p>
              <p className="text-2xl font-bold text-slate-900">
                {(categoriesCount['Cables'] || 0) + 
                 (categoriesCount['Chargers'] || 0) + 
                 (categoriesCount['Powerbanks'] || 0) + 
                 (categoriesCount['Earbuds'] || 0) + 
                 (categoriesCount['Adapters'] || 0) + 
                 (categoriesCount['Speakers'] || 0) + 
                 (categoriesCount['Cases'] || 0) +
                 (categoriesCount['Other'] || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t.admin.searchProducts}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.admin.productName}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.admin.category}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{t.admin.price}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-100 flex items-center justify-center relative">
                        {product.image ? (
                          <Image 
                            src={isValidUrl(product.image) ? product.image : "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=1000&auto=format&fit=crop"} 
                            alt={product.name} 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{product.name}</span>
                        <span className="text-slate-500 text-sm line-clamp-1 max-w-[200px]">{product.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      product.category.includes('Phone') ? 'bg-blue-50 text-blue-700' :
                      product.category === 'Tablets' ? 'bg-purple-50 text-purple-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      <span>{categories.find(c => c.id === product.category)?.icon || '📦'}</span>
                      {categories.find(c => c.id === product.category)?.label || product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-700">
                      {t.admin.currencySymbol}{product.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title={t.admin.editProduct}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.admin.noProductsFound}</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">{t.admin.noProductsFoundDesc}</p>
          </div>
        )}
      </div>

      {/* Form Slide-over/Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFormOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">{isEditing ? t.admin.editProduct : t.admin.addProduct}</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} id="product-form" className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.admin.productName}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 15 Pro"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                  value={currentProduct.name || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.admin.category}</label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium appearance-none"
                    value={currentProduct.category || 'New Phones'}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value as any })}
                  >
                    {categories.filter(c => c.id !== 'All').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.admin.productImage}</label>
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
                  <div className="relative">
                    <input
                      type="text"
                      required={!currentProduct.image}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium disabled:text-slate-500 disabled:bg-slate-100"
                      value={currentProduct.image?.startsWith('data:') ? 'Image uploaded successfully (Base64)' : (currentProduct.image || '')}
                      onChange={(e) => {
                        if (!currentProduct.image?.startsWith('data:')) {
                          setCurrentProduct({ ...currentProduct, image: e.target.value })
                        }
                      }}
                      disabled={currentProduct.image?.startsWith('data:')}
                    />
                    {currentProduct.image && (
                      <button 
                        type="button"
                        onClick={() => setCurrentProduct({ ...currentProduct, image: '' })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                        title={t.admin.clearImage}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                {currentProduct.image && (
                  <div className="mt-2 w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative">
                    <Image 
                      src={isValidUrl(currentProduct.image) ? currentProduct.image : "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=1000&auto=format&fit=crop"} 
                      alt="Preview" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                )}
              </div>
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
                    value={currentProduct.price || 0}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setCurrentProduct({ ...currentProduct, price: isNaN(val) ? 0 : val });
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.admin.description}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={t.admin.descriptionPlaceholder}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium resize-none"
                  value={currentProduct.description || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                />
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
                form="product-form"
                className="flex-[2] py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                {isEditing ? t.admin.saveChanges : t.admin.addProduct}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

