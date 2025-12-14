'use client';
import React, { useState } from 'react';
import { useFormatter } from 'next-intl';
import clsx from 'clsx'; // Ensure you have clsx installed: npm install clsx

const MenuDisplay = ({ menus, t }) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const format = useFormatter();

  if (!menus || menus.length === 0) return null;

  const currentMenu = menus[activeMenuIndex];

  return (
    <div className="mt-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">{t('ourMenu')}</h2>
        
        {/* Menu Tabs (only if > 1 menu) */}
        {menus.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {menus.map((menu, idx) => (
              <button 
                key={menu.id}
                onClick={() => setActiveMenuIndex(idx)}
                className={clsx(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  activeMenuIndex === idx 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {menu.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Menu Categories & Items */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {currentMenu.categories?.length > 0 ? (
          currentMenu.categories.map((category) => (
            <div key={category.id} className="mb-8 last:mb-0">
              
              <h3 className="text-lg font-bold text-yellow-600 mb-4 uppercase tracking-wider text-xs border-b border-yellow-100 pb-2">
                {category.name}
              </h3>
              
              <div className="grid gap-6">
                {category.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-900 group-hover:text-yellow-600 transition-colors">
                          {item.name}
                        </h4>
                        
                        {/* Dietary Tags */}
                        {item.is_vegetarian && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-bold uppercase">
                            {t('vegetarian')}
                          </span>
                        )}
                        {item.is_vegan && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-bold uppercase">
                            Vegan
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="font-bold text-slate-900 whitespace-nowrap">
                      {format.number(item.price, { style: 'currency', currency: 'USD' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-center italic py-4">No items available in this menu.</p>
        )}
      </div>
    </div>
  );
};

export default MenuDisplay;