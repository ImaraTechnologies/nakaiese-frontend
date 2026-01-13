import BookingSuccessView from '@/components/Pages/BookingPage/BookingSuccessView';
import { getTranslations } from 'next-intl/server';

// 1. METADATA: CRITICAL NO-INDEX
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.BookingSuccess' });

  return {
    title: t('title'),
    // PREVENT GOOGLE FROM INDEXING THIS PAGE
    robots: {
      index: false,
      follow: false,
    },
  };
}

// 2. SERVER COMPONENT
export default async function BookingSuccessPage({ params }) {
  // Next.js 15: Must await params to get the ID
  const { id } = await params;

  // We pass the ID as a prop, avoiding 'use(params)' in the client component
  return (
    <>
      <BookingSuccessView id={id} />
    </>
  );
}