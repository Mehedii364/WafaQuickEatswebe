import React from 'react';
import { X, Bell, CheckCircle2, Award, Bike, AlertCircle } from 'lucide-react';
import { AppState, store } from '../services/store';

interface NotificationsModalProps {
  state: AppState;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  state,
  onClose,
  onTrackOrder
}) => {
  const notifications = state.notifications;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-base text-slate-900">Notifications</h2>
            <span className="text-xs text-slate-400">({notifications.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No new notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  store.markNotificationAsRead(n.id);
                  if (n.deepLink === 'track-order' && state.activeDeliveryId) {
                    onTrackOrder(state.activeDeliveryId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                  n.isRead
                    ? 'bg-white border-slate-200/80 text-slate-700'
                    : 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
