import { format } from 'date-fns';

// Helper to format 24h time strings (14:00:00) into friendly text (2:00 PM)
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(hours, minutes);
  return format(date, 'h:mm a'); // Requires date-fns, or use native Intl.DateTimeFormat
};

// Maps backend codes to readable labels
const LANGUAGE_MAP = {
  'EN': 'English',
  'FR': 'French',
  'AR': 'Arabic',
  'ES': 'Spanish',
  'DE': 'German',
  'ZH': 'Chinese'
};

const PAYMENT_MAP = {
  'CA': 'Cash only',
  'CC': 'Credit Card',
  'DC': 'Debit Card',
  'MP': 'Mobile Payment'
};

/**
 * Generates dynamic FAQs based on property data.
 * @param {Object} property - The property data object
 * @param {Function} t - The translation function
 */
export const generatePropertyFAQs = (property, t) => {
  const faqs = [];

  // 1. Check-in / Check-out
  if (property.check_in_time && property.check_out_time) {
    faqs.push({
      question: t('faq.check_in_out_q') || "What are the check-in and check-out times?",
      answer: `${t('faq.check_in_at') || "Check-in is from"} ${formatTime(property.check_in_time)}, ${t('faq.check_out_until') || "and check-out is until"} ${formatTime(property.check_out_time)}.`
    });
  }

  // 2. Swimming Pool
  const hasPool = property.amenities?.some(a => a.toLowerCase().includes('swimming pool') || a.toLowerCase().includes('pool'));
  if (hasPool) {
    faqs.push({
      question: t('faq.pool_q') || `Does ${property.title} have a pool?`,
      answer: t('faq.pool_yes') || "Yes, this property has a swimming pool available for guests."
    });
  }

  // 3. Family Friendly
  if (property.is_child_friendly) {
    faqs.push({
      question: t('faq.family_q') || `Is ${property.title} popular with families?`,
      answer: t('faq.family_yes') || "Yes, this property is child-friendly and popular with families."
    });
  }

  // 4. Pet Policy
  faqs.push({
    question: t('faq.pets_q') || "Are pets allowed?",
    answer: property.is_pet_friendly 
      ? (t('faq.pets_yes') || "Yes, pets are allowed at this property.") 
      : (t('faq.pets_no') || "No, pets are not allowed.")
  });

  // 5. Languages Spoken
  if (property.staff_languages && property.staff_languages.length > 0) {
    const langs = property.staff_languages.map(code => LANGUAGE_MAP[code] || code).join(', ');
    faqs.push({
      question: t('faq.languages_q') || "What languages are spoken by the staff?",
      answer: `${t('faq.languages_ans') || "The staff speaks:"} ${langs}.`
    });
  }

  // 6. Payment Methods
  if (property.payment_mode) {
    faqs.push({
      question: t('faq.payment_q') || "How can I pay at the property?",
      answer: PAYMENT_MAP[property.payment_mode] || property.payment_mode
    });
  }

  return faqs;
};