import {
  Restaurant,
  FoodCategory,
  FoodItem,
  Order,
  Rider,
  CustomerProfile,
  Coupon,
  Notification,
  SupportTicket,
  AuditLog,
  AIProviderConfig,
  SystemHealthStatus,
  RiderNote,
  DeliveryIncident
} from '../types';

export const initialCategories: FoodCategory[] = [
  { id: 'cat-biryani', name: 'Biryani & Polao', nameBn: 'বিরিয়ানি ও পোলাও', icon: '🍲' },
  { id: 'cat-burgers', name: 'Burgers & Fries', nameBn: 'বার্গার ও ফ্রাইস', icon: '🍔' },
  { id: 'cat-kebabs', name: 'Kebab & Chaap', nameBn: 'কাবাব ও চাপ', icon: '🍢' },
  { id: 'cat-pizza', name: 'Pizza & Pasta', nameBn: 'পিজা ও পাস্তা', icon: '🍕' },
  { id: 'cat-desserts', name: 'Desserts & Sweets', nameBn: 'মিষ্টান্ন ও ডেজার্ট', icon: '🍧' },
  { id: 'cat-beverages', name: 'Drinks & Juices', nameBn: 'পানীয় ও শরবত', icon: '🥤' }
];

export const initialRestaurants: Restaurant[] = [
  {
    id: 'WQE-RES-101',
    ownerId: 'WQE-USR-RES1',
    name: "Sultan's Dine",
    nameBn: "সুলতান্স ডাইন",
    tagline: 'The King of Kacchi in Dhaka',
    logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Kacchi Biryani', 'Mughlai', 'Bangladeshi'],
    description: 'Renowned for tender mutton kacchi cooked in fragrant Basmati rice, served with jorda, borhani and shahi chutney.',
    phone: '+880 1711-234567',
    email: 'info@sultansdine.com.bd',
    address: 'Green Akshay Plaza, 2nd Floor, Road 27, Dhanmondi, Dhaka',
    lat: 23.7505,
    lng: 90.3742,
    rating: 4.8,
    reviewCount: 3420,
    deliveryFee: 40,
    minOrder: 250,
    estimatedPrepTime: 20,
    status: 'open',
    isVerified: true,
    isFeatured: true,
    offerBadge: '20% OFF ON BORHANI COMBO',
    openingHours: '11:30 AM - 11:00 PM',
    documents: {
      tradeLicense: 'TRAD/DNCC/049182/2023',
      nid: '8271928371'
    }
  },
  {
    id: 'WQE-RES-102',
    ownerId: 'WQE-USR-RES2',
    name: 'Chillox Burgers',
    nameBn: 'চিলক্স বার্গারস',
    tagline: 'Messy, Juicy, Legendary Patty Burgers',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Burgers', 'Fast Food', 'Naga Wings'],
    description: 'Famous for extreme spicy Naga burgers, cheesy double beef smash patties and crunchy curly seasoned fries.',
    phone: '+880 1819-987654',
    email: 'contact@chilloxbd.com',
    address: 'House 48, Road 11, Block D, Banani, Dhaka',
    lat: 23.7937,
    lng: 90.4066,
    rating: 4.7,
    reviewCount: 2890,
    deliveryFee: 45,
    minOrder: 200,
    estimatedPrepTime: 18,
    status: 'open',
    isVerified: true,
    isFeatured: true,
    offerBadge: 'BUY 1 GET 1 WINGS',
    openingHours: '12:00 PM - 12:00 AM',
    documents: {
      tradeLicense: 'TRAD/DNCC/110294/2024',
      nid: '9182746351'
    }
  },
  {
    id: 'WQE-RES-103',
    ownerId: 'WQE-USR-RES3',
    name: 'Star Kabab & Restaurant',
    nameBn: 'স্টার কাবাব অ্যান্ড রেস্তোরাঁ',
    tagline: 'Dhaka Heritage Dining Since 1971',
    logo: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Kebab', 'Mutton Chaap', 'Roti', 'Falooda'],
    description: 'The heartbeat of Dhaka street delicacies: sizzling mutton chaap, tikka kebab, beef boti, and royal falooda.',
    phone: '+880 1912-345678',
    email: 'starkabab@dhakaheritage.com',
    address: 'Road 2, Dhanmondi R/A, Near City College, Dhaka',
    lat: 23.7410,
    lng: 90.3820,
    rating: 4.6,
    reviewCount: 5120,
    deliveryFee: 35,
    minOrder: 150,
    estimatedPrepTime: 15,
    status: 'open',
    isVerified: true,
    isFeatured: false,
    openingHours: '07:00 AM - 11:30 PM',
    documents: {
      tradeLicense: 'TRAD/DSCC/847291/2022',
      nid: '7263541829'
    }
  },
  {
    id: 'WQE-RES-104',
    ownerId: 'WQE-USR-RES4',
    name: 'Kacchi Bhai',
    nameBn: 'কাচ্চি ভাই',
    tagline: 'Shahi Kacchi with Pure Ghee',
    logo: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
    cuisine: ['Kacchi Biryani', 'Beef Tehari', 'Borhani'],
    description: 'Special Bashmati Mutton Kacchi with alu bokhara, saffron flavor and traditional clay-pot slow cooking.',
    phone: '+880 1622-445566',
    email: 'orders@kacchibhai.com',
    address: 'Satmasjid Road, Dhanmondi, Dhaka',
    lat: 23.7431,
    lng: 90.3718,
    rating: 4.7,
    reviewCount: 1980,
    deliveryFee: 40,
    minOrder: 220,
    estimatedPrepTime: 22,
    status: 'open',
    isVerified: true,
    isFeatured: true,
    offerBadge: 'FREE BORHANI WITH FULL PLATTER',
    openingHours: '11:00 AM - 11:00 PM',
    documents: {
      tradeLicense: 'TRAD/DSCC/998124/2024',
      nid: '8374619203'
    }
  }
];

