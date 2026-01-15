"use client";

import { useEffect, useState } from 'react';
import type { IOrder } from '@/models/Order';
import { formatPriceByCurrency, type SupportedCurrency } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function OrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setError(null);
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        const errData = await res.json();
        setError(errData.details || errData.error || 'Failed to fetch orders');
      }
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      setError(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const revenueByCurrency = orders.reduce(
    (acc, order: any) => {
      const currency: SupportedCurrency = order.currency === 'eur' ? 'eur' : 'usd';
      acc[currency] += order.total || 0;
      return acc;
    },
    { usd: 0, eur: 0 } as Record<SupportedCurrency, number>
  );
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'confirmed').length;

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder?._id?.toString() === id) {
          setSelectedOrder({ ...selectedOrder, status } as IOrder);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.confirmDeleteOrder)) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchOrders();
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.admin.orders}</h1>
          <p className="text-slate-500 mt-1">{t.admin.manageOrders}</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t.admin.refresh}
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.admin.totalOrders}</p>
              <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
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
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.admin.totalRevenue}</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatPriceByCurrency(revenueByCurrency.usd, 'usd')}
              </p>
              {revenueByCurrency.eur > 0 && (
                <p className="text-xs font-bold text-slate-500">
                  {formatPriceByCurrency(revenueByCurrency.eur, 'eur')}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.admin.pending}</p>
              <p className="text-2xl font-bold text-slate-900">{pendingOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.admin.completed}</p>
              <p className="text-2xl font-bold text-slate-900">{completedOrders}</p>
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
            placeholder={t.admin.searchOrdersPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {['all', 'pending', 'paid', 'confirmed', 'shipped', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status === 'all' ? 'All' : status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border whitespace-nowrap ${
                (selectedStatus === 'All' && status === 'all') || selectedStatus === status
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              {status === 'all' ? t.admin.all : t.admin[status as keyof typeof t.admin] || status}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.admin.customer}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{t.admin.items}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{t.admin.total}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{t.admin.date}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{t.admin.status}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-bold text-slate-900 block">{order.customerName}</span>
                      <span className="text-slate-500 text-sm">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-600 font-medium">
                      {order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-slate-900">
                      {formatPriceByCurrency(order.total, (order.currency || 'usd') as SupportedCurrency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                      order.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      order.status === 'paid' ? 'bg-blue-50 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-50 text-purple-700' :
                      order.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                      order.status === 'cancelled' ? 'bg-rose-50 text-rose-700' :
                      'bg-slate-50 text-slate-700'
                    }`}>
                      {t.admin[order.status as keyof typeof t.admin] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailsOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title={t.admin.viewDetails}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title={t.admin.deleteOrder}
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
        {filteredOrders.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.admin.noOrdersFound}</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              {orders.length === 0 
                ? t.admin.noOrdersFoundDesc
                : t.admin.noOrdersFoundFiltered}
            </p>
          </div>
        )}
      </div>

      {/* Details Slide-over */}
      {isDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDetailsOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t.admin.orderDetails}</h2>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">ID: {selectedOrder._id.toString()}</p>
              </div>
              <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Status Section */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{t.admin.orderFulfillment}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['pending', 'paid', 'confirmed', 'shipped', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder._id.toString(), status)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        selectedOrder.status === status
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-blue-200 hover:text-blue-600'
                      }`}
                    >
                      {t.admin[status as keyof typeof t.admin] || status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">{t.admin.customer}</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{t.admin.name}</span>
                      <p className="text-slate-900 font-bold">{selectedOrder.customerName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{t.admin.email}</span>
                      <a href={`mailto:${selectedOrder.customerEmail}`} className="text-blue-600 font-bold hover:underline">{selectedOrder.customerEmail}</a>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{t.admin.phone}</span>
                      <p className="text-slate-900 font-bold">{selectedOrder.customerPhone || t.admin.na}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Shipping</h3>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{t.admin.address}</span>
                    <p className="text-slate-900 font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedOrder.customerAddress || 'No address provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Order Items</h3>
                  <span className="text-xs font-bold text-slate-400">{selectedOrder.items.length} unique items</span>
                </div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-slate-400 border border-slate-200">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 font-medium">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{formatPriceByCurrency(item.price * item.quantity, (selectedOrder.currency || 'usd') as SupportedCurrency)}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatPriceByCurrency(item.price, (selectedOrder.currency || 'usd') as SupportedCurrency)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 text-sm font-bold uppercase tracking-widest">
                  <span>Order Total</span>
                  <span className="text-blue-400">Paid via Stripe</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{formatPriceByCurrency(selectedOrder.total, (selectedOrder.currency || 'usd') as SupportedCurrency)}</span>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-widest">Payment Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => handleDelete(selectedOrder._id as unknown as string)}
                className="w-full py-3 px-4 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Cancel & Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
