import WishlistView from '@/components/Pages/WishlistPage/WishlistView';
import { getTranslations } from 'next-intl/server';

// 1. Generate Metadata
export async function generateMetadata({ params }) {
  const { locale } = await params; // Next.js 15 await pattern
  const t = await getTranslations({ locale, namespace: 'Metadata.Wishlist' });
  
  return {
    title: t('title'),
    description: t('description'),
    // Important: Wishlists are private/user-specific, so we usually don't want Google to index empty pages
    robots: {
      index: false, 
      follow: true,
    },
  };
}

// 2. Server Page Component
export default function WishlistPage() {
  
  // No JSON-LD needed here as this is a personal user page

  return (
    <>
      <WishlistView />
    </>
  );
}