export const initialFoods: FoodItem[] = [
  // Sultan's Dine
  {
    id: 'WQE-FOD-001',
    restaurantId: 'WQE-RES-101',
    categoryId: 'cat-biryani',
    name: 'Bashmati Mutton Kacchi Platter',
    nameBn: 'বাসমতী খাসির কাচ্চি প্ল্যাটার',
    description: 'Long grain fragrant Basmati rice loaded with succulent tender mutton chunks, boiled egg, spiced potato, and rich gravy.',
    descriptionBn: 'সুগন্ধি বাসমতী চাল, নরম তুলতুলে খাসির মাংসের টুকরো, ডিম ও সেদ্ধ আলু সহ শাহী কাচ্চি।',
    price: 480,
    discountPrice: 440,
    photos: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    preparationTime: 20,
    isPopular: true,
    isFeatured: true,
    variants: [
      { id: 'v-half', name: 'Half (1 Person)', nameBn: 'হাফ (১ জন)', priceDelta: 0 },
      { id: 'v-full', name: 'Full (2 Persons, 2x Meat)', nameBn: 'ফুল (২ জন, দ্বিগুণ মাংস)', priceDelta: 380 }
    ],
    addons: [
      { id: 'a-borhani', name: 'Shahi Borhani (250ml)', nameBn: 'শাহী বোরহানি', price: 60 },
      { id: 'a-egg', name: 'Extra Boiled Egg', nameBn: 'অতিরিক্ত ডিম', price: 25 },
      { id: 'a-jorda', name: 'Zafrani Shahi Jorda', nameBn: 'জাফরানি শাহী জর্দা', price: 70 }
    ]
  },
  {
    id: 'WQE-FOD-002',
    restaurantId: 'WQE-RES-101',
    categoryId: 'cat-biryani',
    name: 'Special Chicken Roast with Morog Polao',
    nameBn: 'স্পেশাল চিকেন রোস্ট ও মোরগ পোলাও',
    description: 'Tender chicken leg cooked in golden saffron almond masala gravy served over aromatic chinigura rice polao.',
    descriptionBn: 'চিনিগুঁড়া চালের সুবাসিত পোলাও এবং কাজুবাদাম মশলায় তৈরি শাহী চিকেন রোস্ট।',
    price: 360,
    photos: [
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    preparationTime: 18,
    isPopular: true,
    addons: [
      { id: 'a-salad', name: 'Cucumber Onion Salad', nameBn: 'শসা ও পেঁয়াজ সালাদ', price: 20 },
      { id: 'a-borhani', name: 'Spicy Mint Borhani', nameBn: 'পুদিনা বোরহানি', price: 60 }
    ]
  },

  // Chillox Burgers
  {
    id: 'WQE-FOD-003',
    restaurantId: 'WQE-RES-102',
    categoryId: 'cat-burgers',
    name: 'Double Beef Naga Blast Burger',
    nameBn: 'ডাবল বিফ নাগা ব্লাস্ট বার্গার',
    description: 'Double charcoal-grilled 100% beef patties, molten cheddar cheese slice, caramelized onions, fresh lettuce and ghost pepper Naga sauce.',
    descriptionBn: 'দুই স্তর গ্রিল করা বিফ প্যাটি, চিজ, ক্যারামেলাইজড পেঁয়াজ এবং আসল নাগা মরিচের ঝাল সস।',
    price: 380,
    discountPrice: 340,
    photos: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    preparationTime: 15,
    isPopular: true,
    isFeatured: true,
    variants: [
      { id: 'v-mild', name: 'Regular Naga Spice', nameBn: 'স্বাভাবিক ঝাল', priceDelta: 0 },
      { id: 'v-extreme', name: 'Extreme Naga Flame 🌶️🌶️', nameBn: 'মারাত্মক নাগা ফ্লেম', priceDelta: 20 }
    ],
    addons: [
      { id: 'a-cheese', name: 'Extra Cheddar Slice', nameBn: 'অতিরিক্ত চেডার চিজ', price: 40 },
      { id: 'a-bacon', name: 'Smoked Beef Pepperoni', nameBn: 'বিফ পেপেরোনি', price: 70 },
      { id: 'a-fries', name: 'Seasoned Curly Fries', nameBn: 'কার্লি ফ্রাইস', price: 110 }
    ]
  },
  {
    id: 'WQE-FOD-004',
    restaurantId: 'WQE-RES-102',
    categoryId: 'cat-burgers',
    name: 'Crispy Fried Chicken Fillet Burger',
    nameBn: 'ক্রিস্পি ফ্রাইড চিকেন বার্গার',
    description: 'Deep buttermilk marinated crispy boneless chicken thigh, crunchy cabbage slaw, gherkins and herb garlic mayonnaise.',
    descriptionBn: 'মচমচে বাটারমিল্ক ফ্রাইড চিকেন ফিলেট, গার্লিক মেয়োনিজ ও ক্রাঞ্চি সালাদ।',
    price: 290,
    photos: [
      'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    preparationTime: 15,
    isPopular: false,
    addons: [
      { id: 'a-naga-dip', name: 'Fiery Naga Garlic Dip', nameBn: 'নাগা ডিপ সস', price: 35 }
    ]
  },

  // Star Kabab
  {
    id: 'WQE-FOD-005',
    restaurantId: 'WQE-RES-103',
    categoryId: 'cat-kebabs',
    name: 'Sizzling Mutton Chaap with Roomali Roti',
    nameBn: 'সিজলিং খাসির চাপ ও রুমালি রুটি',
    description: 'Marinated tender mutton ribs slow-fried in pure mustard oil and fragrant chaap spices, served with soft thin roomali roti and lemon salad.',
    descriptionBn: 'সরিষার তেলে ভাজা মসলাদার খাসির চাপ, পাতলা রুমালি রুটি ও পেঁয়াজ-লেবু সালাদ।',
    price: 260,
    photos: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    preparationTime: 12,
    isPopular: true,
    isFeatured: true,
    addons: [
      { id: 'a-roti', name: 'Extra Butter Naan', nameBn: 'বাটার নান', price: 40 },
      { id: 'a-falooda', name: 'Royal Star Falooda Glass', nameBn: 'রয়্যাল স্টার ফালুদা', price: 120 }
    ]
  },
  {
    id: 'WQE-FOD-006',
    restaurantId: 'WQE-RES-104',
    categoryId: 'cat-biryani',
    name: 'Shahi Beef Tehari with Mustard Flavors',
    nameBn: 'শাহী বিফ তেহারি (সরিষার তেল)',
    description: 'Traditional Old Dhaka style beef tehari cooked in fragrant mustard oil, small succulent beef cubes and whole green chilies.',
    descriptionBn: 'পুরান ঢাকার আসল স্বাদে খাঁটি সরিষার তেলে রান্না করা ছোট গরুর মাংসের টুকরোযুক্ত সুগন্ধি তেহারি।',
    price: 320,
    photos: [
      'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    preparationTime: 20,
    isPopular: true,
    addons: [
      { id: 'a-borhani', name: 'Special Sour-Sweet Borhani', nameBn: 'টক-মিষ্টি বোরহানি', price: 50 }
    ]
  }
];

export const initialCustomer: CustomerProfile = {
  id: 'WQE-CUS-100234',
  name: 'Md. Mehedi Hasan',
  email: 'mehedi364@wafaquickeats.site.je',
  phone: '+880 1712-345678',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'active',
  createdAt: '2026-01-15T09:00:00Z',
  points: 480,
  tier: 'gold',
  savedAddresses: [
    {
      id: 'addr-home',
      label: 'Home',
      fullAddress: 'Apartment 4B, House 12, Road 7A, Dhanmondi R/A, Dhaka',
      building: 'Green Heritage',
      floor: '4th Floor',
      flat: '4B',
      landmark: 'Opposite to Ibn Sina Hospital',
      lat: 23.7460,
      lng: 90.3755,
      deliveryInstructions: 'Ring bell twice, keep food on door hook if paying online',
      isDefault: true
    },
    {
      id: 'addr-office',
      label: 'Office',
      fullAddress: 'Level 8, Concord Tower, Gulshan Avenue, Dhaka',
      building: 'Concord Tower',
      floor: '8th Floor',
      flat: 'Suite 804',
      landmark: 'Near Gulshan 2 Circle',
      lat: 23.7925,
      lng: 90.4140,
      deliveryInstructions: 'Call upon reaching reception gate',
      isDefault: false
    }
  ],
  favorites: ['WQE-RES-101', 'WQE-RES-102']
};

export const initialRiders: Rider[] = [
  {
    id: 'WQE-RDR-300789',
    userId: 'WQE-USR-RDR1',
    name: 'Tanvir Ahmed',
    phone: '+880 1845-678901',
    email: 'tanvir.rider@wafaquickeats.site.je',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    vehicleType: 'Bike',
    vehiclePlate: 'Dhaka Metro HA-42-9182',
    isOnline: true,
    status: 'verified',
    currentLat: 23.7482,
    currentLng: 90.3735,
    bearing: 142,
    speed: 28,
    accuracy: 4,
    lastGpsUpdate: new Date().toISOString(),
    rating: 4.9,
    totalDeliveries: 412,
    points: 820,
    todayEarnings: 1240,
    activeOrderId: 'WQE-ORD-2026-0042'
  },
  {
    id: 'WQE-RDR-300790',
    userId: 'WQE-USR-RDR2',
    name: 'Sajidul Karim',
    phone: '+880 1933-221100',
    email: 'sajidul.rider@wafaquickeats.site.je',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    vehicleType: 'Scooter',
    vehiclePlate: 'Dhaka Metro LA-11-2041',
    isOnline: true,
    status: 'verified',
    currentLat: 23.7440,
    currentLng: 90.3725,
    bearing: 85,
    speed: 0,
    accuracy: 3,
    lastGpsUpdate: new Date().toISOString(),
    rating: 4.8,
    totalDeliveries: 350,
    points: 690,
    todayEarnings: 980
  }
];

export const initialOrders: Order[] = [
  {
    id: 'WQE-ORD-2026-0042',
    invoiceNumber: 'WQE-INV-20260930-000125',
    customerId: 'WQE-CUS-100234',
    customerName: 'Md. Mehedi Hasan',
    customerPhone: '+880 1712-345678',
    restaurantId: 'WQE-RES-101',
    restaurantName: "Sultan's Dine",
    restaurantPhone: '+880 1711-234567',
    restaurantAddress: 'Road 27, Dhanmondi, Dhaka',
    restaurantLat: 23.7505,
    restaurantLng: 90.3742,
    riderId: 'WQE-RDR-300789',
    riderName: 'Tanvir Ahmed',
    riderPhone: '+880 1845-678901',
    riderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'on_the_way',
    items: [
      {
        id: 'item-1',
        foodId: 'WQE-FOD-001',
        name: 'Bashmati Mutton Kacchi Platter',
        nameBn: 'বাসমতী খাসির কাচ্চি প্ল্যাটার',
        quantity: 1,
        unitPrice: 440,
        totalPrice: 440,
        selectedVariant: { id: 'v-half', name: 'Half (1 Person)', priceDelta: 0 },
        selectedAddons: [{ id: 'a-borhani', name: 'Shahi Borhani (250ml)', price: 60 }],
        specialInstructions: 'Extra spicy tender mutton, please ensure hot packaging'
      }
    ],
    subtotal: 500,
    discount: 50,
    pointsDiscount: 20,
    deliveryFee: 40,
    serviceFee: 15,
    taxVat: 24,
    grandTotal: 509,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    deliveryAddress: {
      id: 'addr-home',
      label: 'Home',
      fullAddress: 'Apartment 4B, House 12, Road 7A, Dhanmondi R/A, Dhaka',
      building: 'Green Heritage',
      floor: '4th Floor',
      flat: '4B',
      landmark: 'Opposite to Ibn Sina Hospital',
      lat: 23.7460,
      lng: 90.3755
    },
    otp: '7392',
    estimatedPrepTime: 20,
    estimatedDeliveryMinutes: 12,
    distanceKm: 1.4,
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60000).toISOString(),
    timeline: [
      { status: 'placed', timestamp: new Date(Date.now() - 22 * 60000).toISOString(), note: 'Order placed & paid via bKash' },
      { status: 'restaurant_accepted', timestamp: new Date(Date.now() - 20 * 60000).toISOString(), note: "Sultan's Dine accepted order" },
      { status: 'preparing', timestamp: new Date(Date.now() - 18 * 60000).toISOString(), note: 'Kitchen preparing fresh kacchi platter' },
      { status: 'ready_for_pickup', timestamp: new Date(Date.now() - 8 * 60000).toISOString(), note: 'Packaging done, ready for rider' },
      { status: 'rider_assigned', timestamp: new Date(Date.now() - 7 * 60000).toISOString(), note: 'Rider Tanvir Ahmed assigned' },
      { status: 'pickup_completed', timestamp: new Date(Date.now() - 4 * 60000).toISOString(), note: 'Rider collected thermal food parcel' },
      { status: 'on_the_way', timestamp: new Date(Date.now() - 3 * 60000).toISOString(), note: 'GPS tracking active, heading to delivery location' }
    ]
  },
  {
    id: 'WQE-ORD-2026-0041',
    invoiceNumber: 'WQE-INV-20260930-000124',
    customerId: 'WQE-CUS-100234',
    customerName: 'Md. Mehedi Hasan',
    customerPhone: '+880 1712-345678',
    restaurantId: 'WQE-RES-102',
    restaurantName: 'Chillox Burgers',
    restaurantPhone: '+880 1819-987654',
    restaurantAddress: 'House 48, Road 11, Banani, Dhaka',
    restaurantLat: 23.7937,
    restaurantLng: 90.4066,
    riderId: 'WQE-RDR-300790',
    riderName: 'Sajidul Karim',
    riderPhone: '+880 1933-221100',
    riderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'delivered',
    items: [
      {
        id: 'item-2',
        foodId: 'WQE-FOD-003',
        name: 'Double Beef Naga Blast Burger',
        nameBn: 'ডাবল বিফ নাগা ব্লাস্ট বার্গার',
        quantity: 2,
        unitPrice: 340,
        totalPrice: 680
      }
    ],
    subtotal: 680,
    discount: 50,
    pointsDiscount: 0,
    deliveryFee: 45,
    serviceFee: 15,
    taxVat: 34,
    grandTotal: 724,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    deliveryAddress: {
      id: 'addr-home',
      label: 'Home',
      fullAddress: 'Apartment 4B, House 12, Road 7A, Dhanmondi R/A, Dhaka',
      lat: 23.7460,
      lng: 90.3755
    },
    otp: '4190',
    estimatedPrepTime: 18,
    estimatedDeliveryMinutes: 25,
    distanceKm: 4.8,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    timeline: [
      { status: 'placed', timestamp: new Date(Date.now() - 3 * 3600000).toISOString() },
      { status: 'delivered', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), note: 'Verified by OTP 4190' }
    ]
  }
];

export const initialRiderNotes: RiderNote[] = [
  {
    id: 'RN-101',
    orderId: 'WQE-ORD-2026-0042',
    riderId: 'WQE-RDR-300789',
    riderName: 'Tanvir Ahmed',
    title: 'Traffic slowdown at Dhanmondi 27 intersection',
    details: 'Heavy rickshaw congestion near Satmasjid intersection, re-routed through Road 8A.',
    category: 'Heavy Traffic',
    priority: 'medium',
    visibility: 'customer_visible',
    lat: 23.7495,
    lng: 90.3740,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  }
];

export const initialIncidents: DeliveryIncident[] = [
  {
    id: 'INC-201',
    orderId: 'WQE-ORD-2026-0040',
    riderId: 'WQE-RDR-300790',
    riderName: 'Sajidul Karim',
    incidentType: 'Road Blocked',
    description: 'Gas pipeline maintenance caused barricade on Road 10. Took alternate detour via Mirpur road.',
    lat: 23.7480,
    lng: 90.3720,
    status: 'resolved',
    adminNotes: 'Reviewed by admin, verified with traffic alert.',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

export const initialCoupons: Coupon[] = [
  {
    code: 'WAFA50',
    discountType: 'percentage',
    discountValue: 50,
    minOrder: 300,
    maxDiscount: 150,
    validUntil: '2026-12-31',
    usageCount: 1420,
    isActive: true,
    description: '50% OFF up to ৳150 on your favorite meals!',
    descriptionBn: 'পছন্দের খাবারে ৫০% ছাড় (সর্বোচ্চ ১৫০ টাকা পর্যন্ত)!'
  },
  {
    code: 'EATS100',
    discountType: 'fixed',
    discountValue: 100,
    minOrder: 400,
    validUntil: '2026-12-31',
    usageCount: 890,
    isActive: true,
    description: 'Flat ৳100 discount on orders above ৳400',
    descriptionBn: '৪০০ টাকার অর্ডারে নিশ্চিত ১০০ টাকা ছাড়!'
  },
  {
    code: 'FREEDEL',
    discountType: 'fixed',
    discountValue: 45,
    minOrder: 250,
    validUntil: '2026-12-31',
    usageCount: 2310,
    isActive: true,
    description: 'Free delivery voucher on delicious orders',
    descriptionBn: 'ফ্রি ডেলিভারি ভাউচার'
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'WQE-CUS-100234',
    title: 'Rider is on the way! ⚡',
    message: 'Tanvir Ahmed has picked up your food from Sultan\'s Dine. Track live on map.',
    type: 'order',
    deepLink: 'track-order',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 60000).toISOString()
  },
  {
    id: 'notif-2',
    userId: 'WQE-CUS-100234',
    title: 'Earned 20 Wafa Rewards Points! 🎁',
    message: 'Your previous order from Chillox was delivered successfully. 20 points credited.',
    type: 'points',
    deepLink: 'points',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  }
];

export const initialSupportTickets: SupportTicket[] = [
  {
    id: 'WQE-TCK-901',
    userId: 'WQE-CUS-100234',
    userName: 'Md. Mehedi Hasan',
    userRole: 'customer',
    orderId: 'WQE-ORD-2026-0041',
    category: 'Order Issue',
    subject: 'Packaging feedback for Chillox Burgers',
    description: 'The burger was fresh and hot, thanks for quick delivery!',
    priority: 'low',
    status: 'resolved',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'Md. Mehedi Hasan',
        message: 'Great service on the burger delivery, very satisfied with the speed.',
        createdAt: new Date(Date.now() - 100 * 60000).toISOString()
      },
      {
        id: 'msg-2',
        sender: 'support_admin',
        senderName: 'Wafa Care Team',
        message: 'Thank you for your valuable feedback! Enjoy your meal and keep using Wafa QuickEats ⚡',
        createdAt: new Date(Date.now() - 80 * 60000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 100 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 80 * 60000).toISOString()
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'AUD-501',
    actor: 'Super Admin (Mehedi364)',
    actorRole: 'super_admin',
    action: 'VERIFY_RESTAURANT',
    target: 'Restaurant',
    targetId: 'WQE-RES-101',
    newValue: 'verified',
    reason: 'Trade license & food safety inspection passed',
    ipAddress: '103.114.152.12',
    timestamp: '2026-09-30T10:15:00Z'
  },
  {
    id: 'AUD-502',
    actor: 'Super Admin (Mehedi364)',
    actorRole: 'super_admin',
    action: 'VERIFY_RIDER',
    target: 'Rider',
    targetId: 'WQE-RDR-300789',
    newValue: 'verified',
    reason: 'Driving license and NID verified with BRTA',
    ipAddress: '103.114.152.12',
    timestamp: '2026-09-30T10:45:00Z'
  },
  {
    id: 'AUD-503',
    actor: 'Tanvir Ahmed',
    actorRole: 'rider',
    action: 'GPS_BROADCAST_START',
    target: 'Delivery',
    targetId: 'WQE-ORD-2026-0042',
    newValue: 'tracking_active',
    ipAddress: '103.114.152.88',
    timestamp: '2026-09-30T12:12:00Z'
  }
];

export const initialAIProviders: AIProviderConfig[] = [
  {
    id: 'prov-gemini',
    name: 'Google Gemini (Native Build API)',
    category: 'FREE',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.5-flash',
    apiKey: '', // Handled server-side or customizable by admin
    priority: 1,
    isActive: true,
    timeoutMs: 8000,
    lastTestStatus: 'success',
    lastLatencyMs: 310,
    lastTestedAt: new Date().toISOString()
  },
  {
    id: 'prov-openrouter',
    name: 'OpenRouter (Open Source & Fast)',
    category: 'PREMIUM',
    endpoint: 'https://openrouter.ai/api/v1',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    apiKey: '',
    priority: 2,
    isActive: true,
    timeoutMs: 10000,
    lastTestStatus: 'untested'
  },
  {
    id: 'prov-groq',
    name: 'Groq LPUs',
    category: 'PREMIUM',
    endpoint: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    apiKey: '',
    priority: 3,
    isActive: false,
    timeoutMs: 5000,
    lastTestStatus: 'untested'
  },
  {
    id: 'prov-deepseek',
    name: 'DeepSeek Chat',
    category: 'PREMIUM',
    endpoint: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    apiKey: '',
    priority: 4,
    isActive: false,
    timeoutMs: 8000,
    lastTestStatus: 'untested'
  }
];

export const initialSystemHealth: SystemHealthStatus = {
  database: { status: 'healthy', latencyMs: 14, connection: 'MySQL 8.x PDO (Strict Mode)' },
  api: { status: 'healthy', uptimeSec: 48920 },
  storage: { status: 'healthy', diskUsedMb: 142, quotaMb: 5120 },
  uploads: { status: 'healthy', mimeChecking: true },
  gps: { status: 'healthy', activeBroadcastingRiders: 2 },
  notifications: { status: 'healthy', queueSize: 0 },
  ai: { status: 'healthy', activeProvider: 'Google Gemini (Native Build API)' },
  server: { phpVersion: '8.3.6', nodeVersion: 'v22.x', environment: 'Production / cPanel Ready', https: true }
};
