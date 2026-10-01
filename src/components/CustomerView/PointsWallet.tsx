import React from 'react';
import { X, Award, Gift, Sparkles, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { AppState } from '../../services/store';

interface PointsWalletProps {
  state: AppState;
  onClose: () => void;
  onOpenCart: () => void;
}

export const PointsWallet: React.FC<PointsWalletProps> = ({ state, onClose, onOpenCart }) => {
  const customer = state.customer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-white/10 text-9xl font-black select-none pointer-events-none">
            ★
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Wafa Rewards Club</span>
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-4xl sm:text-5xl font-black tracking-tight">{customer.points}</span>
              <span className="ml-2 text-sm font-bold text-amber-100">Reward Points</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-white/30">
              👑 {customer.tier.toUpperCase()} Member
            </div>
          </div>

          <p className="text-xs text-amber-100 mt-2">
            1 Point = ৳1.00 BDT instant discount on your food checkout!
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">
          {/* How to Earn Points */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              How to Earn Wafa Points
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-lg">🍽️</span>
                <h5 className="font-extrabold text-slate-900 mt-1">Complete Orders</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Earn 5% of order value back in reward points.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-lg">⭐</span>
                <h5 className="font-extrabold text-slate-900 mt-1">Leave Reviews</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Earn 10 points for rating completed food parcels.
                </p>
              </div>
            </div>
          </div>

          {/* Tier Milestones */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span>Gold Tier Benefits</span>
              <span>Next: Platinum (1,000 Pts)</span>
            </div>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-amber-500/30">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (customer.points / 1000) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-800">
              You get priority rider dispatch and free delivery on weekend deals!
            </p>
          </div>

          {/* Points History Ledger */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Points Ledger
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Delivered Order Bonus</div>
                  <div className="text-[10px] text-slate-400">Order #WQE-ORD-2026-0041 • Sultan's Dine</div>
                </div>
                <span className="font-extrabold text-emerald-600">+25 Pts</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Checkout Discount Redeemed</div>
                  <div className="text-[10px] text-slate-400">Order #WQE-ORD-2026-0042</div>
                </div>
                <span className="font-extrabold text-rose-600">-20 Pts</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Welcome Signup Bonus</div>
                  <div className="text-[10px] text-slate-400">Account Verified • Wafa Zone</div>
                </div>
                <span className="font-extrabold text-emerald-600">+50 Pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Use in Cart anytime</span>
          <button
            onClick={() => {
              onClose();
              onOpenCart();
            }}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <span>Go to Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
