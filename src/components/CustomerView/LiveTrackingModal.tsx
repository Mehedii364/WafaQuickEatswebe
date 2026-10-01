import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Bike,
  Store,
  MapPin,
  Clock,
  Compass,
  Gauge,
  Phone,
  ShieldCheck,
  FileText,
  AlertTriangle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import L from 'leaflet';
import { Order, OrderStatus } from '../../types';
import { store, AppState } from '../../services/store';
import { fetchRoadRoute } from '../../services/osrm';
import { getTranslation } from '../../i18n/translations';

interface LiveTrackingModalProps {
  order: Order;
  state: AppState;
  onClose: () => void;
  onOpenInvoice: () => void;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
  order,
  state,
  onClose,
  onOpenInvoice
}) => {
  const t = getTranslation(state.language);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);

  // Active rider associated with order
  const rider = state.riders.find((r) => r.id === order.riderId) || state.riders[0];

  const [speed, setSpeed] = useState(rider.speed || 24);
  const [bearing, setBearing] = useState(rider.bearing || 120);
  const [accuracy, setAccuracy] = useState(rider.accuracy || 3);
  const [lastUpdate, setLastUpdate] = useState(rider.lastGpsUpdate || new Date().toISOString());
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; etaMins: number }>({
    distanceKm: order.distanceKm || 1.8,
    etaMins: order.estimatedDeliveryMinutes || 12
  });
  const [isSimulatingMove, setIsSimulatingMove] = useState(false);

  // Initialize Map with Restaurant, Customer, and Rider markers + OSRM road line
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const customerPos: [number, number] = [order.deliveryAddress.lat, order.deliveryAddress.lng];
      const restaurantPos: [number, number] = [order.restaurantLat, order.restaurantLng];
      const riderPos: [number, number] = [rider.currentLat, rider.currentLng];

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(riderPos, 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // 1. Restaurant Pin Icon
      const restaurantIcon = L.divIcon({
        className: 'marker-res',
        html: `<div style="background-color:#0f172a; color:#f59e0b; width:34px; height:34px; border-radius:12px; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); font-size:16px;">🏪</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
      L.marker(restaurantPos, { icon: restaurantIcon })
        .addTo(map)
        .bindPopup(`<strong>${order.restaurantName}</strong><br/>Pickup Hub`);

      // 2. Customer Pin Icon
      const customerIcon = L.divIcon({
        className: 'marker-cus',
        html: `<div style="background-color:#10b981; color:white; width:34px; height:34px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); font-size:16px;">📍</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34]
      });
      L.marker(customerPos, { icon: customerIcon })
        .addTo(map)
        .bindPopup(`<strong>Delivery Destination</strong><br/>${order.deliveryAddress.fullAddress}`);

      // 3. Live Rider Pin Icon
      const riderIcon = L.divIcon({
        className: 'marker-rider',
        html: `<div style="background-color:#f59e0b; color:#0f172a; width:38px; height:38px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 15px -3px rgba(245,158,11,0.5); font-size:18px; transform:rotate(${bearing}deg); transition:all 0.4s ease;">🛵</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });
      const rMarker = L.marker(riderPos, { icon: riderIcon }).addTo(map);
      riderMarkerRef.current = rMarker;

      // Fit bounds to enclose all 3 points
      const bounds = L.latLngBounds([customerPos, restaurantPos, riderPos]);
      map.fitBounds(bounds, { padding: [50, 50] });

      // Fetch Real Road Route Geometry from OSRM
      fetchRoadRoute(riderPos[0], riderPos[1], customerPos[0], customerPos[1]).then((route) => {
        if (route.coordinates.length > 0) {
          const polyline = L.polyline(route.coordinates, {
            color: '#f59e0b',
            weight: 5,
            opacity: 0.85,
            dashArray: '8, 8',
            lineJoin: 'round'
          }).addTo(map);
          routePolylineRef.current = polyline;

          setRouteInfo({
            distanceKm: Number((route.distanceMeters / 1000).toFixed(1)),
            etaMins: Math.max(3, Math.round(route.durationSeconds / 60))
          });
        }
      });

      leafletMapRef.current = map;
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [order.id]);

  // Real-time GPS movement step simulation if active
  const handleSimulateGPSMove = () => {
    if (!leafletMapRef.current || !riderMarkerRef.current) return;
    setIsSimulatingMove(true);

    const stepLat = (order.deliveryAddress.lat - rider.currentLat) * 0.2;
    const stepLng = (order.deliveryAddress.lng - rider.currentLng) * 0.2;

    const newLat = Number((rider.currentLat + stepLat).toFixed(5));
    const newLng = Number((rider.currentLng + stepLng).toFixed(5));
    const newSpeed = Math.floor(22 + Math.random() * 12);
    const newBearing = Math.floor(80 + Math.random() * 60);

    store.updateRiderGPS(rider.id, newLat, newLng, newSpeed, newBearing);
    setSpeed(newSpeed);
    setBearing(newBearing);
    setLastUpdate(new Date().toISOString());

    riderMarkerRef.current.setLatLng([newLat, newLng]);

    // Re-fetch remaining road distance
    fetchRoadRoute(newLat, newLng, order.deliveryAddress.lat, order.deliveryAddress.lng).then((r) => {
      setRouteInfo({
        distanceKm: Number((r.distanceMeters / 1000).toFixed(1)),
        etaMins: Math.max(2, Math.round(r.durationSeconds / 60))
      });
      if (routePolylineRef.current) {
        routePolylineRef.current.setLatLngs(r.coordinates);
      }
      setIsSimulatingMove(false);
    });
  };

  const getStatusStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'placed':
        return 1;
      case 'restaurant_accepted':
      case 'preparing':
        return 2;
      case 'ready_for_pickup':
      case 'rider_assigned':
      case 'rider_accepted':
      case 'pickup_completed':
        return 3;
      case 'on_the_way':
        return 4;
      case 'arrived':
        return 5;
      case 'delivered':
        return 6;
      default:
        return 1;
    }
  };

  const currentStep = getStatusStepIndex(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base text-slate-900">{t.liveTrackingTitle}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 uppercase">
                  Live GPS
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Order #{order.id} • {order.restaurantName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenInvoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">{t.viewInvoice}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Interactive Leaflet Road Route Map */}
          <div className="relative h-64 sm:h-72 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Live GPS Telemetry Floating Overlay */}
            <div className="absolute top-3 left-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-2 rounded-2xl text-[11px] shadow-lg flex items-center gap-3 z-1000">
              <div className="flex items-center gap-1 font-bold text-amber-400">
                <Gauge className="w-3.5 h-3.5" />
                <span>{speed} km/h</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>{bearing}°</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>±{accuracy}m</span>
              </div>
            </div>

            {/* Test GPS Movement Button */}
            <button
              onClick={handleSimulateGPSMove}
              disabled={isSimulatingMove || order.status === 'delivered'}
              className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur-xs flex items-center gap-1.5 transition-all active:scale-95 z-1000"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSimulatingMove ? 'animate-spin' : ''}`} />
              <span>Broadcast GPS Ping</span>
            </button>
          </div>

          {/* Key Metrics: ETA, Distance, OTP */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200/80 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                {t.estimatedTime}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-950 mt-0.5 block">
                {routeInfo.etaMins} mins
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                {t.remainingDistance}
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block">
                {routeInfo.distanceKm} km
              </span>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200/80 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                {t.deliveryOtp}
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-950 tracking-widest mt-0.5 block">
                {order.otp}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Delivery Status</span>
              <span className="text-amber-600 font-extrabold capitalize">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Visual Step Dots */}
            <div className="relative flex items-center justify-between">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${Math.min(100, ((currentStep - 1) / 5) * 100)}%` }}
              />

              {[
                { label: 'Placed', step: 1 },
                { label: 'Kitchen', step: 2 },
                { label: 'Rider Picked', step: 3 },
                { label: 'On Road', step: 4 },
                { label: 'Arrived', step: 5 },
                { label: 'Delivered', step: 6 }
              ].map((s) => (
                <div key={s.step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      currentStep >= s.step
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {currentStep > s.step ? '✓' : s.step}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 font-semibold hidden sm:block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rider Profile & Contact Card */}
          {rider && (
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rider.avatar}
                  alt={rider.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-900">{rider.name}</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      ★ {rider.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {rider.vehicleType} • {rider.vehiclePlate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${rider.phone}`}
                  className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.callRider}</span>
                </a>
              </div>
            </div>
          )}

          {/* Order Timeline History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Order Event Log
            </h4>
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2 text-xs">
              {order.timeline.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-2.5 pb-2 border-b border-slate-100 last:border-none last:pb-0">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-slate-800 font-semibold">
                      <span className="capitalize">{entry.status.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {entry.note && <p className="text-[11px] text-slate-500 mt-0.5">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
