import ContactUsClient from '@/components/pages/ContactUsClient';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with ARKCA Recyclers for industrial waste pickups, EPR consulting, CSR partnerships, and certified recycling inquiries at our Kolkata headquarters.',
  alternates: {
    canonical: 'https://arkcarecyclers.com/contact-us',
  },
  openGraph: {
    title: 'Contact Us | ARKCA Recyclers',
    description:
      'Get in touch with ARKCA Recyclers for industrial waste pickups, EPR consulting, CSR partnerships, and certified recycling inquiries at our Kolkata headquarters.',
    url: 'https://arkcarecyclers.com/contact-us',
  },
};

export default function ContactUsPage() {
  return <ContactUsClient />;
}
