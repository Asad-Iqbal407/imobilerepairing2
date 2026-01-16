import { Metadata } from 'next';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import DynamicText from '@/components/DynamicText';
import DynamicHTML from '@/components/DynamicHTML';

type Props = {
  params: Promise<{ slug: string }>;
};

const fallbackPosts: Record<string, any> = {
  'common-iphone-battery-issues': {
    slug: 'common-iphone-battery-issues',
    title: '5 Signs Your iPhone Needs a Battery Replacement',
    content: `
      <p>Is your iPhone running slower than usual? Does the battery drain before lunchtime? These are common signs that your battery health has degraded.</p>
      <h2>1. Rapid Battery Drain</h2>
      <p>If your phone drops from 100% to 20% in just a few hours of normal use, the battery capacity is significantly reduced.</p>
      <h2>2. Unexpected Shutdowns</h2>
      <p>Does your phone turn off when it still shows 30% charge? This happens when the battery can't deliver peak power.</p>
      <h2>3. Device Overheating</h2>
      <p>A degrading battery often generates excess heat during charging or usage.</p>
      <h2>4. Slow Performance</h2>
      <p>iOS may throttle CPU performance to prevent shutdowns if the battery is weak.</p>
      <h2>5. Battery Health Below 80%</h2>
      <p>Check Settings > Battery > Battery Health. If it's under 80%, Apple recommends service.</p>
      <p>At Tertulia Impulsiva, we can replace your iPhone battery with premium quality parts.</p>
    `,
    author: 'Tertulia Impulsiva Team',
    createdAt: new Date('2025-01-05').toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?q=80&w=1000&auto=format&fit=crop',
    tags: ['iPhone', 'Battery', 'Tips'],
  },
  'water-damage-recovery-guide': {
    slug: 'water-damage-recovery-guide',
    title: 'What to Do If You Drop Your Phone in Water',
    content: `
      <p>Accidents happen. If your phone takes a swim, acting fast is crucial.</p>
      <h2>Immediate Steps:</h2>
      <ol>
        <li><strong>Retrieve it immediately:</strong> Every second counts.</li>
        <li><strong>Turn it OFF:</strong> Do not check for notifications. Power down instantly to prevent short circuits.</li>
        <li><strong>Remove accessories:</strong> Take off the case, SIM card, and memory card.</li>
        <li><strong>Dry the exterior:</strong> Use a towel to wipe off visible water.</li>
      </ol>
      <h2>What NOT to Do:</h2>
      <ul>
        <li><strong>Do NOT put it in rice:</strong> Rice dust can enter ports and cause more damage. It's a myth!</li>
        <li><strong>Do NOT use a hairdryer:</strong> Heat can damage internal components and push water deeper.</li>
        <li><strong>Do NOT charge it:</strong> This is the fastest way to fry the motherboard.</li>
      </ul>
      <p>Bring it to a professional repair shop like Tertulia Impulsiva immediately for ultrasonic cleaning and drying.</p>
    `,
    author: 'Tech Expert',
    createdAt: new Date('2024-12-28').toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1512054193303-9107adb5e8c6?q=80&w=1000&auto=format&fit=crop',
    tags: ['Water Damage', 'Guide', 'Emergency'],
  },
  'screen-protector-types': {
    slug: 'screen-protector-types',
    title: 'Tempered Glass vs. Hydrogel: Which Screen Protector is Best?',
    content: `
      <p>Protecting your screen is cheaper than replacing it. But which type should you choose?</p>
      <h2>Tempered Glass</h2>
      <p><strong>Pros:</strong> Feel just like the original screen, high scratch resistance, excellent impact protection.</p>
      <p><strong>Cons:</strong> Can crack easily on impact (sacrificing itself to save the screen), adds thickness.</p>
      <h2>Hydrogel / TPU Film</h2>
      <p><strong>Pros:</strong> Self-healing for minor scratches, thinner, covers curved edges perfectly.</p>
      <p><strong>Cons:</strong> Rubber-like feel, less impact protection than glass.</p>
      <h2>Verdict</h2>
      <p>For maximum drop protection, go with <strong>Tempered Glass</strong>. For curved screens and scratch resistance, <strong>Hydrogel</strong> is great.</p>
    `,
    author: 'Tertulia Impulsiva Team',
    createdAt: new Date('2024-12-15').toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop',
    tags: ['Accessories', 'Protection', 'Comparison'],
  },
};

async function getPost(slug: string) {
  try {
    await dbConnect();
    const post = await Post.findOne({ slug, isPublished: true });
    if (post) return JSON.parse(JSON.stringify(post));
    return fallbackPosts[slug] || null;
  } catch (error) {
    return fallbackPosts[slug] || null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''), // Strip HTML tags
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
      images: [post.coverImage || ''],
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Schema.org structured data for Article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.coverImage,
    datePublished: post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tertulia Impulsiva',
      logo: {
        '@type': 'ImageObject',
        url: 'https://imobile.com/logo.png', // Replace with actual logo URL
      },
    },
  };

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src={post.coverImage || 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?q=80&w=1000&auto=format&fit=crop'}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-4xl mx-auto">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> <DynamicText text="Back to Blog" />
          </Link>
          <div className="flex flex-wrap gap-3 mb-6">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-blue-600/80 backdrop-blur-md rounded-full text-xs font-bold">
                <DynamicText text={tag} />
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            <DynamicText text={post.title} />
          </h1>
          <div className="flex items-center gap-6 text-sm font-medium text-white/80">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <DynamicText text={post.author} />
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <DynamicText text="5 min read" />
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <DynamicHTML 
          className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 hover:prose-a:text-blue-700 max-w-none"
          html={post.content}
        />

        {/* Share & Footer */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
          <p className="font-bold text-slate-900">Share this article</p>
          <div className="flex gap-4">
            <button className="p-3 bg-slate-50 rounded-full text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
