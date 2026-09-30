import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import Navigation from '@/components/Navigation';
import SiteFooter from '@/components/SiteFooter';
import '@/styles/index.css';
import '@/styles/home-redesign.css';
import '@/styles/inner-pages.css';
import '@/styles/know-us-redesign.css';
import '@/styles/waste-collection-redesign.css';
import '@/styles/epr-consultancy-redesign.css';
import '@/styles/blog.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://arkcarecyclers.com'),
  title: {
    default: 'ARKCA Recyclers | Sustainable Waste Management & EPR Consultancy',
    template: '%s | ARKCA Recyclers',
  },
  description:
    'ARKCA Recyclers offers end-to-end industrial waste management, EPR consultancy, and sustainable recycling solutions for plastic, e-waste, battery, tyre, and oil.',
  icons: {
    icon: '/images/logo/arkcarecyclerslogo.png',
  },
  openGraph: {
    title: 'ARKCA Recyclers | Sustainable Waste Management & EPR Consultancy',
    description:
      'ARKCA Recyclers offers end-to-end industrial waste management, EPR consultancy, and sustainable recycling solutions for plastic, e-waste, battery, tyre, and oil.',
    url: 'https://arkcarecyclers.com',
    siteName: 'ARKCA Recyclers',
    images: [
      {
        url: '/images/logo/arkcarecyclerslogo.webp',
        width: 1200,
        height: 630,
        alt: 'ARKCA Recyclers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARKCA Recyclers | Sustainable Waste Management & EPR Consultancy',
    description:
      'ARKCA Recyclers offers end-to-end industrial waste management, EPR consultancy, and sustainable recycling solutions.',
    images: ['/images/logo/arkcarecyclerslogo.webp'],
  },
};

export const viewport = {
  themeColor: '#123228',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${plusJakartaSans.variable} ${outfit.variable}`}>
      <head>
        <link rel="preload" as="image" href="/images/hero/plastic.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body>
        <div className="app-layout">
          <Navigation />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
