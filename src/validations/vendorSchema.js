import * as Yup from 'yup';

export const propertySchema = Yup.object().shape({
  property_type: Yup.string().oneOf(['HL', 'RT']).required('Property type is required'),
  title: Yup.string()
    .min(5, 'Title is too short')
    .max(100, 'Title is too long')
    .required('Title is required'),
  description: Yup.string()
    .min(20, 'Please provide a more detailed description')
    .required('Description is required'),

  // Nested Address Validation
  location: Yup.object().shape({
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'), // Expects UUID
    country: Yup.string().required('Country is required'), // Expects UUID
    state: Yup.string().required('State/Region is required'),
  }),

  // Conditional Logic for Operations
  check_in_time: Yup.string().when('property_type', {
    is: 'HL',
    then: (schema) => schema.required('Check-in time is required for hotels'),
    otherwise: (schema) => schema.nullable(),
  }),
  check_out_time: Yup.string().when('property_type', {
    is: 'HL',
    then: (schema) => schema.required('Check-out time is required for hotels'),
    otherwise: (schema) => schema.nullable(),
  }),

  opening_time: Yup.string().when(['property_type', 'is_open_24_hours'], {
    is: (type, is24) => type === 'RT' && is24 === false,
    then: (schema) => schema.required('Opening time is required'),
    otherwise: (schema) => schema.nullable(),
  }),

  // Tax Info
  tax_info: Yup.object().shape({
    tax_id_number: Yup.string().required('TIN/NINEA is required for legal compliance'),
    declared_value: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .positive('Value must be greater than 0')
      .required('Declared value is required'),
  }),
});