import { getAllPosts } from '@/lib/blogData';

export default function sitemap() {
  const baseUrl = 'https://arkcarecyclers.com';
  const staticRoutes = [
    '',
    '/know-us',
    '/waste-collection',
    '/epr-consultancy',
    '/blog',
    '/contact-us',
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const blogPosts = getAllPosts();
  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedDate || post.publishDate).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
