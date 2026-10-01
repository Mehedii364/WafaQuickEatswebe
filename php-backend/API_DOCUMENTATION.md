# 📱 Wafa QuickEats ⚡ - REST API Documentation for Android App

**Brand:** Wafa Zone by Mehedi364  
**Developer:** Md. Mehedi Hasan (Mehedi364)  
**Base URL:** `https://wafaquickeats.site.je/api`  

The same backend and database architecture is shared seamlessly between the web application and the Android app (Kotlin/Retrofit).

---

## 1. Response Envelope Format

All responses follow the unified JSON structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "errors": [],
  "pagination": {}
}
```

---

## 2. Authentication

### `POST /auth/login.php`
Login with email or phone number.

**Request:**
```json
{
  "email_or_phone": "customer@wafaquickeats.site.je",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "WQE-USR-CUS01",
      "name": "Md. Mehedi Hasan",
      "email": "customer@wafaquickeats.site.je",
      "phone": "+8801712345678",
      "role": "customer"
    },
    "token": "eyJhbGciOiJI..."
  }
}
```

---

## 3. Live GPS Fleet Tracking

### `POST /gps/update.php`
Broadcasting live rider location (Called by Rider Android App background location service).

**Headers:**
`Authorization: Bearer <rider_token>`

**Request:**
```json
{
  "latitude": 23.7482,
  "longitude": 90.3735,
  "speed": 28,
  "bearing": 142,
  "accuracy": 4,
  "order_id": "WQE-ORD-2026-0042"
}
```

### `GET /gps/track.php?order_id=WQE-ORD-2026-0042`
Fetched by Customer and Admin to render the live road path, rider speed, heading, and delivery ETA.

---

## 4. Invoices & Billing

### `GET /invoices/get.php?order_id=WQE-ORD-2026-0042`
Returns immutable, tax-compliant invoice details including restaurant VAT number, item breakdown, payment status, and grand total in ৳ BDT.
