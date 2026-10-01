import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  Award,
  ArrowRight,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import { store, AppState } from '../../services/store';
import { getTranslation } from '../../i18n/translations';

interface CartDrawerProps {
  state: AppState;
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  state,
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const t = getTranslation(state.language);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = store.getCartSubtotal();
  const restaurant = state.cart.length > 0
    ? state.restaurants.find((r) => r.id === state.cart[0].foodItem.restaurantId)
    : null;

  let discount = 0;
  if (state.appliedCoupon) {
    if (state.appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * state.appliedCoupon.discountValue) / 100;
      if (state.appliedCoupon.maxDiscount) {
        discount = Math.min(discount, state.appliedCoupon.maxDiscount);
      }
    } else {
      discount = state.appliedCoupon.discountValue;
    }
  }

  const pointsDiscount = state.pointsToRedeem * 1;
  const deliveryFee = restaurant ? restaurant.deliveryFee : 40;
  const serviceFee = 15;
  const taxVat = Math.round(subtotal * 0.05);
  const grandTotal = Math.max(0, subtotal - discount - pointsDiscount + deliveryFee + serviceFee + taxVat);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const res = store.applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900">{t.cartTitle}</h2>
              {restaurant && (
                <p className="text-[11px] text-slate-500">
                  From: <strong className="text-slate-700">{restaurant.name}</strong>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {state.cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-3xl mb-3">
              🍲
            </div>
            <h3 className="font-extrabold text-lg text-slate-800">{t.emptyCart}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Explore Dhaka's finest Kacchi Biryani, Smash Burgers, and Sizzling Chaap.
            </p>
            <button
              onClick={onClose}
              className="mt-5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-2xl text-xs transition-colors shadow-md shadow-amber-500/20"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Cart Items List */}
            <div className="space-y-3">
              {state.cart.map((item, idx) => {
                const base = item.foodItem.discountPrice || item.foodItem.price;
                const variantDelta = item.selectedVariant ? item.selectedVariant.priceDelta : 0;
                const addonsSum = (item.selectedAddons || []).reduce((a, b) => a + b.price, 0);
                const itemUnit = base + variantDelta + addonsSum;

                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-slate-900 truncate">
                        {state.language === 'bn' ? item.foodItem.nameBn : item.foodItem.name}
                      </h4>
                      {item.selectedVariant && (
                        <p className="text-[10px] text-slate-500">
                          Portion: {item.selectedVariant.name}
                        </p>
                      )}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-slate-500 truncate">
                          Addons: {item.selectedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      <div className="text-amber-600 font-extrabold mt-1">
                        ৳{itemUnit * item.quantity}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => store.updateCartQuantity(idx, item.quantity - 1)}
                        className="p-1 text-slate-500 hover:text-slate-800"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-500" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="font-extrabold text-xs text-slate-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => store.updateCartQuantity(idx, item.quantity + 1)}
                        className="p-1 text-slate-500 hover:text-slate-800"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupons Section */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Promo Coupon</span>
                </span>
                {state.appliedCoupon && (
                  <button
                    onClick={() => store.removeCoupon()}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {state.appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-xs text-emerald-800 flex items-center justify-between">
                  <div>
                    <strong className="font-extrabold">{state.appliedCoupon.code}</strong> applied!
                  </div>
                  <span className="font-bold text-emerald-700">-৳{discount}</span>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. WAFA50)"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 uppercase focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[10px] text-rose-600 font-semibold">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-emerald-600 font-semibold">{couponSuccess}</p>}
            </div>

            {/* Loyalty Points Redemption */}
            {state.customer.points > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Redeem Wafa Points</span>
                  </span>
                  <span>Balance: {state.customer.points} Pts</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max={Math.min(state.customer.points, Math.floor(subtotal * 0.2))}
                    value={state.pointsToRedeem}
                    onChange={(e) => store.setPointsToRedeem(Number(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <span className="font-black text-amber-900 shrink-0">
                    ৳{state.pointsToRedeem} off
                  </span>
                </div>
              </div>
            )}

            {/* Bill Summary Breakdown */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span className="font-bold text-slate-900">৳{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t.discount} ({state.appliedCoupon?.code})</span>
                  <span>-৳{discount}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>{t.pointsDiscount}</span>
                  <span>-৳{pointsDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>{t.deliveryFee}</span>
                <span className="font-bold text-slate-900">৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t.serviceFee}</span>
                <span className="font-bold text-slate-900">৳{serviceFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t.taxVat} (5%)</span>
                <span className="font-bold text-slate-900">৳{taxVat}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-950">
                <span>{t.totalAmount}</span>
                <span className="text-base text-amber-600">৳{grandTotal}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Checkout Action */}
        {state.cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white">
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 px-4 rounded-2xl flex items-center justify-between shadow-xl shadow-amber-500/20 active:scale-98 transition-all"
            >
              <span>{t.checkoutButton}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg">৳{grandTotal}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
