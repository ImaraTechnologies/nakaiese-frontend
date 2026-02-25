'use client';

import React from 'react';
import {
  Building2, MapPin, Clock, FileText, DollarSign,
  ChevronRight, ChevronLeft, Upload, Check, Camera,
  UtensilsCrossed, Loader2
} from 'lucide-react';
import { usePropertyWizard } from '@/hooks/usePropertyWizard'; // Adjust path
import { useCitiesForVendor, useCountries } from '@/hooks/useCities';

// --- CONSTANTS ---
const STEPS = [
  { id: 1, title: "Basics", icon: Building2 },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Operations", icon: Clock },
  { id: 4, title: "Amenities", icon: FileText },
  { id: 5, title: "Tax & Legal", icon: DollarSign },
];

const AMENITIES = ["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar", "Parking", "AC"];

// --- REUSABLE UI HELPERS ---
const InputGroup = ({ label, children, subtitle }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-slate-700">{label}</label>
    {subtitle && <p className="text-xs text-slate-500 mb-2">{subtitle}</p>}
    {children}
  </div>
);

const StyledInput = (props) => (
  <input
    {...props}
    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
  />
);

const StepIndicator = ({ steps, currentStep }) => (
  <div className="bg-slate-900 text-white p-8">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">List Your Property</h1>
      <div className="flex justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-700 -z-0 transform -translate-y-1/2" />
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-slate-900 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-900' :
                isCompleted ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                {isCompleted ? <Check size={18} /> : <Icon size={18} />}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default function CreatePropertyWizard() {
  const {
    currentStep, formData, updateField, updateNestedField,
    toggleArrayItem, handleImageUpload, nextStep, prevStep, isSubmitting
  } = usePropertyWizard(STEPS.length);

  const { data: citiesData, isLoading: citiesLoading, isError: citiesError } = useCitiesForVendor(formData.location.country);
  const { data: countriesData, isLoading: countriesLoading, isError: countriesError } = useCountries();


  const handleSubmit = async () => {
    // API Call logic here
    console.log("Submit:", formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <div className="flex-1 w-full max-w-3xl mx-auto -mt-6 mb-12 p-4 z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">

          {/* CONTENT AREA */}
          <div className="flex-1 p-8 overflow-y-auto">

            {/* --- STEP 1: BASICS --- */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'HL', label: 'Hotel', icon: Building2, color: 'text-blue-600' },
                    { id: 'RT', label: 'Restaurant', icon: UtensilsCrossed, color: 'text-orange-600' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updateField('property_type', type.id)}
                      className={`p-6 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${formData.property_type === type.id
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-100 hover:border-slate-200'
                        }`}
                    >
                      <type.icon className={`w-8 h-8 ${formData.property_type === type.id ? type.color : 'text-slate-400'}`} />
                      <span className="font-bold text-slate-700">{type.label}</span>
                    </button>
                  ))}
                </div>
                <InputGroup label="Property Title">
                  <StyledInput
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g. The Grand Hotel"
                  />
                </InputGroup>
                <InputGroup label="Description">
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe your property..."
                  />
                </InputGroup>
              </div>
            )}

            {/* --- STEP 2: LOCATION --- */}
            {/* --- STEP 2: LOCATION --- */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 gap-4">

                  <InputGroup
                    label="Country"
                    subtitle="Select the country of operation"
                    error={countriesError && "Failed to load countries"}
                  >
                    <div className="relative">
                      <select
                        className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all ${countriesLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300'
                          }`}
                        value={formData.location.country}
                        onChange={(e) => {
                          updateNestedField('location', 'country', e.target.value);
                          // PRODUCTION GUARD: Reset city selection when country changes
                          updateNestedField('location', 'city', "");
                        }}
                        disabled={countriesLoading}
                      >
                        <option value="">{countriesLoading ? "Loading..." : "Select Country..."}</option>
                        {countriesData?.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {countriesLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 size={14} className="animate-spin text-slate-400" />
                        </div>
                      )}
                    </div>
                  </InputGroup>

                  {/* CITY SELECT */}
                  <InputGroup
                    label="City"
                    subtitle="Filterable by country"
                  >
                    <div className="relative">
                      <select
                        className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all ${(!formData.location.country || citiesLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300'
                          }`}
                        value={formData.location.city}
                        onChange={(e) => updateNestedField('location', 'city', e.target.value)}
                        // PRODUCTION GUARD: Disable if no country is selected or data is loading
                        disabled={citiesLoading || !formData.location.country}
                      >
                        <option value="">
                          {!formData.location.country
                            ? "Choose a country first"
                            : citiesLoading ? "Fetching local cities..." : "Select City..."}
                        </option>

                        {Array.isArray(citiesData) && citiesData.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>

                      {citiesLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 size={14} className="animate-spin text-slate-400" />
                        </div>
                      )}
                    </div>

                    {citiesError && (
                      <p className="text-[10px] text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        Error loading cities. Please check your connection.
                      </p>
                    )}
                  </InputGroup>
                </div>

                <InputGroup label="Street Address">
                  <StyledInput
                    value={formData.location.street}
                    onChange={(e) => updateNestedField('location', 'street', e.target.value)}
                    placeholder="e.g. 123 Almadies Boulevard"
                  />
                </InputGroup>

                {/* GPS DETECTION BUTTON */}
                <button
                  type="button"
                  className="w-full bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between group hover:bg-blue-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <MapPin size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-blue-900">Auto-detect Location</p>
                      <p className="text-blue-700 text-[11px]">Set precise GPS coordinates</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 px-3 py-1 bg-white rounded-lg shadow-sm">Detect</span>
                </button>
              </div>
            )}
            {/* --- STEP 3: OPERATIONS --- */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {formData.property_type === 'HL' ? (
                  <div className="grid grid-cols-2 gap-6">
                    <InputGroup label="Check-in Time">
                      <StyledInput type="time" value={formData.check_in_time} onChange={(e) => updateField('check_in_time', e.target.value)} />
                    </InputGroup>
                    <InputGroup label="Check-out Time">
                      <StyledInput type="time" value={formData.check_out_time} onChange={(e) => updateField('check_out_time', e.target.value)} />
                    </InputGroup>
                  </div>
                ) : (
                  <>
                    <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={formData.is_open_24_hours}
                        onChange={(e) => updateField('is_open_24_hours', e.target.checked)}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block font-bold text-sm text-slate-800">Open 24 Hours</span>
                        <span className="text-xs text-slate-500">Ignore opening/closing times</span>
                      </div>
                    </label>
                    {!formData.is_open_24_hours && (
                      <div className="grid grid-cols-2 gap-6">
                        <InputGroup label="Opens At"><StyledInput type="time" /></InputGroup>
                        <InputGroup label="Closes At"><StyledInput type="time" /></InputGroup>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* --- STEP 4: AMENITIES --- */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <InputGroup label="Popular Amenities" subtitle="Select all that apply">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {AMENITIES.map((item) => (
                      <label key={item} className={`
                        flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm
                        ${formData.amenities.includes(item)
                          ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'}
                      `}>
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 focus:ring-blue-500"
                          checked={formData.amenities.includes(item)}
                          onChange={() => toggleArrayItem('amenities', item)}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </InputGroup>
              </div>
            )}

            {/* --- STEP 5: TAX & MEDIA --- */}
            {currentStep === 5 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Camera size={24} />
                  </div>
                  <p className="font-semibold text-slate-700">Upload Property Images</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                  {formData.images.length > 0 && (
                    <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      {formData.images.length} files selected
                    </div>
                  )}
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <h3 className="font-bold text-yellow-800 text-sm mb-2 flex items-center gap-2">
                    <DollarSign size={16} /> Tax Compliance
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <StyledInput placeholder="TIN / NINEA" value={formData.tax_info.tax_id_number} onChange={(e) => updateNestedField('tax_info', 'tax_id_number', e.target.value)} />
                    <StyledInput type="number" placeholder="Declared Value (XOF)" value={formData.tax_info.declared_value} onChange={(e) => updateNestedField('tax_info', 'declared_value', e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <button
              onClick={prevStep} disabled={currentStep === 1}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-slate-900 transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Back
            </button>

            {currentStep === STEPS.length ? (
              <button
                onClick={handleSubmit} disabled={isSubmitting}
                className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                Create Property
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center gap-2"
              >
                Next Step <ChevronRight size={16} />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}