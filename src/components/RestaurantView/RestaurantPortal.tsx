import React, { useState } from 'react';
import {
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Layers,
  ChefHat,
  Bike
} from 'lucide-react';
import { Restaurant, FoodItem, Order, OrderStatus } from '../../types';
import { store, AppState } from '../../services/store';
import { getTranslation } from '../../i18n/translations';

interface RestaurantPortalProps {
  state: AppState;
}

export const RestaurantPortal: React.FC<RestaurantPortalProps> = ({ state }) => {
  const t = getTranslation(state.language);
  const myRestaurant = state.restaurants[0]; // Sultan's Dine by default
  const myFoods = state.foods.filter((f) => f.restaurantId === myRestaurant.id);
  const myOrders = state.orders.filter((o) => o.restaurantId === myRestaurant.id);

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'profile'>('orders');
  const [isAddingFood, setIsAddingFood] = useState(false);

  // New Food Form State
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodNameBn, setNewFoodNameBn] = useState('');
  const [newFoodDesc, setNewFoodDesc] = useState('');
  const [newFoodPrice, setNewFoodPrice] = useState(350);
  const [newFoodCategory, setNewFoodCategory] = useState('cat-biryani');
  const [newFoodPhoto, setNewFoodPhoto] = useState('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80');

  // Stats
  const todaySales = myOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const pendingOrders = myOrders.filter((o) => o.status === 'placed' || o.status === 'restaurant_accepted' || o.status === 'preparing');
  const completedOrders = myOrders.filter((o) => o.status === 'delivered');

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;

    store.addFoodItem({
      restaurantId: myRestaurant.id,
      categoryId: newFoodCategory,
      name: newFoodName.trim(),
      nameBn: newFoodNameBn.trim() || newFoodName.trim(),
      description: newFoodDesc.trim() || 'Freshly prepared specialty dish.',
      descriptionBn: 'সুস্বাদু ও স্বাস্থ্যসম্মত উপাদান দিয়ে তৈরি খাবার।',
      price: Number(newFoodPrice),
      photos: [newFoodPhoto],
      isAvailable: true,
      preparationTime: 20,
      isPopular: false
    });

    setIsAddingFood(false);
    setNewFoodName('');
    setNewFoodNameBn('');
    setNewFoodDesc('');
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    store.updateOrderStatus(orderId, newStatus, note);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* Restaurant Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={myRestaurant.logo}
            alt={myRestaurant.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{myRestaurant.name}</h1>
              {myRestaurant.isVerified && (
                <ShieldCheck className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
              )}
            </div>
            <p className="text-xs text-slate-500">{myRestaurant.address}</p>
            <span className="text-[10px] text-slate-400 font-mono">ID: {myRestaurant.id}</span>
          </div>
        </div>

        {/* Store Open/Busy/Closed Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => store.setRestaurantStatus(myRestaurant.id, 'open')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              myRestaurant.status === 'open'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ● Open
          </button>
          <button
            onClick={() => store.setRestaurantStatus(myRestaurant.id, 'busy')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              myRestaurant.status === 'busy'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Busy
          </button>
          <button
            onClick={() => store.setRestaurantStatus(myRestaurant.id, 'closed')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              myRestaurant.status === 'closed'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Closed
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Today's Sales
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">৳{todaySales}</span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18% vs yesterday
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Active Orders
          </span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{pendingOrders.length}</span>
          <span className="text-[11px] text-slate-500">In kitchen / packing</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Completed Today
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedOrders.length}</span>
          <span className="text-[11px] text-slate-500">100% delivered</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Menu Items
          </span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">{myFoods.length}</span>
          <span className="text-[11px] text-slate-500">Active dishes</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Kitchen Orders ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'menu' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Menu Management ({myFoods.length})
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Incoming & Active Kitchen Orders</h2>
            <span className="text-xs text-slate-400 font-semibold">Real-time status updater</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">#{order.id}</span>
                    <h3 className="font-extrabold text-slate-900 text-sm">{order.customerName}</h3>
                  </div>
                  <span className="text-xs font-extrabold text-amber-600">৳{order.grandTotal}</span>
                </div>

                {/* Items */}
                <div className="text-xs space-y-1 text-slate-600">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-bold">৳{it.totalPrice}</span>
                    </div>
                  ))}
                  {order.items[0]?.specialInstructions && (
                    <p className="text-[11px] text-amber-700 italic bg-amber-50 p-2 rounded-xl">
                      Note: {order.items[0].specialInstructions}
                    </p>
                  )}
                </div>

                {/* Status Transition Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded text-slate-700">
                    Status: {order.status.replace(/_/g, ' ')}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs">
                    {order.status === 'placed' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'restaurant_accepted', 'Kitchen accepted order')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs"
                      >
                        Accept Order
                      </button>
                    )}

                    {order.status === 'restaurant_accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'preparing', 'Kitchen chef started cooking')}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl shadow-xs"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ready_for_pickup', 'Food packed in thermal pouch')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}

                    {order.status === 'ready_for_pickup' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'pickup_completed', 'Handed over to rider Tanvir Ahmed')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs"
                      >
                        Handover to Rider
                      </button>
                    )}

                    {order.status === 'on_the_way' && (
                      <span className="text-slate-500 text-[11px] font-semibold flex items-center gap-1">
                        <Bike className="w-3.5 h-3.5 text-amber-500" />
                        Rider On Road
                      </span>
                    )}

                    {order.status === 'delivered' && (
                      <span className="text-emerald-600 text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Menu Management */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Food Menu & Dishes</h2>
            <button
              onClick={() => setIsAddingFood(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Add New Food Modal */}
          {isAddingFood && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
              <form
                onSubmit={handleCreateFood}
                className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900">Add New Menu Dish</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingFood(false)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-800"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dish Name (English)</label>
                    <input
                      type="text"
                      value={newFoodName}
                      onChange={(e) => setNewFoodName(e.target.value)}
                      placeholder="e.g. Special Beef Chaap"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dish Name (বাংলা)</label>
                    <input
                      type="text"
                      value={newFoodNameBn}
                      onChange={(e) => setNewFoodNameBn(e.target.value)}
                      placeholder="e.g. স্পেশাল বিফ চাপ"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Price (৳ BDT)</label>
                    <input
                      type="number"
                      value={newFoodPrice}
                      onChange={(e) => setNewFoodPrice(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newFoodCategory}
                      onChange={(e) => setNewFoodCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                    >
                      <option value="cat-biryani">Biryani & Polao</option>
                      <option value="cat-burgers">Burgers & Fries</option>
                      <option value="cat-kebabs">Kebab & Chaap</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newFoodDesc}
                    onChange={(e) => setNewFoodDesc(e.target.value)}
                    placeholder="Ingredients, preparation and serving style..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Photo Image URL</label>
                  <input
                    type="url"
                    value={newFoodPhoto}
                    onChange={(e) => setNewFoodPhoto(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingFood(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl shadow-md"
                  >
                    Save Dish to Menu
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Dishes Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Prep Time</th>
                  <th className="py-3 px-3">Availability</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={food.photos[0]}
                        alt={food.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900">{food.name}</div>
                        <div className="text-[10px] text-slate-400">{food.nameBn}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">৳{food.price}</td>
                    <td className="py-3 px-3 text-slate-600">{food.preparationTime} mins</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() =>
                          store.updateFoodItem(food.id, { isAvailable: !food.isAvailable })
                        }
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          food.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {food.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => store.deleteFoodItem(food.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Food"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
