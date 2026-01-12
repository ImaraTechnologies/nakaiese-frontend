import ReturantPage from '@/components/Pages/ReturantPage/ReturantPage';
import { getTranslations } from 'next-intl/server';

// 1. Dynamic Metadata Generation
export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const query = await searchParams; // Await query params (Next.js 15)

  const t = await getTranslations({ locale, namespace: 'Metadata.Restaurants' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nakiese.com';

  // Dynamic Title: "Restaurants in Cairo | Nakiese"
  let title = t('title');
  if (query.city) {
    title = `${t('restaurants_in')} ${query.city} | Nakiese`;
  }

  return {
    title: title,
    description: t('description'),
    openGraph: {
      title: title,
      description: t('description'),
      url: `${baseUrl}/${locale}/restaurants`,
      siteName: 'Nakiese',
      images: [
        {
          url: `${baseUrl}/images/og-restaurants.jpg`,
          width: 1200,
          height: 630,
          alt: 'Best Restaurants in Africa',
        },
      ],
      type: 'website',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/restaurants`,
    }
  };
}

export default function RestaurantsPage() {
  
  // 2. Structured Data (Schema.org)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Top Restaurants',
    description: 'Discover the best dining experiences and restaurants across Africa.',
    url: 'https://nakiese.com/restaurants',
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
          name: 'Restaurants',
          item: 'https://nakiese.com/restaurants'
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
      
      {/* Render Client Logic */}
      <ReturantPage />
    </>
  );
}