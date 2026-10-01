export type UserRole = 'customer' | 'restaurant_manager' | 'rider' | 'admin' | 'super_admin';

export type Language = 'bn' | 'en';

export interface User {
  id: string; // e.g. WQE-CUS-100234, WQE-RES-200456, WQE-RDR-300789, WQE-ADM-000001
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

export interface CustomerProfile extends User {
  points: number;
  tier: 'silver' | 'gold' | 'platinum';
  savedAddresses: SavedAddress[];
  favorites: string[]; // restaurant IDs
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  fullAddress: string;
  building?: string;
  floor?: string;
  flat?: string;
  landmark?: string;
  lat: number;
  lng: number;
  deliveryInstructions?: string;
  isDefault?: boolean;
}

export interface Restaurant {
  id: string; // WQE-RES-XXXXXX
  ownerId: string;
  name: string;
  nameBn: string;
  tagline: string;
  logo: string;
  coverImage: string;
  cuisine: string[];
  description: string;
  phone: string;
  email: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  minOrder: number;
  estimatedPrepTime: number; // in minutes
  status: 'open' | 'closed' | 'busy' | 'temp_closed';
  isVerified: boolean;
  isFeatured: boolean;
  offerBadge?: string;
  weeklyOff?: string;
  openingHours: string;
  documents?: {
    tradeLicense?: string;
    nid?: string;
    foodSafetyCert?: string;
  };
}

export interface FoodCategory {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
}

export interface FoodVariant {
  id: string;
  name: string;
  nameBn?: string;
  priceDelta: number; // additional price over base
}

export interface FoodAddon {
  id: string;
  name: string;
  nameBn?: string;
  price: number;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  price: number;
  discountPrice?: number;
  photos: string[]; // Unlimited photos support
  isAvailable: boolean;
  preparationTime: number; // in mins
  isPopular?: boolean;
  isFeatured?: boolean;
  variants?: FoodVariant[];
  addons?: FoodAddon[];
  calories?: number;
  isVeg?: boolean;
}

export type OrderStatus =
  | 'placed'
  | 'restaurant_accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'rider_assigned'
  | 'rider_accepted'
  | 'pickup_completed'
  | 'on_the_way'
  | 'arrived'
  | 'delivered'
  | 'cancelled'
  | 'failed_delivery';

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  selectedVariant?: FoodVariant;
  selectedAddons?: FoodAddon[];
  specialInstructions?: string;
}

export interface OrderItem {
  id: string;
  foodId: string;
  name: string;
  nameBn?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedVariant?: FoodVariant;
  selectedAddons?: FoodAddon[];
  specialInstructions?: string;
}

export interface Order {
  id: string; // e.g. WQE-ORD-2026-0042
  invoiceNumber: string; // e.g. WQE-INV-20260930-000125
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  restaurantPhone: string;
  restaurantAddress: string;
  restaurantLat: number;
  restaurantLng: number;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderAvatar?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  pointsDiscount: number;
  deliveryFee: number;
  serviceFee: number;
  taxVat: number;
  grandTotal: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card';
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  deliveryAddress: SavedAddress;
  otp: string; // 4-digit OTP for rider delivery completion
  estimatedPrepTime: number;
  estimatedDeliveryMinutes: number;
  distanceKm: number;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  cancellationReason?: string;
}

export interface Rider {
  id: string; // WQE-RDR-XXXXXX
  userId: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  vehicleType: 'Bike' | 'Bicycle' | 'Scooter';
  vehiclePlate: string;
  isOnline: boolean;
  status: 'verified' | 'pending' | 'under_review' | 'rejected' | 'suspended';
  currentLat: number;
  currentLng: number;
  bearing: number;
  speed: number; // km/h
  accuracy: number; // in meters
  lastGpsUpdate: string;
  rating: number;
  totalDeliveries: number;
  points: number;
  todayEarnings: number;
  activeOrderId?: string;
}

export interface RiderNote {
  id: string;
  orderId: string;
  riderId: string;
  riderName: string;
  title: string;
  details: string;
  category:
    | 'Pickup'
    | 'Delivery'
    | 'Location'
    | 'Road Issue'
    | 'Customer Not Answering'
    | 'Restaurant Delay'
    | 'Payment'
    | 'Heavy Traffic'
    | 'Custom';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  visibility: 'admin_only' | 'staff_only' | 'customer_visible';
  photoUrl?: string;
  lat?: number;
  lng?: number;
  createdAt: string;
}

export interface DeliveryIncident {
  id: string;
  orderId: string;
  riderId: string;
  riderName: string;
  incidentType:
    | 'Road Blocked'
    | 'Customer Unavailable'
    | 'Restaurant Delay'
    | 'Vehicle Breakdown'
    | 'Wrong Address'
    | 'Delivery Failure';
  description: string;
  lat: number;
  lng: number;
  photoUrl?: string;
  status: 'reported' | 'under_review' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  restaurantId: string;
  riderId?: string;
  foodQualityRating: number;
  packagingRating: number;
  preparationRating: number;
  overallRestaurantRating: number;
  riderRating: number;
  riderCommunicationRating: number;
  comment: string;
  createdAt: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  role: 'customer' | 'rider' | 'restaurant';
  points: number; // positive for earn, negative for redeem
  balanceAfter: number;
  reason: string;
  orderId?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  validUntil: string;
  usageCount: number;
  isActive: boolean;
  description: string;
  descriptionBn: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'points' | 'system' | 'delivery';
  deepLink?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  orderId?: string;
  category: 'Order Issue' | 'Payment Issue' | 'Rider Issue' | 'Restaurant Issue' | 'Account' | 'Other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  messages: {
    id: string;
    sender: 'user' | 'support_admin';
    senderName: string;
    message: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  targetId: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  ipAddress: string;
  timestamp: string;
}

export interface AIProviderConfig {
  id: string;
  name: string;
  category: 'FREE' | 'PREMIUM';
  endpoint: string;
  model: string;
  apiKey: string;
  priority: number;
  isActive: boolean;
  timeoutMs: number;
  lastTestStatus?: 'success' | 'failed' | 'untested';
  lastLatencyMs?: number;
  lastTestedAt?: string;
  lastErrorMessage?: string;
}

export interface SystemHealthStatus {
  database: { status: 'healthy' | 'degraded' | 'error'; latencyMs: number; connection: string };
  api: { status: 'healthy' | 'degraded' | 'error'; uptimeSec: number };
  storage: { status: 'healthy'; diskUsedMb: number; quotaMb: number };
  uploads: { status: 'healthy'; mimeChecking: boolean };
  gps: { status: 'healthy'; activeBroadcastingRiders: number };
  notifications: { status: 'healthy'; queueSize: number };
  ai: { status: 'healthy' | 'disabled'; activeProvider: string };
  server: { phpVersion: string; nodeVersion: string; environment: string; https: boolean };
}
