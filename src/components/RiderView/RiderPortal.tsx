import React, { useState } from 'react';
import {
  Bike,
  Navigation,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  AlertTriangle,
  FileText,
  DollarSign,
  Award,
  KeyRound,
  RotateCcw,
  Plus,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Rider, Order, RiderNote, DeliveryIncident } from '../../types';
import { store, AppState } from '../../services/store';
import { getTranslation } from '../../i18n/translations';

interface RiderPortalProps {
  state: AppState;
}

export const RiderPortal: React.FC<RiderPortalProps> = ({ state }) => {
  const t = getTranslation(state.language);
  const rider = state.riders[0]; // Tanvir Ahmed by default
  const activeOrder = state.orders.find((o) => o.riderId === rider.id && o.status !== 'delivered');
  const myCompletedOrders = state.orders.filter((o) => o.riderId === rider.id && o.status === 'delivered');

  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isReportingIncident, setIsReportingIncident] = useState(false);

  // New Note State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState<RiderNote['category']>('Heavy Traffic');
  const [notePriority, setNotePriority] = useState<RiderNote['priority']>('medium');
  const [noteDetails, setNoteDetails] = useState('');
  const [noteVisibility, setNoteVisibility] = useState<RiderNote['visibility']>('customer_visible');

  // Incident State
  const [incidentType, setIncidentType] = useState<DeliveryIncident['incidentType']>('Road Blocked');
  const [incidentDesc, setIncidentDesc] = useState('');

  const handleToggleOnline = () => {
    store.setRiderOnline(rider.id, !rider.isOnline);
  };

  const handleUpdateDeliveryStep = (status: Order['status'], note?: string) => {
    if (!activeOrder) return;
    store.updateOrderStatus(activeOrder.id, status, note, rider.id);
  };

  const handleVerifyOtpAndComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    if (enteredOtp.trim() !== activeOrder.otp) {
      setOtpError('Invalid OTP! Ask the customer for their 4-digit security OTP.');
      return;
    }

    setOtpError('');
    store.updateOrderStatus(activeOrder.id, 'delivered', `Verified via OTP ${enteredOtp}`, rider.id);
    setEnteredOtp('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !noteTitle.trim()) return;

    store.addRiderNote({
      orderId: activeOrder.id,
      riderId: rider.id,
      riderName: rider.name,
      title: noteTitle.trim(),
      details: noteDetails.trim() || 'Log from rider mobile device.',
      category: noteCategory,
      priority: notePriority,
      visibility: noteVisibility,
      lat: rider.currentLat,
      lng: rider.currentLng
    });

    setIsAddingNote(false);
    setNoteTitle('');
    setNoteDetails('');
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !incidentDesc.trim()) return;

    store.addIncident({
      orderId: activeOrder.id,
      riderId: rider.id,
      riderName: rider.name,
      incidentType,
      description: incidentDesc.trim(),
      lat: rider.currentLat,
      lng: rider.currentLng
    });

    setIsReportingIncident(false);
    setIncidentDesc('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
      {/* Rider Header Profile Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={rider.avatar}
            alt={rider.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{rider.name}</h1>
              {rider.status === 'verified' && (
                <ShieldCheck className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
              )}
            </div>
            <p className="text-xs text-slate-500">
              {rider.vehicleType} • {rider.vehiclePlate}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">ID: {rider.id}</span>
          </div>
        </div>

        {/* Online / Offline Toggle Button */}
        <button
          onClick={handleToggleOnline}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-md active:scale-95 ${
            rider.isOnline
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${rider.isOnline ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
          <span>{rider.isOnline ? 'ONLINE & READY' : 'OFFLINE'}</span>
        </button>
      </div>

      {/* Rider KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Today's Pay</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">৳{rider.todayEarnings}</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Deliveries</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 mt-1 block">{rider.totalDeliveries}</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Rider Rating</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 block">★ {rider.rating}</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Reward Points</span>
          <span className="text-xl sm:text-2xl font-black text-indigo-600 mt-1 block">{rider.points} Pts</span>
        </div>
      </div>

      {/* Active Delivery Card */}
      {activeOrder ? (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-500 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Active Delivery in Progress
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Order #{activeOrder.id} • {activeOrder.restaurantName}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-900 block">৳{activeOrder.grandTotal}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">{activeOrder.paymentMethod}</span>
            </div>
          </div>

          {/* Pickup and Delivery Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 font-bold text-amber-700 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>1. Pickup From Kitchen</span>
              </div>
              <p className="font-extrabold text-slate-900">{activeOrder.restaurantName}</p>
              <p className="text-slate-600 mt-0.5">{activeOrder.restaurantAddress}</p>
              <a href={`tel:${activeOrder.restaurantPhone}`} className="text-amber-600 font-bold mt-1 inline-block">
                📞 Call Kitchen: {activeOrder.restaurantPhone}
              </a>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>2. Deliver to Customer</span>
              </div>
              <p className="font-extrabold text-slate-900">{activeOrder.customerName}</p>
              <p className="text-slate-600 mt-0.5">{activeOrder.deliveryAddress.fullAddress}</p>
              {activeOrder.deliveryAddress.deliveryInstructions && (
                <p className="text-[11px] text-amber-800 italic mt-0.5">
                  Note: {activeOrder.deliveryAddress.deliveryInstructions}
                </p>
              )}
              <a href={`tel:${activeOrder.customerPhone}`} className="text-emerald-700 font-bold mt-1 inline-block">
                📞 Call Customer: {activeOrder.customerPhone}
              </a>
            </div>
          </div>

          {/* Stepper Actions for Rider */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Delivery Mission Actions
            </h4>

            <div className="flex flex-wrap items-center gap-2">
              {activeOrder.status === 'ready_for_pickup' && (
                <button
                  onClick={() => handleUpdateDeliveryStep('pickup_completed', 'Rider checked thermal food parcel')}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md"
                >
                  ✓ Confirm Food Pickup
                </button>
              )}

              {activeOrder.status === 'pickup_completed' && (
                <button
                  onClick={() => handleUpdateDeliveryStep('on_the_way', 'Rider en-route with live GPS')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-md"
                >
                  ⚡ Start Delivery (GPS Live ON)
                </button>
              )}

              {activeOrder.status === 'on_the_way' && (
                <button
                  onClick={() => handleUpdateDeliveryStep('arrived', 'Rider arrived at customer entrance')}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md"
                >
                  📍 I Have Arrived at Door
                </button>
              )}
            </div>

            {/* OTP Verification Box */}
            <form onSubmit={handleVerifyOtpAndComplete} className="pt-3 border-t border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Enter Customer's 4-Digit OTP to Complete Delivery</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="e.g. 7392"
                  className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-center text-sm font-black tracking-widest text-slate-900 w-36 focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={enteredOtp.length < 4}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black px-5 py-2 rounded-xl shadow-md transition-colors"
                >
                  Verify & Deliver
                </button>
              </div>
              {otpError && <p className="text-[11px] text-rose-600 font-bold">{otpError}</p>}
            </form>
          </div>

          {/* Quick Buttons: Add Note & Report Incident */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setIsAddingNote(true)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ Add Rider Note</span>
            </button>
            <button
              onClick={() => setIsReportingIncident(true)}
              className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-rose-200 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Road Issue</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
          <Bike className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-base text-slate-800">No Active Delivery Assignment</h3>
          <p className="text-xs text-slate-500">
            {rider.isOnline
              ? 'You are online and waiting for next dispatch around Dhanmondi / Satmasjid.'
              : 'Turn your status ONLINE to receive incoming delivery requests.'}
          </p>
        </div>
      )}

      {/* Modal: Add Rider Note */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleAddNote} className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Add Live Rider Note</h3>
              <button type="button" onClick={() => setIsAddingNote(false)} className="text-slate-400">✕</button>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Note Title</label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="e.g. Traffic slowdown at Dhanmondi 27"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="Heavy Traffic">Heavy Traffic</option>
                  <option value="Customer Not Answering">Customer Not Answering</option>
                  <option value="Location">Location Finding</option>
                  <option value="Restaurant Delay">Restaurant Delay</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Visibility</label>
                <select
                  value={noteVisibility}
                  onChange={(e) => setNoteVisibility(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="customer_visible">Visible to Customer</option>
                  <option value="admin_only">Admin Only (Internal)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Details</label>
              <textarea
                rows={2}
                value={noteDetails}
                onChange={(e) => setNoteDetails(e.target.value)}
                placeholder="Explain the situation briefly..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNote(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl shadow-md"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Report Incident */}
      {isReportingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleReportIncident} className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5" />
                <span>Report Delivery Incident</span>
              </h3>
              <button type="button" onClick={() => setIsReportingIncident(false)} className="text-slate-400">✕</button>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Incident Type</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
              >
                <option value="Road Blocked">Road Blocked / Detour</option>
                <option value="Customer Unavailable">Customer Unavailable</option>
                <option value="Vehicle Breakdown">Vehicle Breakdown</option>
                <option value="Restaurant Delay">Restaurant Delay</option>
                <option value="Delivery Failure">Delivery Failure</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Description & Location</label>
              <textarea
                rows={3}
                value={incidentDesc}
                onChange={(e) => setIncidentDesc(e.target.value)}
                placeholder="Explain the barrier or breakdown..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsReportingIncident(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black py-2.5 rounded-xl shadow-md"
              >
                Send Incident to Dispatch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
