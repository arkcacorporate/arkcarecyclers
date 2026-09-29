import BlogListingClient from '@/components/pages/BlogListingClient';

export const metadata = {
  title: 'Blog & Circular Economy Insights',
  description:
    'Read our latest expert articles on CPCB EPR compliance, industrial plastic recycling, e-waste disposition, battery lifecycle management, and sustainability in India.',
  alternates: {
    canonical: 'https://arkcarecyclers.com/blog',
  },
  openGraph: {
    title: 'Blog & Circular Economy Insights | ARKCA Recyclers',
    description:
      'Read our latest expert articles on CPCB EPR compliance, industrial plastic recycling, e-waste disposition, battery lifecycle management, and sustainability in India.',
    url: 'https://arkcarecyclers.com/blog',
  },
};

export default function BlogListingPage() {
  return <BlogListingClient />;
}
