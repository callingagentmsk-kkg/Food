-- ============================================================
-- SATYAM GOLD - SUPABASE COMPLETE SCHEMA
-- Run this entire SQL in Supabase SQL Editor
-- Project: https://ceicmmeeuphycsmvifak.supabase.co
-- ============================================================

-- 1. SITE SETTINGS (logo, colors, contact info, social links, footer text, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  mrp NUMERIC(10,2) NOT NULL DEFAULT 0,           -- MRP / Print Price
  price NUMERIC(10,2) NOT NULL DEFAULT 0,          -- Selling / Current Price
  unit TEXT DEFAULT 'kg',
  weight TEXT DEFAULT '1 kg',
  image_url TEXT,
  category TEXT DEFAULT 'Flour',
  in_stock BOOLEAN DEFAULT TRUE,
  loved_by_base INT DEFAULT 0,                     -- Admin-set base count
  loved_by_real INT DEFAULT 0,                     -- Real clicks added by users
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMERS / USERS
CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  default_address TEXT,
  default_pincode TEXT,
  default_ward TEXT,
  default_alt_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCT LOVES (track who loved what so click toggles correctly)
CREATE TABLE IF NOT EXISTS product_loves (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  customer_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, customer_phone)
);

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  address TEXT,
  pincode TEXT,
  ward_no TEXT,
  alt_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) DEFAULT 0,
  shipping NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'COD',
  payment_status TEXT DEFAULT 'Pending',
  status TEXT DEFAULT 'Pending',
  -- Statuses: Pending, Accepted, Rejected, Packed, Shipped, Out for Delivery, Delivered, Cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HERO SLIDES
