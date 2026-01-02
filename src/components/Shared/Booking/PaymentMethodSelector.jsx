import React, { useState, useMemo } from 'react';
import { CreditCard, Banknote, Smartphone, AlertCircle } from 'lucide-react';

export default function PaymentMethodSelector({ t, data }) {
  // 1. Define all possible methods
  const allMethods = useMemo(() => [
    { 
      id: 'card', 
      flag: 'card_payment_accepted', 
      label: t('pay_card_label') || "Pay with Card", 
      icon: CreditCard, 
      sub: t('pay_card_sub') || "Secure encrypted payment" 
    },
    { 
      id: 'cash', 
      flag: 'cash_payment_accepted', 
      label: t('pay_cash_label') || "Pay at Property", 
      icon: Banknote, 
      sub: t('pay_cash_sub') || "Pay when you arrive" 
    },
    { 
      id: 'mobile', 
      flag: 'mobile_payment_accepted', 
      label: t('pay_mobile_label') || "Mobile Money", 
      icon: Smartphone, 
      sub: t('pay_mobile_sub') || "Wave, Orange Money" 
    },
  ], [t]);

  // 2. Filter based on Property Data
  const availableMethods = useMemo(() => {
    if (!data) return [];
    return allMethods.filter(method => data[method.flag] === true);
  }, [data, allMethods]);

  // 3. User Selection State (Initially null)
  const [userSelection, setUserSelection] = useState(null);

  // 4. DERIVED STATE: Calculate active selection during render
  // If user hasn't selected anything, fallback to the first available method.
  // This replaces the need for useEffect to "set" a default.
  const activeMethodId = userSelection || (availableMethods.length > 0 ? availableMethods[0].id : '');

  // Edge Case: No payment methods defined
  if (availableMethods.length === 0) {
    return (
      <div className="p-4 bg-amber-50 text-amber-800 rounded-xl flex items-center gap-3 text-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{t('no_payment_methods') || "No payment methods available for this property."}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {availableMethods.map((method) => {
        const Icon = method.icon;
        const isActive = activeMethodId === method.id;
        
        return (
          <label 
            key={method.id}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
              isActive 
                ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <input 
              type="radio" 
              name="payment_method" 
              value={method.id} 
              checked={isActive}
              onChange={() => setUserSelection(method.id)}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            
            <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
              <Icon className="w-5 h-5" />
            </div>

            <div>
              <p className={`font-bold text-sm ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                {method.label}
              </p>
              <p className="text-xs text-slate-500">{method.sub}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}