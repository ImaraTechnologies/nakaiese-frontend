'use client';

import React, { useState, useMemo } from 'react';
import { 
  Clock, Leaf, Flame, WheatOff, Info, 
  ChevronRight, UtensilsCrossed 
} from 'lucide-react';
import Image from 'next/image';

// --- Helper Components ---

const DietaryBadge = ({ type }) => {
  const config = {
    veg: { icon: Leaf, label: 'Veg', color: 'text-green-600 bg-green-50 border-green-200' },
    vegan: { icon: Leaf, label: 'Vegan', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    gf: { icon: WheatOff, label: 'GF', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    spicy: { icon: Flame, label: 'Spicy', color: 'text-red-600 bg-red-50 border-red-200' },
  };

  const { icon: Icon, label, color } = config[type];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

// --- Main Component ---

const RestaurantMenu = ({ menus, t }) => {
  // Default to the first menu if available
  const [activeMenuId, setActiveMenuId] = useState(menus?.[0]?.id || null);

  const activeMenu = useMemo(() => 
    menus?.find(m => m.id === activeMenuId), 
  [menus, activeMenuId]);

  if (!menus || menus.length === 0) return null;

  return (
    <section className="py-8 border-t border-slate-200" id="restaurant-menu">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-rose-50 rounded-lg">
          <UtensilsCrossed className="w-6 h-6 text-rose-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          {t ? t('menu_title') : "Our Menu"}
        </h2>
      </div>

      {/* 1. Scrollable Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
        {menus.map((menu) => {
          const isActive = menu.id === activeMenuId;
          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenuId(menu.id)}
              className={`
                whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border
                ${isActive 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200 transform scale-105' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex flex-col items-center leading-none gap-1">
                <span>{menu.name}</span>
                {menu.available_from && (
                  <span className={`text-[10px] font-medium ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    {menu.available_from.slice(0, 5)} - {menu.available_to.slice(0, 5)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Active Menu Content */}
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeMenu?.categories?.map((category) => (
          <div key={category.id}>
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                {category.name}
              </h3>
              <div className="h-px flex-grow bg-slate-100"></div>
            </div>

            {/* Grid of Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {category.items.map((item) => (
                <div key={item.id} className="group flex gap-4">
                  {/* Optional Image (Placeholder logic included) */}
                  {item.image ? (
                     <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-slate-100">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          width={96} 
                          height={96} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                     </div>
                  ) : null}

                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h4>
                      <span className="font-bold text-slate-900 text-lg">
                        ${item.price}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed mb-2 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Badges & Meta */}
                    <div className="flex flex-wrap gap-2 items-center mt-2">
                      {item.is_vegetarian && <DietaryBadge type="veg" />}
                      {item.is_vegan && <DietaryBadge type="vegan" />}
                      {item.is_gluten_free && <DietaryBadge type="gf" />}
                      {item.spiciness_level > 0 && (
                         <div className="flex">
                           {[...Array(item.spiciness_level)].map((_, i) => (
                              <Flame key={i} className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                           ))}
                         </div>
                      )}
                      
                      {item.calories > 0 && (
                        <span className="text-xs text-slate-400 font-medium ml-auto flex items-center gap-1">
                          {item.calories} kcal
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 3. Empty State Handling */}
      {(!activeMenu?.categories || activeMenu.categories.length === 0) && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
           <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
           <p className="text-slate-500">No items available for this menu.</p>
        </div>
      )}

    </section>
  );
};

export default RestaurantMenu;