CREATE TABLE IF NOT EXISTS hero_slides (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  button_text TEXT DEFAULT 'Shop Now',
  button_link TEXT DEFAULT '#products',
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. OTP STORE (temporary)
CREATE TABLE IF NOT EXISTS otp_codes (
  id BIGSERIAL PRIMARY KEY,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. POLICY PAGES (Privacy, Terms, Returns, Shipping, Refund, About)
CREATE TABLE IF NOT EXISTS policy_pages (
  id BIGSERIAL PRIMARY KEY,
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (allow public read & insert for anon key)
-- ============================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_loves ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for everyone
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT USING (true);
CREATE POLICY "public_read_hero" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "public_read_policies" ON policy_pages FOR SELECT USING (true);

-- Public write access (anon key) - used by frontend (since this is admin via anon key)
CREATE POLICY "public_all_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_hero" ON hero_slides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_policies" ON policy_pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_loves" ON product_loves FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_otp" ON otp_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_contact" ON contact_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_admin" ON admin_users FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- DEFAULT DATA
-- ============================================================

-- Default Admin (username: 8252487551, password: 8252487551)
INSERT INTO admin_users (username, password) VALUES
  ('8252487551', '8252487551')
ON CONFLICT (username) DO NOTHING;

-- Default Site Settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('site_name', 'Satyam Gold'),
  ('site_logo', 'https://base44.app/api/apps/68a375197577ce82d3f4980e/files/04925dbc9_100012467.png'),
  ('hero_tagline', 'Pure & Tasty Premium Quality Food Products'),
  ('primary_color', '#F97316'),
  ('phone_number', '8252487551'),
  ('whatsapp_number', '8252487551'),
  ('email_address', 'satyamgold@gmail.com'),
  ('business_address', 'Vidhyadhar, Khagaria, Bihar - 851204'),
  ('legal_entity', 'Satyam Gold is a brand owned and operated by Satyam Food Product'),
  ('facebook_url', 'https://facebook.com'),
  ('instagram_url', 'https://instagram.com'),
  ('youtube_url', ''),
  ('whatsapp_chat_url', 'https://wa.me/918252487551'),
  ('footer_text', '© 2026 Satyam Gold. All rights reserved.'),
  ('cashfree_app_id', ''),
  ('cashfree_secret', ''),
  ('cashfree_mode', 'TEST')
ON CONFLICT (setting_key) DO NOTHING;

-- Default Hero Slide
INSERT INTO hero_slides (image_url, title, subtitle, button_text, button_link, active, sort_order) VALUES
  ('https://base44.app/api/apps/68a375197577ce82d3f4980e/files/6336e6cce_100016130.png',
   'GOLD HARVEST WHEAT FLOUR',
   'Grown Without Chemicals. Packed With Goodness',
   'Shop Now', '#products', TRUE, 1)
ON CONFLICT DO NOTHING;

-- Sample Products
INSERT INTO products (name, description, mrp, price, unit, weight, image_url, category, in_stock, loved_by_base, sort_order) VALUES
  ('Atta', 'सीधे प्रकृति से। हमारे आटे में कोई प्रिजर्वेटिव या मिलावट नहीं है। यह पाचन में मदद करता है और आपके परिवार के स्वास्थ्य का ध्यान रखता है।',
   108, 100, 'kg', '1 kg',
   'https://base44.app/api/apps/68a375197577ce82d3f4980e/files/6336e6cce_100016130.png',
   'Flour', FALSE, 1500, 1),
  ('Atta', 'खास शरबती गेहूं से बना! यह आटा रोटियों को मीठा और खुशबूदार बनाता है। हर रोटी एक लाजवाब अनुभव।',
   194, 180, 'kg', '1 kg',
   'https://base44.app/api/apps/68a375197577ce82d3f4980e/files/6336e6cce_100016130.png',
   'Flour', TRUE, 2300, 2),
  ('Sattu', 'Premium quality sattu made with traditional methods, full of protein and energy.',
   80, 70, 'kg', '1 kg',
   'https://base44.app/api/apps/68a375197577ce82d3f4980e/files/6336e6cce_100016130.png',
   'Sattu', TRUE, 850, 3),
  ('Besan', 'Pure chana besan, finely ground for the perfect taste in pakoras and sweets.',
   120, 110, 'kg', '1 kg',
   'https://base44.app/api/apps/68a375197577ce82d3f4980e/files/6336e6cce_100016130.png',
   'Besan', TRUE, 640, 4)
ON CONFLICT DO NOTHING;

-- Default Policy Pages
INSERT INTO policy_pages (page_key, title, content) VALUES
('about',
 'About Us',
 '<h2>About Satyam Gold</h2><p><strong>Satyam Gold</strong> is a brand owned and operated by <strong>Satyam Food Product</strong>. We are committed to delivering pure, healthy and authentic Indian food products like Atta, Sattu, Besan and more, directly from nature to your kitchen.</p><p>Our products are made with traditional methods, free from preservatives and adulteration. We focus on family health and the original taste of every grain.</p><p><strong>Address:</strong> Vidhyadhar, Khagaria, Bihar - 851204<br><strong>Phone:</strong> 8252487551</p>'),

('privacy',
 'Privacy Policy',
 '<h2>Privacy Policy</h2><p>At Satyam Gold (Satyam Food Product), we respect your privacy. This policy explains what information we collect and how we use it.</p><h3>Information We Collect</h3><ul><li>Name, mobile number, email and address provided during signup or checkout.</li><li>Order history and product preferences.</li><li>Cookies and basic usage analytics.</li></ul><h3>How We Use Your Information</h3><ul><li>To process and deliver your orders.</li><li>To send order updates via SMS, WhatsApp or email.</li><li>To improve our products and customer service.</li></ul><h3>Sharing</h3><p>We do not sell your data. We share information only with delivery partners and payment gateways as needed to fulfil your order.</p><h3>Contact</h3><p>For privacy questions, contact us at 8252487551.</p>'),

('terms',
 'Terms & Conditions',
 '<h2>Terms & Conditions</h2><p>By using this website you agree to the following terms.</p><ol><li>All products are subject to availability.</li><li>Prices and offers may change without prior notice.</li><li>Orders may be cancelled by us in case of stock or pricing errors.</li><li>Payment must be completed at the time of placing the order or on delivery (COD), as selected.</li><li>Any misuse of the website is strictly prohibited.</li></ol><p>Continued use of the site means you accept these terms.</p>'),

('return',
 'Return Policy',
 '<h2>Return Policy</h2><p>We accept returns under the following conditions:</p><ul><li>The product is damaged, defective or significantly different from what was ordered.</li><li>Return request is raised within <strong>48 hours</strong> of delivery.</li><li>Product is unused and in its original packaging.</li></ul><p>To raise a return, call <strong>8252487551</strong> with your order number and a clear photo of the issue.</p>'),

('refund',
 'Refund and Cancellation Policy',
 '<h2>Refund and Cancellation Policy</h2><h3>Cancellation</h3><p>You can cancel an order before it is shipped. Once shipped, cancellation is not possible.</p><h3>Refund</h3><ul><li>Approved refunds for online payments are credited back to the original payment method within <strong>5–7 working days</strong>.</li><li>For COD orders, refunds (if applicable) are issued via UPI/bank transfer.</li></ul><p>For refund queries call 8252487551.</p>'),

('shipping',
 'Shipping Policy',
 '<h2>Shipping Policy</h2><ul><li>We deliver to most pincodes across India.</li><li>Standard delivery takes <strong>3–7 working days</strong> after dispatch.</li><li>Order tracking is available on the website under "Check Order Status".</li><li>Shipping charges (if any) are shown at checkout.</li></ul><p>For delivery questions contact 8252487551.</p>'),

('contact',
 'Contact Us',
 '<h2>Contact Us</h2><p><strong>Legal Entity:</strong> Satyam Gold is a brand owned and operated by Satyam Food Product.</p><p><strong>Address:</strong> Vidhyadhar, Khagaria, Bihar - 851204<br><strong>Phone:</strong> 8252487551<br><strong>Email:</strong> satyamgold@gmail.com</p><p>You can also contact us via the website contact form or WhatsApp.</p>')
ON CONFLICT (page_key) DO NOTHING;

-- ============================================================
-- DONE
-- ============================================================
