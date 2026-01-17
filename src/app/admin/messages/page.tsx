"use client";

import { useEffect, useState } from 'react';
import type { IContact } from '@/models/Contact';
import { useLanguage } from '@/context/LanguageContext';

export default function MessagesPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<IContact | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.confirmDeleteMessage)) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMessages();
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const searchLower = searchQuery.toLowerCase();
    return (
      message.name.toLowerCase().includes(searchLower) ||
      message.email.toLowerCase().includes(searchLower) ||
      (message.device && message.device.toLowerCase().includes(searchLower)) ||
      message.message.toLowerCase().includes(searchLower)
    );
  });

  const totalMessages = messages.length;
  const todayMessages = messages.filter(m => {
    const today = new Date();
    const messageDate = new Date(m.createdAt as any);
    return messageDate.toDateString() === today.toDateString();
  }).length;
  const deviceInquiries = messages.filter(m => m.device).length;
  const generalInquiries = totalMessages - deviceInquiries;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.admin.customerMessages}</h1>
          <p className="text-slate-500 mt-1">{t.admin.manageInquiries}</p>
        </div>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t.admin.refresh}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.totalQuotes}</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalMessages}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.receivedToday}</p>
              <h3 className="text-2xl font-bold text-slate-900">{todayMessages}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.deviceInquiries}</p>
              <h3 className="text-2xl font-bold text-slate-900">{deviceInquiries}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t.admin.generalInfo}</p>
              <h3 className="text-2xl font-bold text-slate-900">{generalInquiries}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t.admin.searchMessagesPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
          />
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.admin.sender}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.admin.deviceModel}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{t.admin.date}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMessages.map((message: any) => (
                <tr key={message._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-bold text-slate-900 block">{message.name}</span>
                      <span className="text-slate-500 text-sm">{message.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 font-medium">{message.device || t.admin.general}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-500 text-sm">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedMessage(message);
                          setIsDetailsOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title={t.admin.readMessage}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(message._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title={t.admin.deleteMessage}
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
        {filteredMessages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.admin.noMessagesFound}</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              {searchQuery 
                ? t.admin.noMessagesMatching.replace('{query}', searchQuery)
                : t.admin.noMessagesFoundDesc}
            </p>
          </div>
        )}
      </div>

      {/* Details Slide-over */}
      {isDetailsOpen && selectedMessage && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDetailsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t.admin.messageDetails}</h2>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">{t.admin.inquiryId}: {selectedMessage._id.toString()}</p>
              </div>
              <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Sender Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedMessage.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{t.admin.sentOn} {new Date(selectedMessage.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.admin.emailAddress}</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 font-bold hover:underline break-all">{selectedMessage.email}</a>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.admin.relatedDevice}</span>
                    <p className="text-slate-900 font-bold">{selectedMessage.device || t.admin.general}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.admin.messageContent}</span>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 text-slate-700 font-medium leading-relaxed shadow-sm italic">
                  &quot;{selectedMessage.message}&quot;
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.admin.actions}</span>
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: Your inquiry on Phone Repair`}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  {t.admin.replyViaEmail}
                </a>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => handleDelete(selectedMessage._id.toString())}
                className="w-full py-3 px-4 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t.admin.deleteMessage}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
