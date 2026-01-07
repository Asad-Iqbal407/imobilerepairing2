"use client";

import { useEffect, useState } from 'react';
import type { IQuote } from '@/models/Quote';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<IQuote | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/quotes');
      if (res.ok) {
        const data = await res.json();
        setQuotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.part.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || quote.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalQuotes = quotes.length;
  const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
  const respondedQuotes = quotes.filter(q => q.status === 'responded').length;
  const completedQuotes = quotes.filter(q => q.status === 'completed').length;

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchQuotes();
        if (selectedQuote?._id?.toString() === id) {
          setSelectedQuote({ ...selectedQuote, status } as IQuote);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote request?')) return;
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchQuotes();
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete quote:', error);
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
          <h1 className="text-3xl font-bold text-slate-900">Quote Requests</h1>
          <p className="text-slate-500 mt-1">Review and manage repair quote requests from customers.</p>
        </div>
        <button
          onClick={fetchQuotes}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Quotes</p>
              <p className="text-2xl font-bold text-slate-900">{totalQuotes}</p>
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
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{pendingQuotes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Responded</p>
              <p className="text-2xl font-bold text-slate-900">{respondedQuotes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{completedQuotes}</p>
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
            placeholder="Search quotes (name, email, device)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {['All', 'pending', 'responded', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Device</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map((quote: any) => (
                <tr key={quote._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-bold text-slate-900 block">{quote.name}</span>
                      <span className="text-slate-500 text-sm">{quote.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium text-slate-700 block">{quote.deviceModel}</span>
                      <span className="text-slate-400 text-xs uppercase font-bold">{quote.category} • {quote.part}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-500 text-sm">
                      {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                      quote.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      quote.status === 'responded' ? 'bg-blue-50 text-blue-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedQuote(quote);
                          setIsDetailsOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(quote._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Quote"
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
        {filteredQuotes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No quotes found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              {quotes.length === 0 
                ? "Any new quote requests will appear here."
                : "No quotes match your search criteria."}
            </p>
          </div>
        )}
      </div>

      {/* Details Slide-over */}
      {isDetailsOpen && selectedQuote && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDetailsOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Quote Details</h2>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">ID: {selectedQuote._id.toString()}</p>
              </div>
              <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Status Section */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Current Status</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                    selectedQuote.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    selectedQuote.status === 'responded' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {selectedQuote.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(selectedQuote._id as string, 'responded')}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Mark Responded
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedQuote._id as string, 'completed')}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Customer Name</span>
                  <p className="text-slate-900 font-bold text-lg">{selectedQuote.name}</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Request Date</span>
                  <p className="text-slate-900 font-medium">
                    {selectedQuote.createdAt ? new Date(selectedQuote.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Email Address</span>
                  <a href={`mailto:${selectedQuote.email}`} className="text-blue-600 font-bold hover:underline">{selectedQuote.email}</a>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Phone Number</span>
                  <a href={`tel:${selectedQuote.phone}`} className="text-slate-900 font-bold hover:underline">{selectedQuote.phone}</a>
                </div>
              </div>

              {/* Device Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Device Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Device Model</span>
                    <p className="text-slate-900 font-bold">{selectedQuote.deviceModel}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Category</span>
                    <p className="text-slate-900 font-bold capitalize">{selectedQuote.category}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Part/Service Needed</span>
                    <p className="text-slate-900 font-bold capitalize">{selectedQuote.part}</p>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Problem Description</span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium leading-relaxed italic">
                  &quot;{selectedQuote.problem}&quot;
                </div>
              </div>

              {/* Images */}
              {selectedQuote.images && selectedQuote.images.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Attached Images</span>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedQuote.images.map((img: string, idx: number) => (
                      <div key={idx} className="relative aspect-square group cursor-zoom-in rounded-xl overflow-hidden border border-slate-200">
                        <img 
                          src={img} 
                          alt={`Evidence ${idx + 1}`} 
                          className="w-full h-full object-cover transition-all group-hover:scale-110"
                          onClick={() => window.open(img, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => handleDelete(selectedQuote._id as string)}
                className="w-full py-3 px-4 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Quote Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
