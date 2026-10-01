import React from 'react';
import { Home, Compass, Search, ShoppingBag, User } from 'lucide-react';
import { AppState } from '../services/store';
import { getTranslation } from '../i18n/translations';

interface MobileNavProps {
  state: AppState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  state,
  activeTab,
  setActiveTab
}) => {
  const t = getTranslation(state.language);
  const activeOrdersCount = state.orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1 shadow-lg shadow-slate-900/10 safe-area-bottom">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navHome}</span>
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'restaurants' ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navRestaurants}</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'search' ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navSearch}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'orders' ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {activeOrdersCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
          <span className="text-[10px] mt-0.5">{t.navOrders}</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'profile' ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navProfile}</span>
        </button>
      </div>
    </nav>
  );
};
