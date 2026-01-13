import BookingView from '@/components/Pages/BookingPage/BookingView';
import { getTranslations } from 'next-intl/server';

// 1. METADATA: Secure & No-Index
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Booking' });

  return {
    title: t('title'), // "Secure Checkout | Nakiese"
    description: t('description'),
    // CRITICAL: Do not index checkout pages
    robots: {
      index: false,
      follow: false,
    },
  };
}

// 2. SERVER COMPONENT
export default function BookingPage() {
  // No JSON-LD needed for checkout/transaction pages
  return (
    <>
      <BookingView />
    </>
  );
}