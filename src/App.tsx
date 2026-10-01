import React, { useState, useEffect } from 'react';
import { store, AppState } from './services/store';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { FloatingAI } from './components/FloatingAI';
import { HomeView } from './components/CustomerView/HomeView';
import { RestaurantDetails } from './components/CustomerView/RestaurantDetails';
import { FoodModal } from './components/CustomerView/FoodModal';
import { CartDrawer } from './components/CustomerView/CartDrawer';
import { CheckoutModal } from './components/CustomerView/CheckoutModal';
import { LiveTrackingModal } from './components/CustomerView/LiveTrackingModal';
import { InvoiceModal } from './components/CustomerView/InvoiceModal';
import { CustomerOrders } from './components/CustomerView/CustomerOrders';
import { CustomerProfileView } from './components/CustomerView/CustomerProfileView';
import { PointsWallet } from './components/CustomerView/PointsWallet';
import { SupportModal } from './components/CustomerView/SupportModal';
import { NotificationsModal } from './components/NotificationsModal';
import { RestaurantPortal } from './components/RestaurantView/RestaurantPortal';
import { RiderPortal } from './components/RiderView/RiderPortal';
import { AdminPortal } from './components/AdminView/AdminPortal';
import { FoodItem, Order } from './types';

export default function App() {
  const [state, setState] = useState<AppState>(store.getState());
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPointsOpen, setIsPointsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return () => unsubscribe();
  }, []);

  const handleSelectRestaurant = (id: string) => {
    store.setSelectedRestaurant(id);
  };

  const handleBackFromRestaurant = () => {
    store.setSelectedRestaurant(null);
  };

  const handleOrderPlaced = (order: Order) => {
    setTrackingOrder(order);
  };

  const handleTrackOrderById = (orderId: string) => {
    const o = state.orders.find((ord) => ord.id === orderId);
    if (o) setTrackingOrder(o);
  };

  const selectedRestaurant = state.selectedRestaurantId
    ? state.restaurants.find((r) => r.id === state.selectedRestaurantId)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Main Navbar with Role Switcher & Language Switcher */}
      <Navbar
        state={state}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenPoints={() => setIsPointsOpen(true)}
      />

      {/* Main Content Area based on Active Role */}
      <main className="flex-1">
        {state.currentRole === 'restaurant_manager' && (
          <RestaurantPortal state={state} />
        )}

        {state.currentRole === 'rider' && (
          <RiderPortal state={state} />
        )}

        {(state.currentRole === 'admin' || state.currentRole === 'super_admin') && (
          <AdminPortal state={state} />
        )}

        {state.currentRole === 'customer' && (
          <>
            {selectedRestaurant ? (
              <RestaurantDetails
                restaurant={selectedRestaurant}
                state={state}
                onBack={handleBackFromRestaurant}
                onOpenCart={() => setIsCartOpen(true)}
              />
            ) : (
              <>
                {(activeTab === 'home' || activeTab === 'restaurants' || activeTab === 'search') && (
                  <HomeView
                    state={state}
                    onSelectRestaurant={handleSelectRestaurant}
                    onSelectFood={(food) => setSelectedFoodForModal(food)}
                    onOpenPoints={() => setIsPointsOpen(true)}
                    onTrackOrder={handleTrackOrderById}
                  />
                )}

                {activeTab === 'orders' && (
                  <CustomerOrders
                    state={state}
                    onTrackOrder={(o) => setTrackingOrder(o)}
                    onViewInvoice={(o) => setInvoiceOrder(o)}
                  />
                )}

                {activeTab === 'profile' && (
                  <CustomerProfileView
                    state={state}
                    onOpenPoints={() => setIsPointsOpen(true)}
                    onOpenSupport={() => setIsSupportOpen(true)}
                    onSelectRestaurant={handleSelectRestaurant}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on mobile viewports) */}
      <MobileNav
        state={state}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          store.setSelectedRestaurant(null);
          setActiveTab(tab);
        }}
      />

      {/* Circular Floating AI Assistant (Above Mobile Nav) */}
      <FloatingAI state={state} />

      {/* --- Modals & Drawers --- */}

      {/* Cart Drawer */}
      <CartDrawer
        state={state}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          state={state}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {/* Live Delivery Tracking Modal with Leaflet Road Routing */}
      {trackingOrder && (
        <LiveTrackingModal
          order={trackingOrder}
          state={state}
          onClose={() => setTrackingOrder(null)}
          onOpenInvoice={() => {
            setInvoiceOrder(trackingOrder);
            setTrackingOrder(null);
          }}
        />
      )}

      {/* Tax Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          state={state}
          onClose={() => setInvoiceOrder(null)}
        />
      )}

      {/* Food Details Modal */}
      {selectedFoodForModal && (
        <FoodModal
          food={selectedFoodForModal}
          state={state}
          onClose={() => setSelectedFoodForModal(null)}
          onAddedToCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Points & Rewards Wallet Modal */}
      {isPointsOpen && (
        <PointsWallet
          state={state}
          onClose={() => setIsPointsOpen(false)}
          onOpenCart={() => {
            setIsPointsOpen(false);
            setIsCartOpen(true);
          }}
        />
      )}

      {/* Support & Disputes Modal */}
      {isSupportOpen && (
        <SupportModal
          state={state}
          onClose={() => setIsSupportOpen(false)}
        />
      )}

      {/* Notifications Modal */}
      {isNotificationsOpen && (
        <NotificationsModal
          state={state}
          onClose={() => setIsNotificationsOpen(false)}
          onTrackOrder={handleTrackOrderById}
        />
      )}
    </div>
  );
}
