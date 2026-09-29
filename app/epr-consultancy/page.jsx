import EPRConsultancyClient from '@/components/pages/EPRConsultancyClient';

export const metadata = {
  title: 'EPR Consultancy & CPCB Compliance',
  description:
    'Complete Extended Producer Responsibility (EPR) solutions for Producers, Importers, and Brand Owners (PIBOs). 100% audit readiness and verified CPCB credits.',
  alternates: {
    canonical: 'https://arkcarecyclers.com/epr-consultancy',
  },
  openGraph: {
    title: 'EPR Consultancy & CPCB Compliance | ARKCA Recyclers',
    description:
      'Complete Extended Producer Responsibility (EPR) solutions for Producers, Importers, and Brand Owners (PIBOs). 100% audit readiness and verified CPCB credits.',
    url: 'https://arkcarecyclers.com/epr-consultancy',
  },
};

export default function EPRConsultancyPage() {
  return <EPRConsultancyClient />;
}
