'use client'

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader2, Check, X } from 'lucide-react';
import { getValidationSchema } from '@/validations/profileConfig';

// ✅ Pass 't' (translation function) as a prop
export default function EditableRow({ field, currentValue, onSave, isGlobalUpdating, t }) {
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
        [field.key]: currentValue || ''
    },
    enableReinitialize: true,
    // ✅ Generate schema using 't' so errors are translated
    validationSchema: Yup.object({
        [field.key]: getValidationSchema(field.key, t) 
    }),
    onSubmit: async (values) => {
        if (values[field.key] === currentValue) {
            setIsEditing(false);
            return;
        }
        try {
            await onSave(values);
            setIsEditing(false);
        } catch (error) {
            console.error("Save failed", error);
        }
    }
  });

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const getDisplayLabel = () => {
      if (field.type === 'select' && field.options) {
          const option = field.options.find(opt => opt.value === currentValue);
          // ✅ Translate option label if 'labelKey' exists, else use raw label
          return option ? (option.labelKey ? t(`options.${option.labelKey}`) : option.label) : currentValue;
      }
      return currentValue;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between p-6 hover:bg-gray-50 transition-colors duration-200 gap-4">
      
      {/* Label */}
      <div className="w-full sm:w-1/3 pt-2">
        {/* ✅ Translate the Field Label */}
        <span className="text-sm font-medium text-gray-500 block">
            {t(`labels.${field.labelKey}`)}
        </span>
      </div>

      {/* Input / Display */}
      <div className="flex-1 flex flex-col items-end">
        {isEditing ? (
          <form onSubmit={formik.handleSubmit} className="w-full sm:w-auto flex flex-col gap-1 items-end">
            <div className="flex items-center gap-2 w-full">
                {field.type === 'select' ? (
                    <select
                        name={field.key}
                        value={formik.values[field.key]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isGlobalUpdating}
                        className={`form-select block w-full border rounded-lg text-sm focus:ring-blue-500 ${
                            formik.errors[field.key] ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="" disabled>{t('actions.select')}...</option>
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {/* ✅ Translate Option */}
                                {opt.labelKey ? t(`options.${opt.labelKey}`) : opt.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input 
                        type={field.type}
                        name={field.key}
                        value={formik.values[field.key]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isGlobalUpdating}
                        // ✅ Translate Placeholder
                        placeholder={field.placeholderKey ? t(`placeholders.${field.placeholderKey}`) : ''}
                        className={`form-input block w-full border rounded-lg text-sm focus:ring-blue-500 ${
                            formik.errors[field.key] ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                )}
                
                {/* Save/Cancel Buttons */}
                <button type="submit" disabled={isGlobalUpdating || !formik.isValid} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition disabled:opacity-50 shrink-0">
                    {isGlobalUpdating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
                </button>
                <button type="button" onClick={handleCancel} disabled={isGlobalUpdating} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50 shrink-0">
                    <X className="w-4 h-4"/>
                </button>
            </div>
            {formik.touched[field.key] && formik.errors[field.key] && (
                <div className="text-xs text-red-600 font-medium mt-1 text-right w-full">
                    {formik.errors[field.key]}
                </div>
            )}
          </form>
        ) : (
          <div className="text-right font-medium text-gray-900 pt-2">
             {getDisplayLabel() || <span className="text-gray-400 italic">{t('validation.required')}</span>}
          </div>
        )}
      </div>

      {/* Edit Trigger */}
      {!isEditing && !field.isReadOnly && (
        <div className="sm:w-20 text-right pt-2">
             <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                {t('actions.edit')}
            </button>
        </div>
      )}

      {/* Locked Badge */}
      {field.isReadOnly && (
          <div className="sm:w-20 text-right pt-2">
             <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{t('actions.locked')}</span>
          </div>
      )}
    </div>
  );
}