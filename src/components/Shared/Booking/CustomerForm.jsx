import React from 'react';

const InputGroup = ({ label, type = "text", placeholder, required = true }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type} 
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white"
    />
  </div>
);

export default function CustomerForm({ t }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputGroup label={t('first_name') || "First Name"} placeholder="John" />
      <InputGroup label={t('last_name') || "Last Name"} placeholder="Doe" />
      
      <InputGroup label={t('email') || "Email Address"} type="email" placeholder="john@example.com" />
      <InputGroup label={t('phone') || "Phone Number"} type="tel" placeholder="+1 234 567 890" />
      
      <div className="md:col-span-2 space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          {t('special_requests') || "Special Requests"} <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span>
        </label>
        <textarea 
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white resize-none"
          placeholder={t('requests_placeholder') || "Late check-in, dietary restrictions, etc."}
        />
      </div>
    </div>
  );
}