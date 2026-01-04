import { AFRICAN_COUNTRIES } from '@/constants/booking';
import React, { useState } from 'react';



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