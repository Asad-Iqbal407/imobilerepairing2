"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useData, type Product } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import DynamicText from '@/components/DynamicText';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tag, X } from 'lucide-react';
import { ProductSkeleton } from '@/components/Skeleton';
import { formatPriceByLanguage, resolveImageUrl } from '@/lib/utils';

type CategoryItem = { id: string; label: string; icon: string };

export default function ShopClient() {
  const { addToCart } = useCart();
  const { products, isLoading } = useData();
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 2000 });
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [apiCategories, setApiCategories] = useState<Array<{ id: string; name: string; icon?: string }>>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, string>>({});
  const currencySymbol = '€';
  const fallbackImage = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=1000&auto=format&fit=crop";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) return;
        const data = await res.json();
        const normalized = Array.isArray(data)
          ? data
              .map((c: any) => ({
                id: (c?._id || c?.id || '').toString(),
                name: typeof c?.name === 'string' ? c.name : '',
                icon: typeof c?.icon === 'string' ? c.icon : undefined,
              }))
              .filter((c: any) => c.id && c.name)
          : [];
        setApiCategories(normalized);
      } catch {
        return;
      }
    };

    fetchCategories();
  }, []);

  const getCategoryLabel = (name: string) => {
    const normalized = name.trim().toLowerCase();
    if (normalized === 'new phones') return t.shop.filterNewPhones;
    if (normalized === 'refurbished phones') return t.shop.filterRefurbishedPhones;
    if (normalized === '2nd hand phones') return t.shop.filterSecondHandPhones;
    if (normalized === 'tablets') return t.shop.filterTablets;
    if (normalized === 'cables') return t.shop.filterCables;
    if (normalized === 'chargers') return t.shop.filterChargers;
    if (normalized === 'powerbanks' || normalized === 'power banks') return t.shop.filterPowerbanks;
    if (normalized === 'earbuds') return t.shop.filterEarbuds;
    if (normalized === 'adapters') return t.shop.filterAdapters;
    if (normalized === 'speakers') return t.shop.filterSpeakers;
    if (normalized === 'cases') return t.shop.filterCases;
    if (normalized === 'other') return t.shop.filterOther;
    return name;
  };

  const categories: CategoryItem[] = (() => {
    const fromApi = apiCategories
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({
        id: c.name,
        label: getCategoryLabel(c.name),
        icon: c.icon || '🏷️',
      }));

    const fallback: CategoryItem[] = [
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
      { id: 'Other', label: t.shop.filterOther, icon: '📦' },
    ];

    const base = fromApi.length > 0 ? fromApi : fallback;
    return [{ id: 'All', label: t.shop.filterAll, icon: '🏷️' }, ...base];
  })();

  const activeCategoryItem = categories.find((c) => c.id === activeCategory) || categories[0];

  const filteredProducts = products.filter(product => {
    const name = typeof product.name === 'string' ? product.name : '';
    const description = typeof product.description === 'string' ? product.description : '';
    const category = typeof product.category === 'string' ? product.category : '';
    const price = typeof product.price === 'number' ? product.price : 0;

    // 1. Category Filter
    const matchesCategory = activeCategory === 'All' || 
      category.trim().toLowerCase() === activeCategory.trim().toLowerCase();
    
    // 2. Search Filter
    const matchesSearch = searchQuery === '' || 
      name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      description.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Price Filter
    const matchesPrice = price >= priceRange.min && price <= priceRange.max;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  const categoryOrder = useMemo(() => ([
    'New Phones',
    'Refurbished Phones',
    '2nd Hand Phones',
    'Tablets',
    'Cables',
    'Chargers',
    'Powerbanks',
    'Earbuds',
    'Adapters',
    'Speakers',
    'Cases',
    'Other',
  ]), []);

  const groupedProducts = useMemo(() => {
    const categoryRank = (category: string) => {
      const normalized = category.trim().toLowerCase();
      const idx = categoryOrder.findIndex((c) => c.trim().toLowerCase() === normalized);
      return idx === -1 ? categoryOrder.length : idx;
    };

    const sortByName = (a: Product, b: Product) => (a.name || '').localeCompare((b.name || ''), undefined, { sensitivity: 'base' });

    const groups = new Map<string, Product[]>();
    for (const product of filteredProducts) {
      const key = (product.category || 'Other').trim() || 'Other';
      const existing = groups.get(key);
      if (existing) existing.push(product);
      else groups.set(key, [product]);
    }

    for (const [key, items] of groups) {
      groups.set(key, items.slice().sort(sortByName));
    }

    const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
      const ra = categoryRank(a);
      const rb = categoryRank(b);
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    });

    return { groups, sortedKeys };
  }, [categoryOrder, filteredProducts]);

  const sortedFilteredProducts = useMemo(() => {
    return filteredProducts
      .slice()
      .sort((a, b) => (a.name || '').localeCompare((b.name || ''), undefined, { sensitivity: 'base' }));
  }, [filteredProducts]);

  const categoryMetaById = useMemo(() => {
    const map = new Map<string, CategoryItem>();
    for (const c of categories) {
      if (c.id === 'All') continue;
      map.set(c.id.trim().toLowerCase(), c);
    }
    return map;
  }, [categories]);

  const openProduct = (product: Product) => setSelectedProduct(product);
  const closeProduct = () => setSelectedProduct(null);

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      key={product.id}
      onClick={() => openProduct(product)}
      className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col hover:-translate-y-2 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') openProduct(product);
      }}
    >
      <div className="h-56 sm:h-64 bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <Image
          src={(() => {
            const resolved = resolveImageUrl(product.image, fallbackImage) || fallbackImage;
            return failedImages[product.id] === resolved ? fallbackImage : resolved;
          })()}
          alt={product.name || ''}
          fill
          className="object-contain p-4"
          unoptimized
          onError={() => {
            const resolved = resolveImageUrl(product.image, fallbackImage) || fallbackImage;
            setFailedImages((prev) => (prev[product.id] === resolved ? prev : { ...prev, [product.id]: resolved }));
          }}
        />
      </div>
      <div className="p-5 sm:p-8 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 uppercase tracking-widest border border-blue-100">
              <Tag className="w-3 h-3" />
              <DynamicText text={product.category} />
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            <DynamicText text={product.name} />
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
            <DynamicText text={product.description} />
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openProduct(product);
            }}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {t.shop.learnMore}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">{t.common.price}</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatPriceByLanguage(product.price, language)}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                id: product.id,
                title: product.name,
                price: product.price
              });
            }}
            className="bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 group/btn"
          >
            <Plus className="h-6 w-6 group-hover/btn:rotate-90 transition-transform duration-300" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative py-16 sm:py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-purple-600/10 -skew-x-12 -translate-x-1/4 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              {t.shop.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              {t.shop.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Section */}
          <div className="mb-12 space-y-8">
            {/* Search and Price Filter */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-full md:w-1/2 relative">
                <input
                  type="text"
                  placeholder={t.shop.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                  <span className="text-sm font-bold text-slate-500">{currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder={t.shop.minPrice}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-20 bg-transparent outline-none font-bold text-slate-900"
                  />
                </div>
                <span className="text-slate-400 font-bold">-</span>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                  <span className="text-sm font-bold text-slate-500">{currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder={t.shop.maxPrice}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-20 bg-transparent outline-none font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>

            <div className="md:hidden flex justify-center">
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <button
                  onClick={() => setIsCategoryMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 bg-white text-slate-600 border border-slate-200"
                >
                  <span className="text-lg">{activeCategoryItem.icon}</span>
                  {activeCategoryItem.label}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isCategoryMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-3 w-[min(90vw,360px)] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50"
                    >
                      <div className="max-h-[60vh] overflow-auto">
                        {categories.map((category) => (
                          <button
                            key={`mobile-${category.id}`}
                            onClick={() => {
                              setActiveCategory(category.id);
                              setIsCategoryMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                              activeCategory === category.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-lg">{category.icon}</span>
                            {category.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={`skeleton-${i}`} />
              ))}
            </motion.div>
          ) : activeCategory === 'All' ? (
            <div className="space-y-12">
              {groupedProducts.sortedKeys.map((categoryName) => {
                const items = groupedProducts.groups.get(categoryName) || [];
                if (items.length === 0) return null;
                const meta = categoryMetaById.get(categoryName.trim().toLowerCase());
                return (
                  <div key={categoryName} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{meta?.icon || '🏷️'}</span>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                          {meta?.label || categoryName}
                        </h2>
                      </div>
                      <span className="text-sm font-bold text-slate-500">
                        {items.length}
                      </span>
                    </div>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                      <AnimatePresence mode="popLayout">
                        {items.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <AnimatePresence mode="popLayout">
                {sortedFilteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={closeProduct}
          >
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">
                    <DynamicText text={selectedProduct.name} />
                  </h2>
                  <p className="text-sm font-bold text-slate-500">
                    <DynamicText text={selectedProduct.category} />
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeProduct}
                  className="p-2 rounded-xl hover:bg-slate-200 transition-colors text-slate-500"
                  aria-label={t.shop.close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative h-72 md:h-full min-h-[24rem] bg-slate-100 flex items-center justify-center">
                  <Image
                    src={(() => {
                      const resolved = resolveImageUrl(selectedProduct.image, fallbackImage) || fallbackImage;
                      return failedImages[selectedProduct.id] === resolved ? fallbackImage : resolved;
                    })()}
                    alt={selectedProduct.name || ''}
                    fill
                    className="object-contain p-6"
                    unoptimized
                    onError={() => {
                      const resolved = resolveImageUrl(selectedProduct.image, fallbackImage) || fallbackImage;
                      setFailedImages((prev) => (prev[selectedProduct.id] === resolved ? prev : { ...prev, [selectedProduct.id]: resolved }));
                    }}
                  />
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.common.price}</div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {formatPriceByLanguage(selectedProduct.price, language)}
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart({ id: selectedProduct.id, title: selectedProduct.name, price: selectedProduct.price })}
                      className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                      {t.common.addToCart}
                    </motion.button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-black text-slate-900">{t.shop.details}</div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      <DynamicText text={selectedProduct.description} />
                    </p>
                  </div>

                  {(selectedProduct.condition || typeof selectedProduct.batteryHealth === 'number' || selectedProduct.memory || (selectedProduct.signsOfWear && selectedProduct.signsOfWear.length > 0)) && (
                    <div className="space-y-3">
                      {selectedProduct.condition && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-bold text-slate-500">{t.shop.deviceCondition}</span>
                          <span className="text-sm font-black text-slate-900">{selectedProduct.condition}</span>
                        </div>
                      )}
                      {typeof selectedProduct.batteryHealth === 'number' && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-bold text-slate-500">{t.shop.batteryHealth}</span>
                          <span className="text-sm font-black text-slate-900">{Math.round(selectedProduct.batteryHealth)}%</span>
                        </div>
                      )}
                      {selectedProduct.memory && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-bold text-slate-500">{t.shop.memory}</span>
                          <span className="text-sm font-black text-slate-900">{selectedProduct.memory}</span>
                        </div>
                      )}
                      {selectedProduct.signsOfWear && selectedProduct.signsOfWear.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-bold text-slate-500">{t.shop.signsOfWear}</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.signsOfWear.map((w, idx) => (
                              <span key={`${w}-${idx}`} className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-black text-green-900 leading-none mb-1">{t.shop.refundPolicy}</div>
                        <p className="text-xs text-green-700 font-medium leading-relaxed">
                          {t.shop.refundPolicyDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
