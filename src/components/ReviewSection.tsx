"use client";

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import DynamicText from '@/components/DynamicText';

export default function ReviewSection() {
  const { reviews, addReview } = useData();
  const { t } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    user: '',
    rating: 5,
    comment: ''
  });

  const featuredReviews = reviews.slice(0, 3);
  const remainingCount = Math.max(0, reviews.length - 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const success = await addReview(formData);
    setLoading(false);

    if (success) {
      setMessage({ type: 'success', text: t.home.reviewSuccess });
      setFormData({ user: '', rating: 5, comment: '' });
      setTimeout(() => setIsFormOpen(false), 2000);
    } else {
      setMessage({ type: 'error', text: t.home.reviewError });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${star <= rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]"></div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em]">{t.home.reviews}</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{t.home.reviewsSubtitle}</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {reviews.length > 3 && (
              <button
                onClick={() => setIsAllReviewsOpen(true)}
                className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
              >
                <span>{t.home.viewAllReviews}</span>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{reviews.length}</span>
              </button>
            )}
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1 active:scale-95"
            >
              {t.home.writeReview}
            </button>
          </div>
        </div>

        {/* Review Form */}
        {isFormOpen && (
          <div className="mb-16 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.contact.name}</label>
                  <input
                    required
                    type="text"
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.home.rating}</label>
                  <div className="flex gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-transform hover:scale-125 active:scale-90"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-8 w-8 ${star <= formData.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{t.home.comment}</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium resize-none"
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : t.home.submitReview}
                </button>
                {message && (
                  <div className={`p-4 rounded-2xl text-center font-bold animate-in fade-in zoom-in duration-300 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {featuredReviews.length > 0 ? (
            featuredReviews.map((review, i) => (
              <div
                key={review.id || `review-featured-${i}`}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {review.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg leading-tight">{review.user}</h4>
                    <p className="text-slate-400 text-sm font-medium">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mb-4">
                  {renderStars(review.rating)}
                </div>
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  &quot;<DynamicText text={review.comment} />&quot;
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="text-6xl">⭐</div>
              <p className="text-slate-500 text-xl font-medium">{t.home.noReviews}</p>
            </div>
          )}
        </div>

        {/* View All Button (Bottom) */}
        {remainingCount > 0 && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setIsAllReviewsOpen(true)}
              className="inline-flex items-center gap-4 px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-bold text-xl hover:bg-slate-50 transition-all border-2 border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 active:scale-95 group"
            >
              <span>{t.home.viewAllReviews}</span>
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm group-hover:scale-110 transition-transform">
                {reviews.length}
              </div>
            </button>
          </div>
        )}

        {/* All Reviews Modal */}
        {isAllReviewsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300"
              onClick={() => setIsAllReviewsOpen(false)}
            ></div>
            
            <div className="bg-slate-50 w-full max-w-6xl max-h-[90vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in slide-in-from-bottom-8 duration-500">
              {/* Modal Header */}
              <div className="p-8 md:p-12 bg-white border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900">{t.home.reviews}</h2>
                  <p className="text-slate-500 font-medium mt-2">{reviews.length} {t.home.reviews.toLowerCase()}</p>
                </div>
                <button
                  onClick={() => setIsAllReviewsOpen(false)}
                  className="w-14 h-14 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl flex items-center justify-center transition-all group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content - Scrollable Grid */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {reviews.map((review, i) => (
                    <div
                      key={review.id || `review-all-${i}`}
                      className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-lg">
                          {review.user.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base leading-tight">{review.user}</h4>
                          <p className="text-slate-400 text-xs font-medium">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-slate-600 leading-relaxed text-base italic flex-1">
                        &quot;{review.comment}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-white border-t border-slate-100 flex justify-center">
                <button
                  onClick={() => {
                    setIsAllReviewsOpen(false);
                    setIsFormOpen(true);
                  }}
                  className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1 active:scale-95"
                >
                  {t.home.writeReview}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
