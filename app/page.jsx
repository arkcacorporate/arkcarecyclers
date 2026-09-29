import HomeClient from '@/components/pages/HomeClient';

export const metadata = {
  title: 'ARKCA Recyclers | Sustainable Waste Management & EPR Consultancy',
  description:
    'ARKCA Recyclers champions circular economics with certified industrial waste collection, plastic recycling, e-waste disposition, battery & tyre management, and CPCB EPR consultancy.',
  alternates: {
    canonical: 'https://arkcarecyclers.com/',
  },
  openGraph: {
    title: 'ARKCA Recyclers | Sustainable Waste Management & EPR Consultancy',
    description:
      'ARKCA Recyclers champions circular economics with certified industrial waste collection, plastic recycling, e-waste disposition, battery & tyre management, and CPCB EPR consultancy.',
    url: 'https://arkcarecyclers.com/',
  },
};

export default function HomePage() {
  return <HomeClient />;

}
