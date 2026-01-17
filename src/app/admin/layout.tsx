'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

import { Toaster, toast } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    {
      name: t.admin.dashboard,
      href: '/admin',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: t.admin.services,
      href: '/admin/services',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: t.admin.products,
      href: '/admin/products',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      name: t.admin.orders,
      href: '/admin/orders',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      name: t.admin.quotes,
      href: '/admin/quotes',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: t.admin.messages,
      href: '/admin/messages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
    },
    {
      name: t.admin.blogs,
      href: '/admin/blogs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const authStatus = localStorage.getItem('is_admin_authenticated');
    if (authStatus === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
    } else {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      setIsAuthenticated(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Polling for new notifications
  useEffect(() => {
    if (!isAuthenticated || pathname === '/admin/login') return;

    let lastOrderTime = new Date().toISOString();
    let lastQuoteTime = new Date().toISOString();
    let lastMessageTime = new Date().toISOString();

    const checkNewActivity = async () => {
      try {
        const [ordersRes, quotesRes, messagesRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/quotes'),
          fetch('/api/contact')
        ]);

        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          const newOrders = orders.filter((o: any) => o.createdAt > lastOrderTime && o.status === 'paid');
          newOrders.forEach((o: any) => {
            toast.success(`${t.admin.newOrder} #${o._id.slice(-6)}`, {
              description: `${t.admin.customer}: ${o.customerName} - ${t.admin.currencySymbol}${o.total}`,
              action: {
                label: t.admin.view,
                onClick: () => router.push('/admin/orders')
              }
            });
          });
          if (orders.length > 0) lastOrderTime = orders[0].createdAt;
        }

        if (quotesRes.ok) {
          const quotes = await quotesRes.json();
          const newQuotes = quotes.filter((q: any) => q.createdAt > lastQuoteTime);
          newQuotes.forEach((q: any) => {
            toast.info(t.admin.newQuoteRequest, {
              description: `${q.name} - ${q.service}`,
              action: {
                label: t.admin.view,
                onClick: () => router.push('/admin/quotes')
              }
            });
          });
          if (quotes.length > 0) lastQuoteTime = quotes[0].createdAt;
        }

        if (messagesRes.ok) {
          const messages = await messagesRes.json();
          const newMessages = messages.filter((m: any) => m.createdAt > lastMessageTime);
          newMessages.forEach((m: any) => {
            toast.message(t.admin.newCustomerMessage, {
              description: `${t.admin.from}: ${m.name}`,
              action: {
                label: t.admin.read,
                onClick: () => router.push('/admin/messages')
              }
            });
          });
          if (messages.length > 0) lastMessageTime = messages[0].createdAt;
        }
      } catch (error) {
        console.error('Failed to check for notifications:', error);
      }
    };

    const interval = setInterval(checkNewActivity, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated, pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('is_admin_authenticated');
    router.push('/admin/login');
  };

  // If it's the login page, don't show the sidebar layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Prevent flash of unauthenticated content
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Toaster position="top-right" richColors />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 shadow-xl z-50 transform transition-transform duration-200 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:flex`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            A
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{t.admin.portal}</h2>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">{t.admin.exitToSite}</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 text-slate-400 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">{t.admin.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 text-slate-600 bg-white shadow-sm active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="ml-2 text-xs font-semibold text-slate-700">{t.admin.menu}</span>
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">{t.admin.administrator}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-900 font-semibold capitalize">
                {pathname === '/admin' ? t.admin.dashboard : pathname.split('/').pop()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t.admin.logout}
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-3 pl-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-none">{t.admin.administrator}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">{t.admin.administrator}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
