import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePropertyMutation } from './usePropertyMutation';

export function usePropertyWizard(totalSteps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate, isPending } = usePropertyMutation();

  const currentStep = parseInt(searchParams.get('step')) || 1;

  const [formData, setFormData] = useState({
    // Core Info
    property_type: 'HL', // 'HL' for Hotel, 'RT' for Restaurant
    title: '',
    description: '',

    // Nested Address (Matches AddressSerializer)
    location: {
      street: '',
      city: '',     // UUID from your Cities selection
      country: '',  // UUID from your Country selection
      state: '',
      zip_code: '',
      latitude: null,
      longitude: null
    },

    // Amenities & Languages (JSON fields in Django)
    amenities: [],
    staff_languages: [],

    // Hotel Specifics
    check_in_time: '14:00',
    check_out_time: '11:00',

    // Restaurant Specifics
    is_open_24_hours: false,
    opening_time: '09:00',
    closing_time: '22:00',

    // UI/Internal state for images (to be handled via FormData later)
    images: [],

    // Tax Info (OneToOne relationship)
    tax_info: {
      tax_id_number: '',
      declared_value: 0,
      registry_number: ''
    }
  });

  // Navigation Logic
  const setStep = (step) => {
    const params = new URLSearchParams(searchParams);
    params.set('step', step.toString());
    router.push(`?${params.toString()}`);
  };

  const nextStep = () => currentStep < totalSteps && setStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setStep(currentStep - 1);

  // Form Update Logic
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  // Final Submit
  const [errors, setErrors] = useState({});

  const submitForm = async () => {
    try {
      // Validate the current formData against the schema
      // abortEarly: false ensures we get ALL errors, not just the first one
      await propertySchema.validate(formData, { abortEarly: false });

      setErrors({}); // Clear previous errors
      mutate(formData);

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);

        // Optional: Jump back to the first step that has an error
        // if (validationErrors['title']) setStep(1);
      }
    }
  };

  return {
    currentStep,
    formData,
    isSubmitting: isPending, // From TanStack Query
    updateField,
    updateNestedField,
    toggleArrayItem,
    nextStep,
    prevStep,
    submitForm
  };
}