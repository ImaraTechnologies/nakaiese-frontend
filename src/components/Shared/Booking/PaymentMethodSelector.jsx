import React, { useState } from 'react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';

export default function PaymentMethodSelector({ t }) {
  const [selected, setSelected] = useState('card');

  const methods = [
    { id: 'card', label: "Pay with Card", icon: CreditCard, sub: "Secure encrypted payment" },
    { id: 'cash', label: "Pay at Property", icon: Banknote, sub: "Pay when you arrive" },
    // { id: 'mobile', label: "Mobile Money", icon: Smartphone, sub: "Wave, Orange Money" },
  ];

  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const isActive = selected === method.id;
        
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
              onChange={() => setSelected(method.id)}
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