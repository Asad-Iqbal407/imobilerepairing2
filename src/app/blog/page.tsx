import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import DynamicText from '@/components/DynamicText';

export const metadata: Metadata = {
  title: 'Blog | Insights & Repair Tips',
  description: 'Latest news, repair guides, and technology insights from the IMOBILE expert team.',
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  coverImage?: string;
  tags: string[];
}

const fallbackPosts: BlogPost[] = [
  {
    slug: 'common-iphone-battery-issues',
    title: '5 Signs Your iPhone Needs a Battery Replacement',
    excerpt: 'Is your iPhone draining fast? Learn the top signs that indicate it is time for a new battery.',
    author: 'IMOBILE Team',
    createdAt: new Date('2025-01-05').toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?q=80&w=1000&auto=format&fit=crop',
    tags: ['iPhone', 'Battery', 'Tips'],
  },
  {
    slug: 'water-damage-recovery-guide',
    title: 'What to Do If You Drop Your Phone in Water',
    excerpt: 'Immediate steps to take to save your wet smartphone. Do NOT put it in rice!',
    author: 'Tech Expert',
    createdAt: new Date('2024-12-28').toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop',
    tags: ['Water Damage', 'Guide', 'Emergency'],
  },
  {
    slug: 'screen-protector-types',
    title: 'Tempered Glass vs. Hydrogel: Which Screen Protector is Best?',
    excerpt: 'Comparing the durability and feel of different screen protection options for your device.',
    author: 'IMOBILE Team',
    createdAt: new Date('2024-12-15').toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop',
    tags: ['Accessories', 'Protection', 'Comparison'],
  },
];

async function getPosts(): Promise<BlogPost[]> {
  try {
    await dbConnect();
    const posts = await Post.find({ isPublished: true }).sort({ createdAt: -1 });
    if (posts.length === 0) {
      return fallbackPosts;
    }
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.warn('Database connection failed, using fallback data');
    return fallbackPosts;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            <DynamicText text="Latest" /> <span className="text-blue-600"><DynamicText text="Insights" /></span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            <DynamicText text="Expert advice, repair guides, and industry news to help you get the most out of your technology." />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={post.coverImage || 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?q=80&w=1000&auto=format&fit=crop'}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-blue-600 rounded-full">
                      <DynamicText text={tag} />
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <DynamicText text={post.author} />
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    <DynamicText text={post.title} />
                  </Link>
                </h2>
                <p className="text-slate-500 mb-6 line-clamp-2">
                  <DynamicText text={post.excerpt} />
                </p>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                >
                  <DynamicText text="Read Article" /> <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
