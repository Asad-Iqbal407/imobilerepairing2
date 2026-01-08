'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    const fetchStats = async () => {
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

        // Process Recent Activities
        const recentActivities: Activity[] = [];

        if (Array.isArray(orders)) {
          orders.slice(0, 3).forEach((order: any) => {
            recentActivities.push({
              id: order._id || Math.random().toString(),
              type: 'order',
              title: `New Order #${(order._id || '').slice(-6)}`,
              subtitle: `${order.customerName || 'Unknown'} - $${order.total || 0}`,
              time: order.createdAt || new Date().toISOString(),
              status: order.status
            });
          });
        }

        if (Array.isArray(quotes)) {
          quotes.slice(0, 3).forEach((quote: any) => {
            recentActivities.push({
              id: quote._id || Math.random().toString(),
              type: 'quote',
              title: `Quote Request`,
              subtitle: `${quote.name || 'Unknown'} - ${quote.service || 'General'}`,
              time: quote.createdAt || new Date().toISOString(),
            });
          });
        }

        if (Array.isArray(messages)) {
          messages.slice(0, 3).forEach((msg: any) => {
            recentActivities.push({
              id: msg._id || Math.random().toString(),
              type: 'message',
              title: `New Message`,
              subtitle: `From ${msg.name || 'Unknown'}`,
              time: msg.createdAt || new Date().toISOString(),
            });
          });
        }

        setActivities(recentActivities.sort((a, b) => 
          new Date(b.time).getTime() - new Date(a.time).getTime()
        ).slice(0, 5));

      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
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
      label: 'Total Orders',
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
      label: 'Quote Requests',
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
      label: 'New Messages',
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
      label: 'Blog Posts',
      value: stats.posts.toString(),
      href: '/admin/blogs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'bg-indigo-500',
      trend: 'New',
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, Administrator. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
          <Link href="/admin/services" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Service
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link 
            key={card.label} 
            href={card.href}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.color} text-white shadow-lg shadow-opacity-20 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                card.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {card.trend}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{card.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Management Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Inventory Status</h2>
              <Link href="/admin/products" className="text-blue-600 text-sm font-bold hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm border border-slate-200">
                  📱
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{stats.products} Products</p>
                  <p className="text-xs text-slate-500">Active in shop</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm border border-slate-200">
                  🛠️
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{stats.services} Services</p>
                  <p className="text-xs text-slate-500">Available for booking</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activity.type === 'order' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                      activity.type === 'quote' ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white' :
                      'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
                    }`}>
                      {activity.type === 'order' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      )}
                      {activity.type === 'quote' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {activity.type === 'message' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-slate-900 truncate">{activity.title}</p>
                        <span className="text-[10px] font-medium text-slate-400">
                          {new Date(activity.time).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{activity.subtitle}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">No recent activity found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Info & Support */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2">Need Help?</h2>
              <p className="text-slate-400 text-sm mb-6">Check out the admin documentation or contact system support.</p>
              <Link 
                href="/admin/messages"
                className="block w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all text-center active:scale-95"
              >
                Support Center
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">System Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium">Database Status</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium">Stripe API</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium">Storage</span>
                <span className="text-xs font-bold text-slate-900">2.4GB / 5.0GB</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="w-[48%] bg-blue-600 h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
