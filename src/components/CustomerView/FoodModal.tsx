import React, { useState } from 'react';
import { X, Plus, Minus, Clock, Heart, ShoppingBag, Check } from 'lucide-react';
import { FoodItem, FoodVariant, FoodAddon } from '../../types';
import { store, AppState } from '../../services/store';
import { getTranslation } from '../../i18n/translations';

interface FoodModalProps {
  food: FoodItem;
  state: AppState;
  onClose: () => void;
  onAddedToCart: () => void;
}

export const FoodModal: React.FC<FoodModalProps> = ({
  food,
  state,
  onClose,
  onAddedToCart
}) => {
  const t = getTranslation(state.language);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<FoodVariant | undefined>(
    food.variants && food.variants.length > 0 ? food.variants[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<FoodAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const basePrice = food.discountPrice || food.price;
  const variantExtra = selectedVariant ? selectedVariant.priceDelta : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitTotal = basePrice + variantExtra + addonsTotal;
  const grandItemTotal = unitTotal * quantity;

  const toggleAddon = (addon: FoodAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    store.addToCart({
      foodItem: food,
      quantity,
      selectedVariant,
      selectedAddons,
      specialInstructions: specialInstructions.trim() || undefined
    });
    onAddedToCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header / Image Gallery */}
        <div className="relative h-64 sm:h-72 bg-slate-900 shrink-0">
          <img
            src={food.photos[selectedPhotoIndex] || food.photos[0]}
            alt={food.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Close & Favorite Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md shadow-md transition-transform active:scale-90"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md shadow-md transition-transform active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Photo Thumbnails if multiple photos */}
          {food.photos.length > 1 && (
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 overflow-x-auto pb-1">
              {food.photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedPhotoIndex === idx
                      ? 'border-amber-500 scale-105 shadow-md'
                      : 'border-white/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Title & Price */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{food.preparationTime} mins prep time</span>
              {food.isPopular && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ★ Bestseller
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {state.language === 'bn' ? food.nameBn : food.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {state.language === 'bn' ? food.descriptionBn : food.description}
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">৳{unitTotal}</span>
              {food.discountPrice && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  ৳{food.price + variantExtra + addonsTotal}
                </span>
              )}
            </div>
          </div>

          {/* Variants Selector */}
          {food.variants && food.variants.length > 0 && (
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose Portion / Variant
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {food.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-amber-500 bg-amber-50/60 text-amber-900 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{state.language === 'bn' ? v.nameBn || v.name : v.name}</span>
                    <span className="text-slate-500 font-bold">
                      {v.priceDelta > 0 ? `+৳${v.priceDelta}` : 'Default'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons Selector */}
          {food.addons && food.addons.length > 0 && (
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recommended Add-ons
              </label>
              <div className="space-y-2">
                {food.addons.map((a) => {
                  const isChecked = selectedAddons.some((addon) => addon.id === a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleAddon(a)}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer text-xs font-semibold transition-all ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50/40 text-amber-900'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span>{state.language === 'bn' ? a.nameBn || a.name : a.name}</span>
                      </div>
                      <span className="text-slate-600 font-bold">+৳{a.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Special Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="E.g. Less spicy, keep sauce separate, allergy notes..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-sm text-slate-900 w-5 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-slate-500 hover:text-slate-800"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </div>
            <span className="text-base font-black">৳{grandItemTotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
