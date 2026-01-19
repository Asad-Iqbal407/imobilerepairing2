import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://imobilept.com'; // Production domain
  
  // Static pages
  const routes = [
    '',
    '/shop',
    '/services',
    '/contact',
    '/get-quote',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Blog Posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const posts = await Post.find({ isPublished: true }).select('slug updatedAt').lean();
    
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return [...routes, ...blogRoutes];
}
