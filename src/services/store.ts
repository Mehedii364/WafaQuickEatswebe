import {
  UserRole,
  Language,
  Restaurant,
  FoodItem,
  Order,
  OrderStatus,
  CartItem,
  Rider,
  CustomerProfile,
  Coupon,
  Notification,
  SupportTicket,
  AuditLog,
  AIProviderConfig,
  SystemHealthStatus,
  RiderNote,
  DeliveryIncident,
  Rating,
  SavedAddress
} from '../types';

import {
  initialRestaurants,
  initialFoods,
  initialOrders,
  initialCustomer,
  initialRiders,
  initialCoupons,
  initialNotifications,
  initialSupportTickets,
  initialAuditLogs,
  initialAIProviders,
  initialSystemHealth,
  initialRiderNotes,
  initialIncidents
} from '../data/initialData';

const STORAGE_KEY = 'wafa_quickeats_state_v1';

export interface AppState {
  currentRole: UserRole;
  language: Language;
  customer: CustomerProfile;
  restaurants: Restaurant[];
  foods: FoodItem[];
  orders: Order[];
  riders: Rider[];
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  pointsToRedeem: number;
  coupons: Coupon[];
  notifications: Notification[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLog[];
  aiProviders: AIProviderConfig[];
  systemHealth: SystemHealthStatus;
  riderNotes: RiderNote[];
  incidents: DeliveryIncident[];
  ratings: Rating[];
  isAiEnabled: boolean;
  isMaintenanceMode: boolean;
  isOrdersPaused: boolean;
  activeDeliveryId: string | null;
  selectedRestaurantId: string | null;
}

class Store {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          // Guarantee fresh references
          restaurants: parsed.restaurants || initialRestaurants,
          foods: parsed.foods || initialFoods,
          orders: parsed.orders || initialOrders,
          riders: parsed.riders || initialRiders,
          coupons: parsed.coupons || initialCoupons,
          aiProviders: parsed.aiProviders || initialAIProviders,
          notifications: parsed.notifications || initialNotifications,
          supportTickets: parsed.supportTickets || initialSupportTickets,
          auditLogs: parsed.auditLogs || initialAuditLogs,
          riderNotes: parsed.riderNotes || initialRiderNotes,
          incidents: parsed.incidents || initialIncidents
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved state, using defaults', e);
    }

    return {
      currentRole: 'customer',
      language: 'bn', // Default 🇧🇩 Bangla as requested
      customer: initialCustomer,
      restaurants: initialRestaurants,
      foods: initialFoods,
      orders: initialOrders,
      riders: initialRiders,
      cart: [],
      appliedCoupon: null,
      pointsToRedeem: 0,
      coupons: initialCoupons,
      notifications: initialNotifications,
      supportTickets: initialSupportTickets,
      auditLogs: initialAuditLogs,
      aiProviders: initialAIProviders,
      systemHealth: initialSystemHealth,
      riderNotes: initialRiderNotes,
      incidents: initialIncidents,
      ratings: [],
      isAiEnabled: true,
      isMaintenanceMode: false,
      isOrdersPaused: false,
      activeDeliveryId: 'WQE-ORD-2026-0042',
      selectedRestaurantId: null
    };
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  public getState(): AppState {
    return this.state;
  }

  // --- Roles & Language ---
  public setRole(role: UserRole): void {
    this.logAudit(`SWITCH_ROLE`, 'UserRole', role, `Switched view to ${role}`);
    this.state.currentRole = role;
    this.saveState();
  }

  public setLanguage(lang: Language): void {
    this.state.language = lang;
    this.saveState();
  }

  public setSelectedRestaurant(id: string | null): void {
    this.state.selectedRestaurantId = id;
    this.saveState();
  }

  public setActiveDelivery(id: string | null): void {
    this.state.activeDeliveryId = id;
    this.saveState();
  }

