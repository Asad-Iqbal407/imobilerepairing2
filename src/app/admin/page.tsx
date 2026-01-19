'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface Stats {
  orders: number;
  revenue: number;
  quotes: number;
  messages: number;
  products: number;
  services: number;
  posts: number;
}

interface Activity {
  id: string;
  type: 'order' | 'quote' | 'message';
  title: string;
  subtitle: string;
  time: string;
  status?: string;
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    orders: 0,
    revenue: 0,
    quotes: 0,
    messages: 0,
    products: 0,
    services: 0,
    posts: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [ordersRes, quotesRes, messagesRes, productsRes, servicesRes, postsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/quotes'),
        fetch('/api/contact'),
        fetch('/api/products'),
        fetch('/api/services'),
        fetch('/api/posts'),
      ]);

      const orders = await ordersRes.json();
      const quotes = await quotesRes.json();
      const messages = await messagesRes.json();
      const products = await productsRes.json();
      const services = await servicesRes.json();
      const posts = await postsRes.json();

      const totalRevenue = Array.isArray(orders)
        ? orders.reduce((acc: number, order: any) => acc + (order.total || 0), 0)
        : 0;

      setStats({
        orders: Array.isArray(orders) ? orders.length : 0,
        revenue: totalRevenue,
        quotes: Array.isArray(quotes) ? quotes.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        services: Array.isArray(services) ? services.length : 0,
        posts: Array.isArray(posts) ? posts.length : 0,
      });

      const recentActivities: Activity[] = [];

      if (Array.isArray(orders)) {
        orders.slice(0, 3).forEach((order: any) => {
          recentActivities.push({
            id: order._id || Math.random().toString(),
            type: 'order',
            title: `${t.admin.newOrder} #${(order._id || '').slice(-6)}`,
            subtitle: `${order.customerName || t.admin.unknown} - ${t.admin.currencySymbol}${order.total || 0}`,
            time: order.createdAt || new Date().toISOString(),
            status: order.status,
          });
        });
      }

      if (Array.isArray(quotes)) {
        quotes.slice(0, 3).forEach((quote: any) => {
          recentActivities.push({
            id: quote._id || Math.random().toString(),
            type: 'quote',
            title: t.admin.quoteRequest,
            subtitle: `${quote.name || t.admin.unknown} - ${quote.service || t.admin.general}`,
            time: quote.createdAt || new Date().toISOString(),
          });
        });
      }

      if (Array.isArray(messages)) {
        messages.slice(0, 3).forEach((msg: any) => {
          recentActivities.push({
            id: msg._id || Math.random().toString(),
            type: 'message',
            title: t.admin.newMessage,
            subtitle: `${t.admin.from} ${msg.name || t.admin.unknown}`,
            time: msg.createdAt || new Date().toISOString(),
          });
        });
      }

      setActivities(
        recentActivities
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 5)
      );
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const statCards = [
    {
      label: t.admin.totalRevenue,
      value: `${t.admin.currencySymbol}${stats.revenue.toLocaleString()}`,
      href: '/admin/orders',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-emerald-500',
      trend: '+12.5%',
    },
    {
      label: t.admin.totalOrders,
      value: stats.orders.toString(),
      href: '/admin/orders',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'bg-blue-500',
      trend: '+3.2%',
    },
    {
      label: t.admin.quoteRequests,
      value: stats.quotes.toString(),
      href: '/admin/quotes',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-amber-500',
      trend: '+5.4%',
    },
    {
      label: t.admin.newMessages,
      value: stats.messages.toString(),
      href: '/admin/messages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
      color: 'bg-purple-500',
      trend: '-2.1%',
    },
    {
      label: t.admin.blogPosts,
      value: stats.posts.toString(),
      href: '/admin/blogs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'bg-indigo-500',
      trend: t.admin.new,
    },
  ];

  const handleExport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      stats,
      recentActivities: activities
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t.admin.dashboardOverview}</h1>
          <p className="text-slate-500 mt-2 text-lg">{t.admin.welcomeBack}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={handleExport}
            className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t.admin.exportReport}
          </button>
          <Link href="/admin/services" className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t.admin.addService}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card) => (
          <Link 
            key={card.label} 
            href={card.href}
            className="group relative bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${card.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  card.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 
                  card.trend === t.admin.new ? 'bg-blue-50 text-blue-600' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  {card.trend}
                </div>
              </div>
              <div>
                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{card.label}</h3>
                <p className="text-3xl font-black text-slate-900 tabular-nums">{card.value}</p>
              </div>
            </div>
            {/* Background Decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${card.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t.admin.recentActivity}</h2>
                <p className="text-slate-500 text-sm mt-1">Keep track of what&apos;s happening</p>
              </div>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '200ms' }}></span>
                <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '400ms' }}></span>
              </div>
            </div>
            
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="group flex items-center gap-5 p-4 hover:bg-slate-50 rounded-2xl transition-all duration-200 border border-transparent hover:border-slate-100">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-105 ${
                      activity.type === 'order' ? 'bg-blue-50 text-blue-600' :
                      activity.type === 'quote' ? 'bg-amber-50 text-amber-600' :
                      'bg-purple-50 text-purple-600'
                    }`}>
                      {activity.type === 'order' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      )}
                      {activity.type === 'quote' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {activity.type === 'message' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-base font-bold text-slate-900 truncate tracking-tight">{activity.title}</p>
                        <span className="text-xs font-bold text-slate-400 tabular-nums">
                          {new Date(activity.time).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-500 truncate font-medium">{activity.subtitle}</p>
                        {activity.status && (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        )}
                        {activity.status && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {activity.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 font-bold text-lg">{t.admin.noRecentActivity}</p>
                </div>
              )}
            </div>
            <Link 
              href="/admin/orders" 
              className="mt-8 flex items-center justify-center w-full py-4 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-2xl transition-all"
            >
              {t.admin.viewAll}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-3xl shadow-2xl text-white overflow-hidden relative group">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black mb-3 tracking-tight">{t.admin.needHelp}</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">{t.admin.supportDesc}</p>
              <Link 
                href="/admin/messages"
                className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all text-center active:scale-95 shadow-xl shadow-blue-600/20"
              >
                {t.admin.supportCenter}
              </Link>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{t.admin.systemHealth}</h2>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 font-bold">{t.admin.databaseStatus}</span>
                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                  {t.admin.connected}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 font-bold">{t.admin.stripeApi}</span>
                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                  {t.admin.online}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 font-bold">{t.admin.storage}</span>
                  <span className="text-xs font-black text-slate-900 tabular-nums">2.4GB / 5.0GB</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="w-[48%] bg-blue-600 h-full rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
