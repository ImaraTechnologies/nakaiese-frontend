import HotelPage from '@/components/Pages/HotelPage/HotelPage';
import { getTranslations } from 'next-intl/server';

// 1. Dynamic Metadata Generation
export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  
  // Await searchParams to customize title based on URL (e.g. ?city=Dubai)
  // Note: searchParams is a Promise in Next.js 15
  const query = await searchParams; 
  
  const t = await getTranslations({ locale, namespace: 'Metadata.Hotels' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nakiese.com';

  // Dynamic Title Logic: "Hotels in Dubai | Nakiese" vs "Luxury Hotels | Nakiese"
  let title = t('title');
  if (query.city) {
    title = `${t('hotels_in')} ${query.city} | Nakiese`;
  }

  return {
    title: title,
    description: t('description'),
    openGraph: {
      title: title,
      description: t('description'),
      url: `${baseUrl}/${locale}/hotels`,
      siteName: 'Nakiese',
      images: [
        {
          url: `${baseUrl}/images/og-hotels.jpg`,
          width: 1200,
          height: 630,
          alt: 'Luxury Hotels in Africa',
        },
      ],
      type: 'website',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/hotels`,
    }
  };
}

export default function HotelsPage() {
  
  // 2. Structured Data for a Collection Page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Luxury Hotels',
    description: 'Browse our curated list of top-rated hotels across Africa.',
    url: 'https://nakiese.com/hotels',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://nakiese.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Hotels',
          item: 'https://nakiese.com/hotels'
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Render the Client Logic */}
      <HotelPage />
    </>
  );
}