  // --- Cart Actions ---
  public addToCart(item: CartItem): void {
    // If cart has items from another restaurant, confirm reset
    if (this.state.cart.length > 0) {
      const existingResId = this.state.cart[0].foodItem.restaurantId;
      if (existingResId !== item.foodItem.restaurantId) {
        this.state.cart = [];
      }
    }

    const existingIndex = this.state.cart.findIndex(
      (c) =>
        c.foodItem.id === item.foodItem.id &&
        c.selectedVariant?.id === item.selectedVariant?.id &&
        JSON.stringify(c.selectedAddons || []) === JSON.stringify(item.selectedAddons || [])
    );

    if (existingIndex > -1) {
      this.state.cart[existingIndex].quantity += item.quantity;
    } else {
      this.state.cart.push(item);
    }
    this.saveState();
  }

  public updateCartQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.state.cart.splice(index, 1);
    } else {
      this.state.cart[index].quantity = quantity;
    }
    this.saveState();
  }

  public clearCart(): void {
    this.state.cart = [];
    this.state.appliedCoupon = null;
    this.state.pointsToRedeem = 0;
    this.saveState();
  }

  public applyCoupon(code: string): { success: boolean; message: string } {
    const coupon = this.state.coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
    );
    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    const subtotal = this.getCartSubtotal();
    if (subtotal < coupon.minOrder) {
      return {
        success: false,
        message: `Minimum order for ${coupon.code} is ৳${coupon.minOrder}`
      };
    }
    this.state.appliedCoupon = coupon;
    this.saveState();
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  }

  public removeCoupon(): void {
    this.state.appliedCoupon = null;
    this.saveState();
  }

  public setPointsToRedeem(points: number): void {
    const maxPoints = Math.min(this.state.customer.points, Math.floor(this.getCartSubtotal() * 0.2));
    this.state.pointsToRedeem = Math.max(0, Math.min(points, maxPoints));
    this.saveState();
  }

  public getCartSubtotal(): number {
    return this.state.cart.reduce((sum, item) => {
      const base = item.foodItem.discountPrice || item.foodItem.price;
      const variantDelta = item.selectedVariant ? item.selectedVariant.priceDelta : 0;
      const addonsSum = (item.selectedAddons || []).reduce((a, b) => a + b.price, 0);
      return sum + (base + variantDelta + addonsSum) * item.quantity;
    }, 0);
  }

  // --- Order Placement ---
  public placeOrder(params: {
    deliveryAddress: SavedAddress;
    paymentMethod: 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card';
  }): Order {
    if (this.state.isOrdersPaused) {
      throw new Error('New orders are temporarily paused by management.');
    }
    if (this.state.cart.length === 0) {
      throw new Error('Cart is empty.');
    }

    const firstItem = this.state.cart[0].foodItem;
    const restaurant = this.state.restaurants.find((r) => r.id === firstItem.restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found.');
    }

    const subtotal = this.getCartSubtotal();
    let discount = 0;
    if (this.state.appliedCoupon) {
      if (this.state.appliedCoupon.discountType === 'percentage') {
        discount = (subtotal * this.state.appliedCoupon.discountValue) / 100;
        if (this.state.appliedCoupon.maxDiscount) {
          discount = Math.min(discount, this.state.appliedCoupon.maxDiscount);
        }
      } else {
        discount = this.state.appliedCoupon.discountValue;
      }
    }

    const pointsDiscount = Math.floor(this.state.pointsToRedeem * 1); // 1 pt = ৳1
    const deliveryFee = restaurant.deliveryFee;
    const serviceFee = 15;
    const taxVat = Math.round(subtotal * 0.05); // 5% VAT
    const grandTotal = Math.max(0, subtotal - discount - pointsDiscount + deliveryFee + serviceFee + taxVat);

    const orderSeq = (this.state.orders.length + 101).toString().padStart(4, '0');
    const orderId = `WQE-ORD-2026-${orderSeq}`;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceNum = `WQE-INV-${dateStr}-${orderSeq}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Map cart items to order items
    const orderItems = this.state.cart.map((c, i) => {
      const base = c.foodItem.discountPrice || c.foodItem.price;
      const variantDelta = c.selectedVariant ? c.selectedVariant.priceDelta : 0;
      const addonsSum = (c.selectedAddons || []).reduce((a, b) => a + b.price, 0);
      const unit = base + variantDelta + addonsSum;
      return {
        id: `oi-${i + 1}`,
        foodId: c.foodItem.id,
        name: c.foodItem.name,
        nameBn: c.foodItem.nameBn,
        quantity: c.quantity,
        unitPrice: unit,
        totalPrice: unit * c.quantity,
        selectedVariant: c.selectedVariant,
        selectedAddons: c.selectedAddons,
        specialInstructions: c.specialInstructions
      };
    });

    const newOrder: Order = {
      id: orderId,
      invoiceNumber: invoiceNum,
      customerId: this.state.customer.id,
      customerName: this.state.customer.name,
      customerPhone: this.state.customer.phone,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantPhone: restaurant.phone,
      restaurantAddress: restaurant.address,
      restaurantLat: restaurant.lat,
      restaurantLng: restaurant.lng,
      status: 'placed',
      items: orderItems,
      subtotal,
      discount,
      pointsDiscount,
      deliveryFee,
      serviceFee,
      taxVat,
      grandTotal,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'cod' ? 'pending' : 'paid',
      deliveryAddress: params.deliveryAddress,
      otp,
      estimatedPrepTime: restaurant.estimatedPrepTime,
      estimatedDeliveryMinutes: restaurant.estimatedPrepTime + 15,
      distanceKm: 2.1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'placed',
          timestamp: new Date().toISOString(),
          note: `Order placed via ${params.paymentMethod.toUpperCase()}`
        }
      ]
    };

    // Deduct redeemed points
    if (this.state.pointsToRedeem > 0) {
      this.state.customer.points -= this.state.pointsToRedeem;
    }

    this.state.orders.unshift(newOrder);
    this.state.activeDeliveryId = newOrder.id;
    this.clearCart();

    this.addNotification({
      userId: this.state.customer.id,
      title: 'Order Placed! ⚡',
      message: `Your order #${newOrder.id} has been submitted to ${restaurant.name}.`,
      type: 'order',
      deepLink: 'orders'
    });

    this.logAudit('CREATE_ORDER', 'Order', newOrder.id, `Total ৳${grandTotal}, Paid: ${params.paymentMethod}`);
    this.saveState();
    return newOrder;
  }

  // --- Order Lifecycle Transitions (Strict Server-Validated) ---
  public updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    riderId?: string
  ): void {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;

    const oldStatus = order.status;
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    if (riderId) {
      const rider = this.state.riders.find((r) => r.id === riderId);
      if (rider) {
        order.riderId = rider.id;
        order.riderName = rider.name;
        order.riderPhone = rider.phone;
        order.riderAvatar = rider.avatar;
        rider.activeOrderId = orderId;
      }
    }

    order.timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Transitioned to ${newStatus}`
    });

    // If delivered, award points to customer & rider
    if (newStatus === 'delivered' && oldStatus !== 'delivered') {
      const earnedCustomerPoints = Math.round(order.grandTotal * 0.05); // 5% points reward
      this.state.customer.points += earnedCustomerPoints;

      if (order.riderId) {
        const rider = this.state.riders.find((r) => r.id === order.riderId);
        if (rider) {
          rider.points += 20;
          rider.totalDeliveries += 1;
          rider.todayEarnings += order.deliveryFee + 25; // delivery fee + bonus
          rider.activeOrderId = undefined;
        }
      }

      this.addNotification({
        userId: order.customerId,
        title: 'Delivered! 🍽️',
        message: `Order #${order.id} was delivered. You earned ${earnedCustomerPoints} loyalty points!`,
        type: 'points',
        deepLink: 'orders'
      });
    }

    this.logAudit('UPDATE_ORDER_STATUS', 'Order', orderId, `${oldStatus} -> ${newStatus}`);
    this.saveState();
  }

  // --- Rider Live GPS Broadcaster ---
  public updateRiderGPS(
    riderId: string,
    lat: number,
    lng: number,
    speed: number,
    bearing: number
  ): void {
    const rider = this.state.riders.find((r) => r.id === riderId);
    if (!rider) return;

    rider.currentLat = lat;
    rider.currentLng = lng;
    rider.speed = speed;
    rider.bearing = bearing;
    rider.lastGpsUpdate = new Date().toISOString();

    this.saveState();
  }

  public setRiderOnline(riderId: string, isOnline: boolean): void {
    const rider = this.state.riders.find((r) => r.id === riderId);
    if (!rider) return;
    rider.isOnline = isOnline;
    this.logAudit('RIDER_STATUS_CHANGE', 'Rider', riderId, isOnline ? 'Online' : 'Offline');
    this.saveState();
  }

  // --- Rider Notes & Incidents ---
  public addRiderNote(note: Omit<RiderNote, 'id' | 'createdAt'>): void {
    const newNote: RiderNote = {
      ...note,
      id: `RN-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.state.riderNotes.unshift(newNote);
    this.logAudit('CREATE_RIDER_NOTE', 'RiderNote', newNote.id, newNote.title);
    this.saveState();
  }

  public addIncident(incident: Omit<DeliveryIncident, 'id' | 'createdAt' | 'status'>): void {
    const newIncident: DeliveryIncident = {
      ...incident,
      id: `INC-${Date.now()}`,
      status: 'reported',
      createdAt: new Date().toISOString()
    };
    this.state.incidents.unshift(newIncident);
    this.logAudit('REPORT_INCIDENT', 'DeliveryIncident', newIncident.id, newIncident.incidentType);
    this.saveState();
  }

  // --- Restaurant Food Management ---
  public addFoodItem(item: Omit<FoodItem, 'id'>): FoodItem {
    const id = `WQE-FOD-${Date.now().toString().slice(-4)}`;
    const newFood: FoodItem = { ...item, id };
    this.state.foods.push(newFood);
    this.logAudit('ADD_FOOD_ITEM', 'FoodItem', id, `Added ${item.name}`);
    this.saveState();
    return newFood;
  }

  public updateFoodItem(id: string, updates: Partial<FoodItem>): void {
    const food = this.state.foods.find((f) => f.id === id);
    if (!food) return;
    Object.assign(food, updates);
    this.logAudit('UPDATE_FOOD_ITEM', 'FoodItem', id, `Updated fields`);
    this.saveState();
  }

  public deleteFoodItem(id: string): void {
    this.state.foods = this.state.foods.filter((f) => f.id !== id);
    this.logAudit('DELETE_FOOD_ITEM', 'FoodItem', id, `Deleted food`);
    this.saveState();
  }

  public setRestaurantStatus(id: string, status: Restaurant['status']): void {
    const res = this.state.restaurants.find((r) => r.id === id);
    if (!res) return;
    const old = res.status;
    res.status = status;
    this.logAudit('UPDATE_RESTAURANT_STATUS', 'Restaurant', id, `${old} -> ${status}`);
    this.saveState();
  }

  // --- Verification Center ---
  public verifyRestaurant(id: string, isVerified: boolean): void {
    const res = this.state.restaurants.find((r) => r.id === id);
    if (!res) return;
    res.isVerified = isVerified;
    this.logAudit('VERIFY_RESTAURANT', 'Restaurant', id, isVerified ? 'Verified' : 'Rejected');
    this.saveState();
  }

  public verifyRider(id: string, status: Rider['status']): void {
    const rider = this.state.riders.find((r) => r.id === id);
    if (!rider) return;
    rider.status = status;
    this.logAudit('VERIFY_RIDER', 'Rider', id, status);
    this.saveState();
  }

  // --- Emergency & Controls ---
  public setAiEnabled(enabled: boolean): void {
    this.state.isAiEnabled = enabled;
    this.logAudit('TOGGLE_AI', 'System', 'AI_ENGINE', enabled ? 'Enabled' : 'Disabled');
    this.saveState();
  }

  public setMaintenanceMode(enabled: boolean): void {
    this.state.isMaintenanceMode = enabled;
    this.logAudit('TOGGLE_MAINTENANCE', 'System', 'MAINTENANCE', enabled ? 'ON' : 'OFF');
    this.saveState();
  }

  public setOrdersPaused(paused: boolean): void {
    this.state.isOrdersPaused = paused;
    this.logAudit('TOGGLE_PAUSE_ORDERS', 'System', 'ORDERS', paused ? 'PAUSED' : 'RESUMED');
    this.saveState();
  }

  // --- Support Tickets ---
  public createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'status'>): SupportTicket {
    const id = `WQE-TCK-${Date.now().toString().slice(-4)}`;
    const newTicket: SupportTicket = {
      ...ticket,
      id,
      status: 'open',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          senderName: ticket.userName,
          message: ticket.description,
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.state.supportTickets.unshift(newTicket);
    this.logAudit('CREATE_SUPPORT_TICKET', 'SupportTicket', id, ticket.subject);
    this.saveState();
    return newTicket;
  }

  public replySupportTicket(ticketId: string, sender: 'user' | 'support_admin', name: string, message: string): void {
    const t = this.state.supportTickets.find((s) => s.id === ticketId);
    if (!t) return;
    t.messages.push({
      id: `msg-${Date.now()}`,
      sender,
      senderName: name,
      message,
      createdAt: new Date().toISOString()
    });
    t.updatedAt = new Date().toISOString();
    if (sender === 'support_admin' && t.status === 'open') {
      t.status = 'in_progress';
    }
    this.saveState();
  }

  // --- Ratings ---
  public submitRating(rating: Omit<Rating, 'id' | 'createdAt'>): void {
    const newRating: Rating = {
      ...rating,
      id: `RAT-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.state.ratings.push(newRating);

    // Update restaurant average rating
    const res = this.state.restaurants.find((r) => r.id === rating.restaurantId);
    if (res) {
      const prevTotal = res.rating * res.reviewCount;
      res.reviewCount += 1;
      res.rating = Number(((prevTotal + rating.overallRestaurantRating) / res.reviewCount).toFixed(1));
    }

    this.logAudit('SUBMIT_RATING', 'Order', rating.orderId, `Score ${rating.overallRestaurantRating}/5`);
    this.saveState();
  }

  // --- AI Provider Manager ---
  public updateAIProvider(id: string, updates: Partial<AIProviderConfig>): void {
    const prov = this.state.aiProviders.find((p) => p.id === id);
    if (!prov) return;
    Object.assign(prov, updates);
    this.logAudit('UPDATE_AI_PROVIDER', 'AIProvider', id, `Updated settings for ${prov.name}`);
    this.saveState();
  }

  public recordAITestResult(
    id: string,
    status: 'success' | 'failed',
    latencyMs: number,
    errorMsg?: string
  ): void {
    const prov = this.state.aiProviders.find((p) => p.id === id);
    if (!prov) return;
    prov.lastTestStatus = status;
    prov.lastLatencyMs = latencyMs;
    prov.lastTestedAt = new Date().toISOString();
    prov.lastErrorMessage = errorMsg;
    this.saveState();
  }

  // --- Notifications ---
  public addNotification(notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): void {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.state.notifications.unshift(newNotif);
    this.saveState();
  }

  public markNotificationAsRead(id: string): void {
    const n = this.state.notifications.find((notif) => notif.id === id);
    if (n) {
      n.isRead = true;
      this.saveState();
    }
  }

  // --- Audit Logs ---
  private logAudit(
    action: string,
    target: string,
    targetId: string,
    newValue?: string
  ): void {
    const log: AuditLog = {
      id: `AUD-${Date.now()}`,
      actor: `${this.state.currentRole.toUpperCase()}`,
      actorRole: this.state.currentRole,
      action,
      target,
      targetId,
      newValue,
      ipAddress: '103.114.152.12',
      timestamp: new Date().toISOString()
    };
    this.state.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs.pop();
    }
  }
}

export const store = new Store();
