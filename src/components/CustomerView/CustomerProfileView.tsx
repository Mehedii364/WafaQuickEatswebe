import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Award, Heart, LifeBuoy, LogOut, Plus, ShieldCheck } from 'lucide-react';
import { AppState } from '../../services/store';
import { getTranslation } from '../../i18n/translations';

interface CustomerProfileViewProps {
  state: AppState;
  onOpenPoints: () => void;
  onOpenSupport: () => void;
  onSelectRestaurant: (id: string) => void;
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({
  state,
  onOpenPoints,
  onOpenSupport,
  onSelectRestaurant
}) => {
  const t = getTranslation(state.language);
  const customer = state.customer;
  const favRestaurants = state.restaurants.filter((r) => customer.favorites.includes(r.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={customer.avatar}
          alt={customer.name}
          className="w-20 h-20 rounded-3xl object-cover border-4 border-amber-500/20 shadow-md"
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">{customer.name}</h2>
            <span className="text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
              👑 {customer.tier.toUpperCase()} Member
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{customer.id}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span>{customer.phone}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              <span>{customer.email}</span>
            </span>
          </div>
        </div>

        <button
          onClick={onOpenPoints}
          className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-2xl p-4 text-center shrink-0 transition-colors"
        >
          <Award className="w-6 h-6 text-amber-600 mx-auto" />
          <span className="block text-lg font-black text-amber-950 mt-1">{customer.points}</span>
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            Reward Points
          </span>
        </button>
      </div>

      {/* Saved Delivery Addresses */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Saved Delivery Addresses</span>
          </h3>
          <span className="text-xs text-slate-400">{customer.savedAddresses.length} saved</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {customer.savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 space-y-1 relative"
            >
              {addr.isDefault && (
                <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                  Default
                </span>
              )}
              <div className="font-extrabold text-slate-900 text-sm">{addr.label}</div>
              <p className="text-slate-600 leading-relaxed">{addr.fullAddress}</p>
              {addr.floor && (
                <p className="text-[11px] text-slate-500">
                  Floor: {addr.floor}, Flat: {addr.flat || 'N/A'}
                </p>
              )}
              {addr.deliveryInstructions && (
                <p className="text-[11px] text-amber-700 italic">
                  Note: {addr.deliveryInstructions}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Restaurants */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Favorite Kitchens</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {favRestaurants.map((res) => (
            <div
              key={res.id}
              onClick={() => onSelectRestaurant(res.id)}
              className="p-3 rounded-2xl border border-slate-200/80 hover:border-amber-500 flex items-center gap-3 cursor-pointer transition-all hover:bg-amber-50/20"
            >
              <img
                src={res.logo}
                alt={res.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="min-w-0 flex-1 text-xs">
                <h4 className="font-extrabold text-slate-900 truncate">
                  {state.language === 'bn' ? res.nameBn : res.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">{res.tagline}</p>
                <div className="text-[10px] font-bold text-amber-600 mt-0.5">
                  ★ {res.rating} ({res.reviewCount}+)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onOpenSupport}
          className="p-4 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-3 transition-colors shadow-md"
        >
          <LifeBuoy className="w-5 h-5 text-amber-400" />
          <div className="text-left text-xs">
            <span className="font-extrabold block text-sm">Customer Support</span>
            <span className="text-[11px] text-slate-300">File ticket & disputes</span>
          </div>
        </button>

        <button
          onClick={onOpenPoints}
          className="p-4 rounded-3xl bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-3 transition-colors shadow-md"
        >
          <Award className="w-5 h-5 text-slate-950" />
          <div className="text-left text-xs">
            <span className="font-extrabold block text-sm">Reward Wallet</span>
            <span className="text-[11px] text-amber-950 font-semibold">Redeem {customer.points} points</span>
          </div>
        </button>
      </div>
    </div>
  );
};
