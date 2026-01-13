import ContactView from '@/components/Pages/ContactPage/ContactView';
import { getTranslations } from 'next-intl/server';

// 1. GENERATE METADATA
export async function generateMetadata({ params }) {
  const { locale } = await params; // Next.js 15+ await pattern
  const t = await getTranslations({ locale, namespace: 'Metadata.Contact' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://nakiese.com/${locale}/contact`,
      type: 'website',
    },
  };
}

// 2. SERVER COMPONENT
export default function ContactPage() {
  
  // 3. STRUCTURED DATA (ContactPage + ContactPoint)
  // Essential for "Customer Support" rich results in Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Nakiese',
    description: 'Get in touch with our support team for bookings, partnerships, or general inquiries.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Nakiese',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+243 906947381',
          contactType: 'customer service',
          areaServed: ['CD', 'KE', 'NG', 'ZA'], // Country codes
          availableLanguage: ['en', 'fr']
        },
        {
          '@type': 'ContactPoint',
          email: 'support@nakiese.com',
          contactType: 'technical support'
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
      <ContactView />
    </>
  );
}