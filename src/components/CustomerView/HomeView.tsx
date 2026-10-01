import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Bike,
  ShieldCheck,
  Tag,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import { Restaurant, FoodItem } from '../../types';
import { AppState } from '../../services/store';
import { initialCategories } from '../../data/initialData';
import { getTranslation } from '../../i18n/translations';

interface HomeViewProps {
  state: AppState;
  onSelectRestaurant: (id: string) => void;
  onSelectFood: (food: FoodItem) => void;
  onOpenPoints: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  state,
  onSelectRestaurant,
  onSelectFood,
  onOpenPoints,
  onTrackOrder
}) => {
  const t = getTranslation(state.language);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterOnlyOpen, setFilterOnlyOpen] = useState(false);
  const [filterRating4Plus, setFilterRating4Plus] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'prepTime' | 'deliveryFee'>('rating');

  // Active delivery notification banner if an order is active
  const activeOrder = state.orders.find(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  // Filter restaurants
  const filteredRestaurants = state.restaurants.filter((res) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      res.name.toLowerCase().includes(q) ||
      res.nameBn.toLowerCase().includes(q) ||
      res.cuisine.some((c) => c.toLowerCase().includes(q)) ||
      res.address.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'all' ||
      state.foods.some((f) => f.restaurantId === res.id && f.categoryId === selectedCategory);

    const matchesOpen = !filterOnlyOpen || res.status === 'open';
    const matchesRating = !filterRating4Plus || res.rating >= 4.7;

    return matchesSearch && matchesCategory && matchesOpen && matchesRating;
  });

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'prepTime') return a.estimatedPrepTime - b.estimatedPrepTime;
    if (sortBy === 'deliveryFee') return a.deliveryFee - b.deliveryFee;
    return 0;
  });

  // Recommended Foods
  const recommendedFoods = state.foods.filter((f) => f.isPopular || f.isFeatured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24">
      {/* Active Order Live Tracker Alert Banner */}
      {activeOrder && (
        <div
          onClick={() => onTrackOrder(activeOrder.id)}
          className="bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-amber-500/40 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md animate-pulse">
              🛵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Live Delivery in Progress
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {activeOrder.restaurantName} • {activeOrder.status.replace(/_/g, ' ')}
              </h3>
              <p className="text-[11px] text-slate-300">
                OTP: <strong className="text-amber-400 tracking-wider">{activeOrder.otp}</strong> • ETA: {activeOrder.estimatedDeliveryMinutes} mins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-extrabold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span className="hidden sm:inline">Track Live Road Map</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative rounded-3xl bg-linear-to-tr from-amber-600 via-orange-500 to-amber-500 text-white p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Fast Food • Live Tracking • Smart Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {state.language === 'bn'
              ? 'মুহূর্তেই আপনার পছন্দের খাবার ঘরে পৌঁছে যাবে ⚡'
              : 'Craving delicious food delivered with live road GPS? ⚡'}
          </h1>

          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            {state.language === 'bn'
              ? 'ঢাকার সেরা সুলতান্স ডাইন কাচ্চি, চিলক্স জুসি বার্গার ও ঐতিহ্যবাহী স্টার কাবাব সহ শতাধিক রেস্তোরাঁ।'
              : 'Authentic Basmati Kacchi Biryani, extreme spicy Naga burgers, and sizzling mutton chaap across Dhaka.'}
          </p>

          {/* Location Bar & Search Bar inside Hero */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 bg-white rounded-2xl p-2 flex items-center gap-2 shadow-lg">
              <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-700 mr-2"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={onOpenPoints}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>{state.customer.points} Pts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">{t.allCategories}</h2>
          <span className="text-xs text-slate-400 font-medium">Quick Discovery</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>🍽️</span>
            <span>All</span>
          </button>

          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{state.language === 'bn' ? cat.nameBn : cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Sort Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterOnlyOpen(!filterOnlyOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
              filterOnlyOpen
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            ● {t.openNow}
          </button>
          <button
            onClick={() => setFilterRating4Plus(!filterRating4Plus)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
              filterRating4Plus
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            ★ 4.7+ Rating
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700"
          >
            <option value="rating">Top Rated</option>
            <option value="prepTime">Fastest Delivery</option>
            <option value="deliveryFee">Lowest Fee</option>
          </select>
        </div>
      </div>

      {/* Restaurant Discovery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {t.popularNearby} ({sortedRestaurants.length})
          </h2>
          <span className="text-xs text-slate-500">Dhaka Region (Dhanmondi, Banani, Gulshan)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRestaurants.map((res) => (
            <div
              key={res.id}
              onClick={() => onSelectRestaurant(res.id)}
              className="group bg-white rounded-3xl border border-slate-200/80 hover:border-amber-500/50 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
            >
              {/* Cover Image & Badges */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={res.coverImage}
                  alt={res.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                {/* Offer Badge */}
                {res.offerBadge && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {res.offerBadge}
                  </span>
                )}

                {/* Rating Badge */}
                <span className="absolute top-3 right-3 bg-white/95 text-slate-900 text-xs font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 backdrop-blur-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {res.rating}
                </span>

                {/* Restaurant Logo Overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <img
                    src={res.logo}
                    alt={res.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
                  />
                  <div className="text-white drop-shadow-md">
                    <div className="flex items-center gap-1">
                      <h3 className="font-extrabold text-base leading-tight">
                        {state.language === 'bn' ? res.nameBn : res.name}
                      </h3>
                      {res.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-200">{res.cuisine.slice(0, 2).join(' • ')}</span>
                  </div>
                </div>
              </div>

              {/* Card Meta Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-500 line-clamp-1">{res.tagline}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{res.estimatedPrepTime} {t.deliveryTime}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5 text-emerald-600" />
                    <span>৳{res.deliveryFee} fee</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-slate-800">
                    Min ৳{res.minOrder}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Foods Carousel */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {t.recommendedFoods}
            </h2>
          </div>
          <span className="text-xs text-amber-700 font-bold">Top Picks for You</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedFoods.map((food) => (
            <div
              key={food.id}
              onClick={() => onSelectFood(food)}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex items-center gap-4 cursor-pointer group"
            >
              <img
                src={food.photos[0]}
                alt={food.name}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-amber-700 uppercase">
                  {state.restaurants.find((r) => r.id === food.restaurantId)?.name}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 truncate">
                  {state.language === 'bn' ? food.nameBn : food.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {food.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">
                    ৳{food.discountPrice || food.price}
                  </span>
                  <span className="bg-amber-50 group-hover:bg-amber-500 group-hover:text-white text-amber-800 text-xs font-bold px-2.5 py-1 rounded-xl transition-colors">
                    + Add
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
