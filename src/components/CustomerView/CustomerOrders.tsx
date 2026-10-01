import React, { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  Clock,
  FileText,
  Navigation,
  Star,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { store, AppState } from '../../services/store';
import { getTranslation } from '../../i18n/translations';

interface CustomerOrdersProps {
  state: AppState;
  onTrackOrder: (order: Order) => void;
  onViewInvoice: (order: Order) => void;
}

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({
  state,
  onTrackOrder,
  onViewInvoice
}) => {
  const t = getTranslation(state.language);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [foodRating, setFoodRating] = useState(5);
  const [packagingRating, setPackagingRating] = useState(5);
  const [riderRating, setRiderRating] = useState(5);
  const [comment, setComment] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState(false);

  const orders = state.orders;

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingOrder) return;

    store.submitRating({
      orderId: ratingOrder.id,
      customerId: state.customer.id,
      customerName: state.customer.name,
      restaurantId: ratingOrder.restaurantId,
      riderId: ratingOrder.riderId,
      foodQualityRating: foodRating,
      packagingRating,
      preparationRating: 5,
      overallRestaurantRating: foodRating,
      riderRating,
      riderCommunicationRating: 5,
      comment: comment.trim() || 'Food was delicious and delivered on time!'
    });

    setRatingSuccess(true);
    setTimeout(() => {
      setRatingOrder(null);
      setRatingSuccess(false);
      setComment('');
    }, 1200);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', bg: 'bg-emerald-100 text-emerald-800' };
      case 'on_the_way':
        return { label: 'On The Way (GPS Live)', bg: 'bg-amber-100 text-amber-900 animate-pulse' };
      case 'preparing':
        return { label: 'Kitchen Preparing', bg: 'bg-blue-100 text-blue-800' };
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-rose-100 text-rose-800' };
      default:
        return { label: status.replace(/_/g, ' '), bg: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Order History</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track active GPS deliveries and download verified tax invoices.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-extrabold text-base text-slate-700">No Orders Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Place your first order to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const isLive = order.status !== 'delivered' && order.status !== 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-slate-900">{order.restaurantName}</h3>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      #{order.id} • {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">৳{order.grandTotal}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="text-xs text-slate-600 space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.name}
                        {item.selectedVariant ? ` (${item.selectedVariant.name})` : ''}
                      </span>
                      <span className="font-bold text-slate-800">৳{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate max-w-xs">{order.deliveryAddress.fullAddress}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Live Tracking Button */}
                    {isLive && (
                      <button
                        onClick={() => onTrackOrder(order)}
                        className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all active:scale-95"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{t.liveTrackingTitle}</span>
                      </button>
                    )}

                    {/* Rate Order Button if delivered */}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => setRatingOrder(order)}
                        className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Rate Food & Rider</span>
                      </button>
                    )}

                    {/* View Invoice Button */}
                    <button
                      onClick={() => onViewInvoice(order)}
                      className="flex items-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t.viewInvoice}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review & Rating Modal */}
      {ratingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Rate your meal from {ratingOrder.restaurantName}
                </h3>
                <p className="text-[11px] text-slate-500">Order #{ratingOrder.id}</p>
              </div>
              <button
                onClick={() => setRatingOrder(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {ratingSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-slate-900">Thank you for rating!</h4>
                <p className="text-xs text-slate-500">+10 Reward Points have been credited.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRating} className="space-y-4 text-xs">
                {/* Food Quality Stars */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Food Quality & Taste ({foodRating}/5)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFoodRating(star)}
                        className="text-xl"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= foodRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Packaging Stars */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Packaging & Heat Retention ({packagingRating}/5)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setPackagingRating(star)}
                        className="text-xl"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= packagingRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rider Behavior Stars */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Rider Professionalism & Speed ({riderRating}/5)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRiderRating(star)}
                        className="text-xl"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= riderRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Comment / Feedback</label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-2xl shadow-md transition-colors"
                >
                  Submit Review & Collect Points
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
