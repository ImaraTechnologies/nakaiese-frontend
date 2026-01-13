import CityDetailView from '@/components/Pages/CityPage/CityDetailView';
import { notFound } from 'next/navigation';

// Helper: Fetch city for SEO (Server Side)
async function getCitySEO(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/locations/retreive/cities/?id=${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("City SEO Fetch Failed:", res.status, res.statusText);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("City SEO Error:", error);
    return null;
  }
}

// 1. GENERATE METADATA
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const city = await getCitySEO(slug);
  
  // If city is missing in metadata, we can return a fallback or let the page component handle the 404
  if (!city) {
    return { title: 'City Not Found' };
  }

  const title = `Best Hotels & Restaurants in ${city.name} | Nakiese`;
  const desc = city.description
    ? city.description.replace(/<[^>]*>?/gm, '').substring(0, 160)
    : `Explore ${city.name}, ${city.country}. Find top-rated properties and dining experiences.`;

  return {
    title: title,
    description: desc,
    openGraph: {
      title: title,
      description: desc,
      images: city.featured_image ? [city.featured_image] : [],
      type: 'website',
    },
  };
}

// 2. SERVER COMPONENT
export default async function CityPage({ params }) {
  const { slug } = await params;
  const city = await getCitySEO(slug);

  // FIX: Call notFound() as a function
  if (!city) {
    notFound(); 
  }

  // 3. STRUCTURED DATA (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: city.name,
    description: city.description,
    image: city.featured_image,
    touristType: [
      "City",
      "FoodTourism",
      "Hotel"
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: city.country
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Pass slug to client view to handle its own fetching/logic */}
      <CityDetailView slug={slug} />
    </>
  );
}