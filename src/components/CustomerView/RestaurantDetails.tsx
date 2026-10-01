import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  Bike,
  ShieldCheck,
  Phone,
  MapPin,
  Tag,
  Plus
} from 'lucide-react';
import { Restaurant, FoodItem } from '../../types';
import { AppState } from '../../services/store';
import { FoodModal } from './FoodModal';
import { getTranslation } from '../../i18n/translations';

interface RestaurantDetailsProps {
  restaurant: Restaurant;
  state: AppState;
  onBack: () => void;
  onOpenCart: () => void;
}

export const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  restaurant,
  state,
  onBack,
  onOpenCart
}) => {
  const t = getTranslation(state.language);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const foods = state.foods.filter((f) => f.restaurantId === restaurant.id);
  const categories = state.language === 'bn'
    ? [
        { id: 'all', name: 'সকল খাবার' },
        ...state.restaurants.find((r) => r.id === restaurant.id)
          ? [
              { id: 'cat-biryani', name: 'বিরিয়ানি ও স্পেশাল' },
              { id: 'cat-burgers', name: 'বার্গার ও ফাস্টফুড' },
              { id: 'cat-kebabs', name: 'কাবাব ও ফ্রাইস' }
            ]
          : []
      ]
    : [
        { id: 'all', name: 'All Dishes' },
        { id: 'cat-biryani', name: 'Biryani & Specials' },
        { id: 'cat-burgers', name: 'Burgers & Fast Food' },
        { id: 'cat-kebabs', name: 'Kebabs & Fries' }
      ];

  const filteredFoods = activeCategory === 'all'
    ? foods
    : foods.filter((f) => f.categoryId === activeCategory);

  return (
    <div className="pb-24">
      {/* Cover Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-black/30" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Restaurant Header Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-black tracking-tight">
                  {state.language === 'bn' ? restaurant.nameBn : restaurant.name}
                </h1>
                {restaurant.isVerified && (
                  <span title="Verified by Wafa QuickEats Admin" className="text-emerald-400">
                    <ShieldCheck className="w-6 h-6 fill-emerald-500/20" />
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 line-clamp-1">
                {restaurant.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {restaurant.rating} ({restaurant.reviewCount}+)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {restaurant.estimatedPrepTime} {t.deliveryTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-emerald-400" />
                  ৳{restaurant.deliveryFee} fee
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                restaurant.status === 'open'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {restaurant.status === 'open' ? t.openNow : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Restaurant Metadata Row */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-600">
            <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{restaurant.address}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600">
            <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{restaurant.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600">
            <Tag className="w-5 h-5 text-indigo-500 shrink-0" />
            <span>{restaurant.cuisine.join(', ')}</span>
          </div>
        </div>

        {/* Offer Notice Banner if any */}
        {restaurant.offerBadge && (
          <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-center gap-2 text-xs font-bold text-amber-900">
            <span className="text-amber-500 text-base">🏷️</span>
            <span>{restaurant.offerBadge}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === c.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              onClick={() => setSelectedFood(food)}
              className="group bg-white rounded-3xl border border-slate-200/80 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={food.photos[0]}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                {food.discountPrice && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                    ৳{food.price - food.discountPrice} OFF
                  </span>
                )}
                {food.isPopular && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
                    POPULAR
                  </span>
                )}
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                    {state.language === 'bn' ? food.nameBn : food.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {state.language === 'bn' ? food.descriptionBn : food.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-slate-900">
                      ৳{food.discountPrice || food.price}
                    </span>
                    {food.discountPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ৳{food.price}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFood(food);
                    }}
                    className="flex items-center gap-1 bg-amber-50 hover:bg-amber-500 text-amber-800 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Food Item Modal */}
      {selectedFood && (
        <FoodModal
          food={selectedFood}
          state={state}
          onClose={() => setSelectedFood(null)}
          onAddedToCart={onOpenCart}
        />
      )}
    </div>
  );
};
