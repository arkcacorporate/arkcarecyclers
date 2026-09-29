export default function sitemap() {
  const baseUrl = 'https://arkcarecyclers.com';
  const routes = [
    '',
    '/know-us',
    '/waste-collection',
    '/epr-consultancy',
    '/contact-us',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
