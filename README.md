# 🌾 Satyam Gold - E-commerce Website (v2.0)

**Pure & Tasty Premium Quality Food Products** — Complete e-commerce solution with **Supabase backend**, full admin panel, OTP login, order tracking, and policy pages.

---

## 🚀 Live URLs

- **Website**: Run locally with `npm run dev` → http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/
- **GitHub**: https://github.com/callingagentmsk-kkg/Food

## 🔑 Default Credentials

- **Admin Username**: `8252487551`
- **Admin Password**: `8252487551`
  *(Change from Admin → Change Password after first login)*

---

## 📋 SETUP — STEP 1: Run Supabase SQL

1. Go to your Supabase project: https://ceicmmeeuphycsmvifak.supabase.co
2. Open **SQL Editor** → **New query**
3. Open the file `supabase/schema.sql` from this repo
4. **Copy ALL the SQL content** and paste it into the SQL Editor
5. Click **Run**

This creates 10 tables, RLS policies, default admin user, sample products, hero slide, and all 7 policy pages.

## 📋 SETUP — STEP 2: Anon Key (already configured)

The anon key is already wired in `public/js/config.js`:

```js
window.SUPABASE_CONFIG = {
  url: 'https://ceicmmeeuphycsmvifak.supabase.co',
  anonKey: 'eyJhbGciOiJI...IuhKlKffLXP--l8sSONXmrg3KA0uzKexMj_bRRsbm2E'
};
```

If you need to switch projects later, just edit those two values.

## 📋 SETUP — STEP 3: Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## ✨ Features Implemented

### 🛍️ Customer Website
- ✅ **Responsive product grid** — 2 columns on mobile, auto-fit on desktop (matches reference image)
- ✅ **Auto discount %** badge — calculates from MRP & Selling Price (e.g. "7% OFF")
- ✅ **Loved by counter** — shows as `1k`, `2k`, `1.5k` (real number stored in DB; formatted display)
- ✅ **Heart toggle** — login required, real DB tracking via `product_loves` table
- ✅ **Bulk Order WhatsApp** — works for in-stock AND out-of-stock products
- ✅ **Out of Stock** state with disabled button
- ✅ **Phone OTP login** with welcome popup, logo, "Welcome to Satyam Gold"
  - First-time users → Name registration step
  - Returning users → Auto-login with saved data + order history
- ✅ **Real Add-to-Cart drawer** with qty +/-, remove, total
- ✅ **Real e-commerce Checkout** — Name, Phone, Alt Phone, Address, Pincode, Ward No.
  - Saves customer's default address → next time auto-filled
  - "Use saved address" checkbox
  - COD active; Cashfree placeholder ready
- ✅ **Order Tracking page** with animated step-by-step tracker
  - Pending → Accepted → Packed → Shipped → Out for Delivery → Delivered
  - Track by order number, OR view all orders after login
- ✅ **Profile page** — Edit name, email, default address
- ✅ **Hero slider** — auto-rotating, dots navigation
- ✅ **WhatsApp floating button**
- ✅ **Contact form** with DB storage
- ✅ **Footer** with all policy links and social icons

### 🛡️ Admin Panel
- ✅ **Dashboard** with KPIs (Total Orders, Pending, Revenue, Customers) + Recent Orders
- ✅ **Orders Management**
  - Filter by status, search by phone/order #
  - View full order details
  - **Update status** (Pending / Accepted / Rejected / Packed / Shipped / Out for Delivery / Delivered / Cancelled)
  - Add admin notes
- ✅ **Products CRUD**
  - **MRP (Print Price) + Selling Price fields** → discount % auto-calculated
  - **Loved by base count** field (1500 → "1.5k" displayed)
  - In-stock toggle, sort order, image URL
- ✅ **Customers** list with order count + total spent
- ✅ **Hero Slides** CRUD (image, title, subtitle, button text/link, sort, active)
- ✅ **Policy Pages editor** (HTML editor for all 7 legal pages)
- ✅ **Site Settings**
  - Branding: Logo, site name, hero tagline, footer text
  - Contact: Phone, WhatsApp, Email, Address, Legal Entity Name
  - Social links: Facebook, Instagram, YouTube, WhatsApp Chat URL
  - **Cashfree gateway** keys (App ID, Secret, Mode TEST/PROD)
