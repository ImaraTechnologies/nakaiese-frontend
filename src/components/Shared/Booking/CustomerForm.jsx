import React, { useState } from 'react';

// --- DATA: List of African Countries with Dial Codes ---
const AFRICAN_COUNTRIES = [
  { code: 'DZ', name: 'Algeria', dial: '+213' },
  { code: 'AO', name: 'Angola', dial: '+244' },
  { code: 'BJ', name: 'Benin', dial: '+229' },
  { code: 'BW', name: 'Botswana', dial: '+267' },
  { code: 'BF', name: 'Burkina Faso', dial: '+226' },
  { code: 'BI', name: 'Burundi', dial: '+257' },
  { code: 'CV', name: 'Cabo Verde', dial: '+238' },
  { code: 'CM', name: 'Cameroon', dial: '+237' },
  { code: 'CF', name: 'Central African Republic', dial: '+236' },
  { code: 'TD', name: 'Chad', dial: '+235' },
  { code: 'KM', name: 'Comoros', dial: '+269' },
  { code: 'CD', name: 'DR Congo', dial: '+243' },
  { code: 'CG', name: 'Republic of the Congo', dial: '+242' },
  { code: 'CI', name: 'Côte d\'Ivoire', dial: '+225' },
  { code: 'DJ', name: 'Djibouti', dial: '+253' },
  { code: 'EG', name: 'Egypt', dial: '+20' },
  { code: 'GQ', name: 'Equatorial Guinea', dial: '+240' },
  { code: 'ER', name: 'Eritrea', dial: '+291' },
  { code: 'SZ', name: 'Eswatini', dial: '+268' },
  { code: 'ET', name: 'Ethiopia', dial: '+251' },
  { code: 'GA', name: 'Gabon', dial: '+241' },
  { code: 'GM', name: 'Gambia', dial: '+220' },
  { code: 'GH', name: 'Ghana', dial: '+233' },
  { code: 'GN', name: 'Guinea', dial: '+224' },
  { code: 'GW', name: 'Guinea-Bissau', dial: '+245' },
  { code: 'KE', name: 'Kenya', dial: '+254' },
  { code: 'LS', name: 'Lesotho', dial: '+266' },
  { code: 'LR', name: 'Liberia', dial: '+231' },
  { code: 'LY', name: 'Libya', dial: '+218' },
  { code: 'MG', name: 'Madagascar', dial: '+261' },
  { code: 'MW', name: 'Malawi', dial: '+265' },
  { code: 'ML', name: 'Mali', dial: '+223' },
  { code: 'MR', name: 'Mauritania', dial: '+222' },
  { code: 'MU', name: 'Mauritius', dial: '+230' },
  { code: 'MA', name: 'Morocco', dial: '+212' },
  { code: 'MZ', name: 'Mozambique', dial: '+258' },
  { code: 'NA', name: 'Namibia', dial: '+264' },
  { code: 'NE', name: 'Niger', dial: '+227' },
  { code: 'NG', name: 'Nigeria', dial: '+234' },
  { code: 'RW', name: 'Rwanda', dial: '+250' },
  { code: 'ST', name: 'Sao Tome and Principe', dial: '+239' },
  { code: 'SN', name: 'Senegal', dial: '+221' },
  { code: 'SC', name: 'Seychelles', dial: '+248' },
  { code: 'SL', name: 'Sierra Leone', dial: '+232' },
  { code: 'SO', name: 'Somalia', dial: '+252' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'SS', name: 'South Sudan', dial: '+211' },
  { code: 'SD', name: 'Sudan', dial: '+249' },
  { code: 'TZ', name: 'Tanzania', dial: '+255' },
  { code: 'TG', name: 'Togo', dial: '+228' },
  { code: 'TN', name: 'Tunisia', dial: '+216' },
  { code: 'UG', name: 'Uganda', dial: '+256' },
  { code: 'ZM', name: 'Zambia', dial: '+260' },
  { code: 'ZW', name: 'Zimbabwe', dial: '+263' },
];

const InputGroup = ({ label, type = "text", placeholder, required = true, name, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type} 
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white"
    />
  </div>
);

const CountrySelect = ({ label, required = true, value, onChange, name }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select 
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 bg-white appearance-none cursor-pointer"
      >
        <option value="" disabled>Select Country</option>
        {AFRICAN_COUNTRIES.map((country) => (
          <option key={country.code} value={country.name}>{country.name}</option>
        ))}
        <option value="Other">Other / International</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  </div>
);

export default function CustomerForm({ t, formData, onChange }) {
  // Helper to handle standard inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputGroup 
        label={t('first_name') || "First Name"} 
        placeholder="John" 
        name="first_name" 
        value={formData.first_name} 
        onChange={handleChange} 
      />
      <InputGroup 
        label={t('last_name') || "Last Name"} 
        placeholder="Doe" 
        name="last_name" 
        value={formData.last_name} 
        onChange={handleChange} 
      />
      
      <InputGroup 
        label={t('email') || "Email Address"} 
        type="email" 
        placeholder="john@example.com" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
      />
      
      <InputGroup 
        label={t('phone') || "Phone Number"} 
        placeholder="+221 77 123 45 67" 
        name="phone_number" 
        value={formData.phone_number} 
        onChange={handleChange} 
      />

      <div className="md:col-span-2">
         <CountrySelect 
            label={t('country') || "Country/Region"} 
            name="country"
            value={formData.country}
            onChange={handleChange}
        />
      </div>

      <div className="md:col-span-2 space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          {t('special_requests') || "Special Requests"} <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span>
        </label>
        <textarea 
          rows={3}
          name="special_requests"
          value={formData.special_requests || ''}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white resize-none"
          placeholder={t('requests_placeholder') || "Late check-in, dietary restrictions, etc."}
        />
      </div>
    </div>
  );
}