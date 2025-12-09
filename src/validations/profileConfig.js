import * as Yup from 'yup';

// --- Constants ---

export const COUNTRY_OPTIONS = [
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Morocco', label: 'Morocco' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'France', label: 'France' },
  { value: 'Germany', label: 'Germany' },
  { value: 'China', label: 'China' },
  { value: 'India', label: 'India' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Australia', label: 'Australia' },
];

export const GENDER_OPTIONS = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'O', label: 'Other' },
    { value: 'N', label: 'Prefer not to say' }
];

export const PROFILE_FIELDS = [
  { labelKey: 'first_name', key: 'first_name', type: 'text', placeholderKey: 'first_name' },
  { labelKey: 'last_name', key: 'last_name', type: 'text', placeholderKey: 'last_name' },
  { labelKey: 'email', key: 'email', type: 'email', isReadOnly: true },
  { labelKey: 'phone_no', key: 'phone_no', type: 'tel', placeholderKey: 'phone_no' },
  { labelKey: 'dob', key: 'dob', type: 'date' },
  { labelKey: 'nationality', key: 'nationality', type: 'select', options: COUNTRY_OPTIONS }, 
  { labelKey: 'gender', key: 'gender', type: 'select', options: GENDER_OPTIONS },
];

// --- Validation Factory ---

export const getValidationSchema = (key) => {
    // Date of Birth: 16+ Check
    if (key === 'dob') {
        const today = new Date();
        const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
        
        return Yup.date()
            .max(new Date(), "Future dates are not allowed")
            .max(minAgeDate, "You must be at least 16 years old")
            .required("Date of Birth is required");
    }

    // Email
    if (key === 'email') {
        return Yup.string().email("Invalid email address").required("Required");
    }

    // Phone (Basic Regex for international numbers)
    if (key === 'phone_no') {
        return Yup.string()
            .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
            .required("Phone number is required");
    }

    // Names
    if (key === 'first_name' || key === 'last_name') {
        return Yup.string()
            .min(2, "Too Short")
            .max(50, "Too Long")
            .required("Required");
    }

    // Default
    return Yup.string().nullable();
};