- ✅ **Contact Messages** inbox
- ✅ **Change Username/Password**

### 📄 Legal & Policy Pages (all linked, all editable from admin)
- `/pages/privacy.html` — Privacy Policy
- `/pages/terms.html` — Terms & Conditions
- `/pages/return.html` — Return Policy
- `/pages/refund.html` — Refund and Cancellation Policy
- `/pages/shipping.html` — Shipping Policy
- `/pages/about.html` — About Us *(includes Legal Entity Name: Satyam Gold is a brand owned and operated by Satyam Food Product)*
- `/pages/contact.html` — Contact Us *(8252487551, Vidhyadhar, Khagaria 851204)*

These are **WhatsApp / Meta compliant** — all required pages with editable HTML content.

---

## 🗂️ Database Schema (Supabase)

| Table | Purpose |
|-------|---------|
| `site_settings` | Logo, colors, contact info, social links, Cashfree keys |
| `admin_users` | Admin login credentials |
| `products` | Catalog with MRP, price, stock, loved_by counters |
| `customers` | User profiles (phone, name, default address) |
| `product_loves` | Tracks which user loved which product |
| `orders` | All orders with items JSONB, status, payment |
| `hero_slides` | Homepage slider |
| `otp_codes` | Temporary OTP storage for login |
| `contact_messages` | Contact form submissions |
| `policy_pages` | Privacy/Terms/Returns/etc HTML content |

All tables have **RLS enabled** with policies allowing the anon key to read/write (since this is a single-tenant admin-managed system).

---

## 💳 Payment Gateway

- ✅ **COD (Cash on Delivery)** — Fully working
- 🔧 **Cashfree** — Keys can be saved in admin panel. Live activation requires a Supabase Edge Function (recommended for security — secret key must not be exposed in frontend). Skeleton ready in admin → Settings → Payment Gateway.

To activate Cashfree live: deploy a Supabase Edge Function that creates payment orders using your secret key, and update the checkout flow to call it.

---

## 🔐 OTP Login Note

Currently OTP is generated in-browser and stored in Supabase (visible in console + toast for testing). To make it real SMS:
1. Create a Supabase Edge Function that calls MSG91 / Cashfree SMS / Twilio
2. Replace the `sendOTP` function in `public/js/auth.js` to call your Edge Function instead

The verification flow already uses real Supabase storage and works end-to-end.

---

## 🎨 Mobile Responsive

The product grid shows **2 columns on mobile** (matching your reference image) and auto-fits on desktop. Tested down to 380px viewport width.

---

## 📞 Contact (Site)

- **Phone**: 8252487551
- **Address**: Vidhyadhar, Khagaria 851204
- **Email**: satyamgold@gmail.com (editable in admin)

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML / CSS / JavaScript (no framework needed — fast & lightweight)
- **Backend**: Supabase (PostgreSQL + Auth + RLS + REST API via supabase-js)
- **Hosting**: Any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages)
- **Auth**: Custom Phone OTP via Supabase tables

---

## 📦 Deployment

This is a **pure static site**, deploy `public/` folder to any host:

```bash
# Cloudflare Pages
npx wrangler pages deploy public

# Netlify
netlify deploy --prod --dir=public

# Vercel
vercel --prod public

# GitHub Pages
# Just push and enable Pages on /public folder
```

---

## 📝 Changelog v2.0 (Major Rewrite)

- 🔥 **Migrated from Cloudflare D1 → Supabase** (as requested)
- 🔥 **Removed all Cloudflare Functions / Wrangler dependencies**
- 🆕 Built complete admin panel with all CRUD operations
- 🆕 Real OTP login flow with name registration + login history
- 🆕 Real e-commerce checkout with saved addresses
- 🆕 Order tracking with animated status flow
- 🆕 7 policy pages — all editable from admin
- 🆕 Auto discount % calculation
- 🆕 Loved-by counter with 1k/2k formatting
- 🆕 Mobile responsive product grid (matches reference design)
- 🆕 Cashfree gateway placeholder + COD working
- 🆕 Logo, branding, footer all editable from admin

---

© 2026 Satyam Gold — Brand owned and operated by Satyam Food Product.
