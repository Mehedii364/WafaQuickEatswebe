import React, { useState } from 'react';
import {
  ShoppingBag,
  Bell,
  Globe,
  User,
  Shield,
  Bike,
  Store,
  Menu,
  X,
  AlertTriangle,
  Award
} from 'lucide-react';
import { UserRole, Language } from '../types';
import { store, AppState } from '../services/store';
import { getTranslation } from '../i18n/translations';

interface NavbarProps {
  state: AppState;
  onOpenCart: () => void;
  onOpenNotifications: () => void;
  onOpenPoints: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onOpenCart,
  onOpenNotifications,
  onOpenPoints,
  activeTab,
  setActiveTab
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = getTranslation(state.language);

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifCount = state.notifications.filter((n) => !n.isRead).length;

  const handleRoleChange = (role: UserRole) => {
    store.setRole(role);
    setIsRoleMenuOpen(false);
    if (role === 'customer') setActiveTab('home');
    if (role === 'restaurant_manager') setActiveTab('restaurant-portal');
    if (role === 'rider') setActiveTab('rider-portal');
    if (role === 'admin' || role === 'super_admin') setActiveTab('admin-portal');
  };

  const handleLanguageToggle = () => {
    store.setLanguage(state.language === 'bn' ? 'en' : 'bn');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'customer':
        return { label: 'Customer', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: User };
      case 'restaurant_manager':
        return { label: 'Restaurant Partner', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: Store };
      case 'rider':
        return { label: 'Rider Pilot', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20', icon: Bike };
      case 'admin':
      case 'super_admin':
        return { label: 'Super Admin', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20', icon: Shield };
    }
  };

  const currentBadge = getRoleBadge(state.currentRole);
  const RoleIcon = currentBadge.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Emergency Notice Bar if active */}
      {state.isMaintenanceMode && (
        <div className="bg-rose-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>System Maintenance Mode Active: Limited functionalities enabled.</span>
        </div>
      )}
      {state.isOrdersPaused && !state.isMaintenanceMode && (
        <div className="bg-amber-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>New order intake temporarily paused by dispatch command.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 text-xl font-bold">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                Wafa QuickEats
              </span>
              <span className="text-amber-500 font-bold">⚡</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium hidden sm:block -mt-0.5">
              Wafa Zone by Mehedi364 • <span className="text-emerald-600 font-semibold">{t.tagline}</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'home' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'restaurants' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.navRestaurants}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'orders' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.navOrders}
          </button>
          <button
            onClick={onOpenPoints}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>{state.customer.points} Pts</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={handleLanguageToggle}
            title="Toggle Language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            <span>{state.language === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold ${currentBadge.color} transition-all shadow-xs`}
            >
              <RoleIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentBadge.label}</span>
              <span className="text-[10px] opacity-60">▼</span>
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Portal
                </div>
                <button
                  onClick={() => handleRoleChange('customer')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    state.currentRole === 'customer' ? 'font-bold text-amber-600 bg-amber-50/50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500" />
                    <span>Customer App</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">WQE-CUS</span>
                </button>
                <button
                  onClick={() => handleRoleChange('restaurant_manager')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    state.currentRole === 'restaurant_manager' ? 'font-bold text-amber-600 bg-amber-50/50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-500" />
                    <span>Restaurant Partner</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">WQE-RES</span>
                </button>
                <button
                  onClick={() => handleRoleChange('rider')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    state.currentRole === 'rider' ? 'font-bold text-amber-600 bg-amber-50/50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-cyan-500" />
                    <span>Rider Pilot</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">WQE-RDR</span>
                </button>
                <button
                  onClick={() => handleRoleChange('super_admin')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    state.currentRole === 'super_admin' ? 'font-bold text-amber-600 bg-amber-50/50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-rose-500" />
                    <span>Super Admin Control</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">WQE-ADM</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-slate-900/10 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{t.navCart}</span>
            <span className="bg-amber-500 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-md text-[10px]">
              {cartItemCount}
            </span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 text-slate-800 font-semibold text-xs text-left"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => {
                setActiveTab('restaurants');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 text-slate-800 font-semibold text-xs text-left"
            >
              {t.navRestaurants}
            </button>
            <button
              onClick={() => {
                setActiveTab('orders');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 text-slate-800 font-semibold text-xs text-left"
            >
              {t.navOrders}
            </button>
            <button
              onClick={() => {
                onOpenPoints();
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl bg-amber-50 text-amber-800 font-semibold text-xs text-left"
            >
              {state.customer.points} Rewards Pts
            </button>
          </div>
          <div className="pt-2 text-[11px] text-slate-400">
            Official: {t.officialDomain} • {t.developer}
          </div>
        </div>
      )}
    </header>
  );
};
