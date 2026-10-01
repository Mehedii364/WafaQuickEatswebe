import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Crosshair,
  Home,
  Briefcase,
  Navigation,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import L from 'leaflet';
import { SavedAddress, Order } from '../../types';
import { store, AppState } from '../../services/store';
import { getTranslation } from '../../i18n/translations';

interface CheckoutModalProps {
  state: AppState;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  state,
  onClose,
  onOrderPlaced
}) => {
  const t = getTranslation(state.language);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const defaultAddr = state.customer.savedAddresses[0] || {
    id: 'addr-custom',
    label: 'Home' as const,
    fullAddress: 'Road 7A, Dhanmondi R/A, Dhaka',
    building: 'Green Heritage',
    floor: '4th Floor',
    flat: '4B',
    landmark: 'Ibn Sina Hospital',
    lat: 23.7460,
    lng: 90.3755,
    deliveryInstructions: 'Ring doorbell twice'
  };

  const [selectedAddress, setSelectedAddress] = useState<SavedAddress>(defaultAddr);
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [fullAddress, setFullAddress] = useState(defaultAddr.fullAddress);
  const [building, setBuilding] = useState(defaultAddr.building || '');
  const [floor, setFloor] = useState(defaultAddr.floor || '');
  const [flat, setFlat] = useState(defaultAddr.flat || '');
  const [landmark, setLandmark] = useState(defaultAddr.landmark || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState(defaultAddr.deliveryInstructions || '');
  const [lat, setLat] = useState(defaultAddr.lat);
  const [lng, setLng] = useState(defaultAddr.lng);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket' | 'card'>('bkash');
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Leaflet Map with Draggable Pin
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([lat, lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Custom Delivery Pin Icon
      const pinIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color:#f59e0b; width:34px; height:34px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 15px -3px rgba(0,0,0,0.3); font-size:18px;">📍</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34]
      });

      const marker = L.marker([lat, lng], {
        icon: pinIcon,
        draggable: true
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setLat(Number(pos.lat.toFixed(5)));
        setLng(Number(pos.lng.toFixed(5)));
        setFullAddress(`Near Lat: ${pos.lat.toFixed(4)}, Lng: ${pos.lng.toFixed(4)}, Dhanmondi, Dhaka`);
      });

      leafletMapRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        setLat(Number(newLat.toFixed(5)));
        setLng(Number(newLng.toFixed(5)));
        setFullAddress(`GPS Location (${newLat.toFixed(4)}, ${newLng.toFixed(4)})`);

        if (leafletMapRef.current && markerRef.current) {
          leafletMapRef.current.setView([newLat, newLng], 16);
          markerRef.current.setLatLng([newLat, newLng]);
        }
      },
      (err) => {
        setIsLocating(false);
        setErrorMsg('Unable to retrieve GPS. Using selected Dhaka coordinates.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddress(addr);
    setAddressLabel(addr.label);
    setFullAddress(addr.fullAddress);
    setBuilding(addr.building || '');
    setFloor(addr.floor || '');
    setFlat(addr.flat || '');
    setLandmark(addr.landmark || '');
    setDeliveryInstructions(addr.deliveryInstructions || '');
    setLat(addr.lat);
    setLng(addr.lng);

    if (leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.setView([addr.lat, addr.lng], 16);
      markerRef.current.setLatLng([addr.lat, addr.lng]);
    }
  };

  const handleConfirmOrder = () => {
    if (!fullAddress.trim()) {
      setErrorMsg('Please enter a delivery address');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const order = store.placeOrder({
        deliveryAddress: {
          id: `addr-${Date.now()}`,
          label: addressLabel,
          fullAddress,
          building,
          floor,
          flat,
          landmark,
          lat,
          lng,
          deliveryInstructions
        },
        paymentMethod
      });

      setIsSubmitting(false);
      onOrderPlaced(order);
      onClose();
    } catch (e: any) {
      setIsSubmitting(false);
      setErrorMsg(e.message || 'Failed to place order');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Checkout & Delivery Location</h2>
              <p className="text-[11px] text-slate-500">Live GPS Pin & Secure Payment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Map & GPS Pin */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Delivery Pin Location (Drag to adjust)</span>
              </label>
              <button
                type="button"
                onClick={handleUseCurrentGPS}
                disabled={isLocating}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-xl transition-colors"
              >
                {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
                <span>{t.currentLocation}</span>
              </button>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
              <div ref={mapContainerRef} className="w-full h-full" />
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-700 shadow-xs z-1000">
                Lat: {lat} • Lng: {lng}
              </div>
            </div>
          </div>

          {/* Section 2: Saved Locations Quick Pick */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved Addresses
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {state.customer.savedAddresses.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => handleSelectSavedAddress(addr)}
                  className={`p-2.5 rounded-2xl border text-left text-xs transition-all ${
                    selectedAddress?.id === addr.id
                      ? 'border-amber-500 bg-amber-50/50 text-amber-900 shadow-xs font-bold'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {addr.label === 'Home' ? <Home className="w-3.5 h-3.5 text-amber-600" /> : <Briefcase className="w-3.5 h-3.5 text-indigo-600" />}
                    <span>{addr.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{addr.fullAddress}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Detailed Address Fields */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Street Address
              </label>
              <input
                type="text"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="House, Road, Area, Dhaka"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Building</label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="e.g. Green Tower"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Floor</label>
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="e.g. 4th Floor"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Flat / Unit</label>
                <input
                  type="text"
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                  placeholder="e.g. 4B"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Nearest Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near City College / Mosque"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Rider Note</label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Call before coming"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Payment Method Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {t.paymentMethod}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-500 bg-pink-50/50 text-pink-950 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-pink-600 text-white flex items-center justify-center font-bold text-[10px]">
                    ব
                  </span>
                  <span>{t.bkash}</span>
                </div>
                {paymentMethod === 'bkash' && <CheckCircle2 className="w-4 h-4 text-pink-600" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-[10px]">
                    ন
                  </span>
                  <span>{t.nagad}</span>
                </div>
                {paymentMethod === 'nagad' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    ৳
                  </span>
                  <span>{t.cod}</span>
                </div>
                {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>{t.card}</span>
                </div>
                {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
            className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black py-3.5 px-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>{t.placeOrder} ⚡</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
