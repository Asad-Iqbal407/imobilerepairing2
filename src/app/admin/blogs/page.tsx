'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import DynamicText from '@/components/DynamicText';

interface Post {
  _id: string;
  title: string;
  slug: string;
  author: string;
  createdAt: string;
  isPublished: boolean;
}

export default function AdminBlogsPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error(t.admin.postFetchFailed);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      toast.error(t.admin.postLoadFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.confirmDeletePost)) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(t.admin.postDeleteFailed);
      toast.success(t.admin.postDeleted);
      fetchPosts();
    } catch (error) {
      toast.error(t.admin.postDeleteFailed);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{t.admin.blogPosts}</h1>
        <Link 
          href="/admin/blogs/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t.admin.createNewPost}
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-900">{t.admin.postTitle}</th>
              <th className="px-6 py-4 font-bold text-slate-900">{t.admin.postAuthor}</th>
              <th className="px-6 py-4 font-bold text-slate-900">{t.admin.date}</th>
              <th className="px-6 py-4 font-bold text-slate-900">{t.admin.status}</th>
              <th className="px-6 py-4 font-bold text-slate-900 text-right">{t.admin.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900"><DynamicText text={post.title} /></p>
                  <p className="text-sm text-slate-500">/{post.slug}</p>
                </td>
                <td className="px-6 py-4 text-slate-600"><DynamicText text={post.author} /></td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    post.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {post.isPublished ? t.admin.completed : t.admin.pending}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Link to edit page could be added here later */}
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  {t.admin.noRecentActivity}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
