import { useState } from 'react';

const INITIAL_DATA = {
  title: '', description: '', property_type: 'HL',
  address: { street: '', city_id: '', country_id: '', state: '', zip_code: '' },
  check_in_time: '', check_out_time: '',
  is_open_24_hours: false, opening_time: '', closing_time: '',
  amenities: [], payment_methods: { cash: true, card: false },
  is_child_friendly: false, is_pet_friendly: false,
  tax_info: { tax_id_number: '', declared_value: '' },
  images: []
};

export const usePropertyWizard = (totalSteps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedField = (parent, key, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }));
  };

  const toggleArrayItem = (key, item) => {
    setFormData(prev => {
      const list = prev[key];
      return list.includes(item) 
        ? { ...prev, [key]: list.filter(i => i !== item) }
        : { ...prev, [key]: [...list, item] };
    });
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const nextStep = () => {
    // Add validation logic here if needed (e.g., check required fields)
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return {
    currentStep,
    formData,
    updateField,
    updateNestedField,
    toggleArrayItem,
    handleImageUpload,
    nextStep,
    prevStep,
    isSubmitting,
    setIsSubmitting
  };
};