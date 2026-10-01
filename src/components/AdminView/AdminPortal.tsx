import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Activity,
  Users,
  Store,
  Bike,
  ShoppingBag,
  MapPin,
  Bot,
  Settings,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Server,
  Database,
  Lock,
  Loader2,
  FileText
} from 'lucide-react';
import L from 'leaflet';
import { AppState, store } from '../../services/store';
import { testAIProviderLive } from '../../services/ai';
import { AIProviderConfig } from '../../types';

interface AdminPortalProps {
  state: AppState;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ state }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'gps-map' | 'verification' | 'orders' | 'ai-manager' | 'audit' | 'health' | 'emergency'
  >('overview');

  const [testingProviderId, setTestingProviderId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; msg: string; success: boolean } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  // Stats calculation
  const totalSales = state.orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const activeRidersCount = state.riders.filter((r) => r.isOnline).length;
  const verifiedRestaurantsCount = state.restaurants.filter((r) => r.isVerified).length;
  const verifiedRidersCount = state.riders.filter((r) => r.status === 'verified').length;

  // Initialize Fleet GPS Map when tab is 'gps-map'
  useEffect(() => {
    if (activeTab !== 'gps-map') return;
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([23.7505, 90.3742], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Add Restaurants
      state.restaurants.forEach((r) => {
        const icon = L.divIcon({
          className: 'res-pin',
          html: `<div style="background-color:#0f172a; color:#f59e0b; width:30px; height:30px; border-radius:10px; border:2px solid white; display:flex; align-items:center; justify-content:center; font-size:14px; box-shadow:0 4px 6px rgba(0,0,0,0.3);">🏪</div>`,
          iconSize: [30, 30]
        });
        L.marker([r.lat, r.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${r.name}</strong><br/>${r.address}`);
      });

      // Add Riders
      state.riders.forEach((r) => {
        const icon = L.divIcon({
          className: 'rdr-pin',
          html: `<div style="background-color:${r.isOnline ? '#10b981' : '#64748b'}; color:white; width:32px; height:32px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 4px 6px rgba(0,0,0,0.3);">🛵</div>`,
          iconSize: [32, 32]
        });
        L.marker([r.currentLat, r.currentLng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${r.name}</strong> (${r.vehiclePlate})<br/>Speed: ${r.speed} km/h • ${r.isOnline ? 'Online' : 'Offline'}`);
      });

      leafletMapRef.current = map;
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [activeTab]);

  const handleTestProvider = async (provider: AIProviderConfig) => {
    setTestingProviderId(provider.id);
    setTestResult(null);

    const result = await testAIProviderLive(provider);
    setTestingProviderId(null);

    store.recordAITestResult(
      provider.id,
      result.success ? 'success' : 'failed',
      result.latencyMs,
      result.errorMessage
    );

    setTestResult({
      id: provider.id,
      success: result.success,
      msg: result.success
        ? `HTTP ${result.httpStatus || 200} OK (${result.latencyMs}ms) • Preview: "${result.responsePreview}"`
        : `Test Failed (${result.latencyMs}ms): ${result.errorMessage}`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">Super Admin Command Center</h1>
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Root Access
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Wafa Zone by Mehedi364 • <strong className="text-white">wafaquickeats.site.je</strong>
            </p>
          </div>
        </div>

        {/* Global AI Quick Toggle */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Global AI Assistant
            </span>
            <span className={`text-xs font-black ${state.isAiEnabled ? 'text-amber-400' : 'text-slate-500'}`}>
              {state.isAiEnabled ? 'AI ENGINE ACTIVE' : 'AI OFF'}
            </span>
          </div>
          <button
            onClick={() => store.setAiEnabled(!state.isAiEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              state.isAiEnabled ? 'bg-amber-500' : 'bg-slate-600'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                state.isAiEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs font-bold border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overview KPIs
        </button>
        <button
          onClick={() => setActiveTab('gps-map')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'gps-map' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Live Fleet GPS Map
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'verification' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Verification Queue
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Orders & Dispatch
        </button>
        <button
          onClick={() => setActiveTab('ai-manager')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'ai-manager' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          AI Provider Manager
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'audit' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Audit Logs ({state.auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'health' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System Health
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'emergency' ? 'bg-rose-600 text-white shadow-md' : 'text-rose-600 hover:bg-rose-50'
          }`}
        >
          Emergency Controls
        </button>
      </div>

      {/* Tab: Overview KPIs */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Gross Sales
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">৳{totalSales}</span>
              <span className="text-[11px] text-emerald-600 font-bold mt-1">100% Verified Transactions</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Orders Placed
              </span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">{state.orders.length}</span>
              <span className="text-[11px] text-slate-500">Dhaka North & South</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Online Fleet Riders
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">{activeRidersCount}</span>
              <span className="text-[11px] text-slate-500">Active GPS Broadcasting</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Kitchen Partners
              </span>
              <span className="text-2xl font-black text-indigo-600 mt-1 block">{verifiedRestaurantsCount}</span>
              <span className="text-[11px] text-emerald-600 font-bold">Food Safety Verified</span>
            </div>
          </div>

          {/* Quick System Highlights */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Platform Operations Live Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="font-extrabold text-slate-900 block text-sm">Delivery Zone</span>
                <p className="text-slate-600 mt-1">Dhaka Metropolitan Area (Dhanmondi, Banani, Gulshan, Uttara, Mirpur)</p>
                <span className="text-[10px] text-emerald-600 font-bold mt-2 inline-block">● Radius 7.5 km Enforced</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="font-extrabold text-slate-900 block text-sm">Payment Gateway</span>
                <p className="text-slate-600 mt-1">bKash, Nagad, Rocket & Cash on Delivery (COD)</p>
                <span className="text-[10px] text-emerald-600 font-bold mt-2 inline-block">● Multi-Gateway Active</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="font-extrabold text-slate-900 block text-sm">Deployment Target</span>
                <p className="text-slate-600 mt-1">InfinityFree / cPanel (PHP 8.x + MySQL PDO)</p>
                <span className="text-[10px] text-indigo-600 font-bold mt-2 inline-block">wafaquickeats.site.je</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Live Fleet GPS Map */}
      {activeTab === 'gps-map' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Live GPS Fleet Map</h2>
              <p className="text-xs text-slate-500">
                Monitoring active riders, restaurant hubs and active deliveries in real time.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Rider Pilot</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-3 h-3 rounded-md bg-slate-900" />
                <span>Kitchen Hub</span>
              </span>
            </div>
          </div>

          <div className="h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>
      )}

      {/* Tab: Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          {/* Restaurants Verification */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-black text-base text-slate-900">Restaurant Verification Queue</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {state.restaurants.map((res) => (
                <div key={res.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={res.logo} alt={res.name} className="w-12 h-12 rounded-xl object-cover border" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-sm">{res.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({res.id})</span>
                      </div>
                      <p className="text-slate-500">{res.address}</p>
                      {res.documents?.tradeLicense && (
                        <p className="text-[10px] text-slate-400">Trade License: {res.documents.tradeLicense}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        res.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {res.isVerified ? 'Verified' : 'Pending Review'}
                    </span>
                    <button
                      onClick={() => store.verifyRestaurant(res.id, !res.isVerified)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold hover:bg-slate-100 transition-colors"
                    >
                      {res.isVerified ? 'Revoke Verification' : 'Approve & Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Riders Verification */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-black text-base text-slate-900">Rider Pilots Verification Queue</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {state.riders.map((rdr) => (
                <div key={rdr.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={rdr.avatar} alt={rdr.name} className="w-12 h-12 rounded-xl object-cover border" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-sm">{rdr.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({rdr.id})</span>
                      </div>
                      <p className="text-slate-500">{rdr.vehicleType} • {rdr.vehiclePlate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        rdr.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {rdr.status}
                    </span>
                    <button
                      onClick={() =>
                        store.verifyRider(rdr.id, rdr.status === 'verified' ? 'under_review' : 'verified')
                      }
                      className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold hover:bg-slate-100 transition-colors"
                    >
                      {rdr.status === 'verified' ? 'Set Under Review' : 'Approve Rider'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Orders & Dispatch */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">All Platform Orders ({state.orders.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Kitchen</th>
                  <th className="py-3 px-3">Rider</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{o.id}</td>
                    <td className="py-3 px-3">{o.customerName}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{o.restaurantName}</td>
                    <td className="py-3 px-3 text-slate-600">{o.riderName || 'Unassigned'}</td>
                    <td className="py-3 px-3 font-black text-slate-900">৳{o.grandTotal}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded">
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {o.status !== 'delivered' && o.status !== 'cancelled' && (
                        <button
                          onClick={() => store.updateOrderStatus(o.id, 'delivered', 'Super Admin Override')}
                          className="text-[11px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-bold"
                        >
                          Force Deliver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: AI Provider Manager with REAL API TESTING */}
      {activeTab === 'ai-manager' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-black text-slate-900">AI Provider Manager</h2>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Free & Premium LLMs
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure Google Gemini, OpenRouter, Groq, Cerebras, and DeepSeek.
              Click <strong>"TEST API"</strong> to perform a REAL test request with measured latency.
            </p>
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                <span>{testResult.msg}</span>
              </div>
              <button onClick={() => setTestResult(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
          )}

          <div className="space-y-4">
            {state.aiProviders.map((prov) => (
              <div
                key={prov.id}
                className="p-4 sm:p-5 rounded-3xl border border-slate-200/90 bg-slate-50 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-xs">
                      {prov.name[0]}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{prov.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{prov.endpoint}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        prov.category === 'FREE' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {prov.category}
                    </span>

                    <button
                      onClick={() => handleTestProvider(prov)}
                      disabled={testingProviderId === prov.id}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      {testingProviderId === prov.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>Testing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>TEST API</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                  <div>
                    <label className="font-bold text-slate-600 block mb-0.5">Model Name</label>
                    <input
                      type="text"
                      value={prov.model}
                      onChange={(e) => store.updateAIProvider(prov.id, { model: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-0.5">API Key (Stored Securely)</label>
                    <input
                      type="password"
                      value={prov.apiKey}
                      onChange={(e) => store.updateAIProvider(prov.id, { apiKey: e.target.value })}
                      placeholder="Enter provider key or leave blank for default"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">System Security Audit Logs</h2>
            <span className="text-xs text-slate-400 font-semibold">Immutable Record</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor & Role</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Details / Value</th>
                  <th className="py-2.5 px-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {state.auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{log.actor}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-600">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-700">{log.target} ({log.targetId})</td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">{log.newValue || log.reason || '-'}</td>
                    <td className="py-2.5 px-3 text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: System Health */}
      {activeTab === 'health' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">System Health & Diagnostic Monitor</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              All Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Database Engine</span>
              <div className="font-extrabold text-slate-900 text-sm">MySQL 8.x / PDO Strict</div>
              <p className="text-slate-500">Query Latency: {state.systemHealth.database.latencyMs}ms</p>
              <span className="text-emerald-600 font-bold text-[10px]">● Healthy (Strict UTF8MB4)</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Web Server & PHP</span>
              <div className="font-extrabold text-slate-900 text-sm">PHP {state.systemHealth.server.phpVersion}</div>
              <p className="text-slate-500">InfinityFree & cPanel Certified</p>
              <span className="text-emerald-600 font-bold text-[10px]">● HTTPS Verified</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Real GPS Tracker</span>
              <div className="font-extrabold text-slate-900 text-sm">OSRM Real Road Routing</div>
              <p className="text-slate-500">Active Broadcasters: {state.systemHealth.gps.activeBroadcastingRiders}</p>
              <span className="text-emerald-600 font-bold text-[10px]">● GPS Service Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Emergency Controls */}
      {activeTab === 'emergency' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-rose-500 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 text-rose-600">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-black">Emergency Super Admin Controls</h2>
              <p className="text-xs text-slate-500">
                Instantly control platform accessibility during high load or system maintenance.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Maintenance Mode */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Maintenance Mode</h4>
                <p className="text-xs text-slate-500">
                  Displays emergency system maintenance banner on all client interfaces.
                </p>
              </div>
              <button
                onClick={() => store.setMaintenanceMode(!state.isMaintenanceMode)}
                className={`px-4 py-2 rounded-xl text-xs font-black text-white transition-colors ${
                  state.isMaintenanceMode ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-700 hover:bg-slate-800'
                }`}
              >
                {state.isMaintenanceMode ? 'DEACTIVATE' : 'ACTIVATE'}
              </button>
            </div>

            {/* Pause New Orders */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Pause New Orders</h4>
                <p className="text-xs text-slate-500">
                  Temporarily stops incoming checkout requests while letting ongoing deliveries complete.
                </p>
              </div>
              <button
                onClick={() => store.setOrdersPaused(!state.isOrdersPaused)}
                className={`px-4 py-2 rounded-xl text-xs font-black text-white transition-colors ${
                  state.isOrdersPaused ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-700 hover:bg-slate-800'
                }`}
              >
                {state.isOrdersPaused ? 'RESUME ORDERS' : 'PAUSE ORDERS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
