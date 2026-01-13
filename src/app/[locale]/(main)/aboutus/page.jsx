import AboutView from '@/components/Pages/AboutPage/AboutView';
import { getTranslations } from 'next-intl/server';

// 1. GENERATE METADATA
export async function generateMetadata({ params }) {
  const { locale } = await params; // Next.js 15: await params
  const t = await getTranslations({ locale, namespace: 'Metadata.About' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nakiese.com';

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}/about`,
      siteName: 'Nakiese',
      images: [
        {
          url: `${baseUrl}/images/og-about.jpg`, // Ensure you have this image
          width: 1200,
          height: 630,
          alt: 'About Nakiese Team',
        },
      ],
      type: 'website',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
    },
  };
}

// 2. SERVER COMPONENT
export default function AboutPage() {
  
  // 3. STRUCTURED DATA (Organization Schema)
  // This tells Google "We are a real company"
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nakiese',
    url: 'https://nakiese.com',
    logo: 'https://nakiese.com/logo.png',
    description: 'Premier hotel and restaurant booking platform in Africa.',
    foundingDate: '2021',
    sameAs: [
      'https://facebook.com/nakiese',
      'https://instagram.com/nakiese',
      'https://linkedin.com/company/nakiese'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'Customer Service'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutView />
    </>
  );
}