import KnowUsClient from '@/components/pages/KnowUsClient';

export const metadata = {
  title: 'Know Us',
  description:
    'Discover ARKCA Recyclers — India’s premier CPCB & SPCB registered circular economy partner dedicated to zero liquid discharge recycling, traceable logistics, and waste picker inclusion.',
  alternates: {
    canonical: 'https://arkcarecyclers.com/know-us',
  },
  openGraph: {
    title: 'Know Us | ARKCA Recyclers',
    description:
      'Discover ARKCA Recyclers — India’s premier CPCB & SPCB registered circular economy partner dedicated to zero liquid discharge recycling, traceable logistics, and waste picker inclusion.',
    url: 'https://arkcarecyclers.com/know-us',
  },
};

export default function KnowUsPage() {
  return <KnowUsClient />;
}
