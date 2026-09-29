import WasteCollectionClient from '@/components/pages/WasteCollectionClient';

export const metadata = {
  title: 'Waste Collection Services',
  description:
    'Authorized industrial and commercial waste collection across plastic, e-waste, battery, tyre, used oil, and metal scrap with digital weighing and Form 6 manifests.',
  alternates: {
    canonical: 'https://arkcarecyclers.com/waste-collection',
  },
  openGraph: {
    title: 'Waste Collection Services | ARKCA Recyclers',
    description:
      'Authorized industrial and commercial waste collection across plastic, e-waste, battery, tyre, used oil, and metal scrap with digital weighing and Form 6 manifests.',
    url: 'https://arkcarecyclers.com/waste-collection',
  },
};

export default function WasteCollectionPage() {
  return <WasteCollectionClient />;
}
