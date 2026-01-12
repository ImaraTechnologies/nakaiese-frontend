import HomePage from "@/components/Pages/HomePage/HomePage";
import { getTranslations } from 'next-intl/server';

// 1. Dynamic Metadata Generation
export async function generateMetadata({ params }) {
  // FIX: Await params before using properties
  const { locale } = await params;

  // Fetch translations for metadata
  const t = await getTranslations({ locale, namespace: 'Metadata.Home' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nakiese.com';

  return {
    title: t('title'), 
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: 'Nakiese',
      images: [
        {
          url: `${baseUrl}/images/og-home.jpg`,
          width: 1200,
          height: 630,
          alt: 'Nakiese - Discover Africa',
        },
      ],
      type: 'website',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
    }
  };
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nakiese',
    url: 'https://nakiese.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://nakiese.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage/>
    </>
  );
}