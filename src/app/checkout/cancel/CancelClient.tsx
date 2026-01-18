import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-600/5 rounded-full blur-[120px]"></div>

      <div className="max-w-lg w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Payment Cancelled</h1>
        <p className="text-slate-500 text-lg leading-relaxed mb-10">
          Your payment was not completed. No charges were made. If you encountered any technical issues, please let us know.
        </p>
        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/cart"
            className="w-full py-4 px-6 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1"
          >
            Back to Cart
          </Link>
          <Link
            href="/"
            className="w-full py-4 px-6 bg-slate-50 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
