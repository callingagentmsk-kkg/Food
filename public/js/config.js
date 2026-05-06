// ============================================================
// SATYAM GOLD - Global Configuration
// ============================================================

window.SUPABASE_CONFIG = {
  url: 'https://ceicmmeeuphycsmvifak.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaWNtbWVldXBoeWNzbXZpZmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODM3OTUsImV4cCI6MjA5MzY1OTc5NX0.IuhKlKffLXP--l8sSONXmrg3KA0uzKexMj_bRRsbm2E'
};

// Initialize Supabase client (loaded via CDN in HTML)
window.sb = window.supabase.createClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.anonKey
);

// ----- Helpers -----
window.SG = {
  // Format big numbers like 1k, 2k, 1.5k
  formatLoved(n) {
    n = Number(n) || 0;
    if (n < 1000) return String(n);
    if (n < 10000) {
      const v = n / 1000;
      // Always floor to 1 decimal but only show .x if not .0
      const fixed = Math.floor(v * 10) / 10;
      return (fixed % 1 === 0 ? fixed.toFixed(0) : fixed.toFixed(1)) + 'k';
    }
    if (n < 1000000) return Math.floor(n / 1000) + 'k';
    return (Math.floor(n / 100000) / 10) + 'M';
  },

  calcDiscount(mrp, price) {
    mrp = Number(mrp) || 0;
    price = Number(price) || 0;
    if (mrp <= 0 || price <= 0 || price >= mrp) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  },

  money(v) {
    return '₹' + (Number(v) || 0).toFixed(0);
  },

  // Customer session in localStorage
  getCustomer() {
    try { return JSON.parse(localStorage.getItem('sg_customer') || 'null'); }
    catch (_) { return null; }
  },
  setCustomer(c) {
    if (c) localStorage.setItem('sg_customer', JSON.stringify(c));
    else localStorage.removeItem('sg_customer');
    document.dispatchEvent(new CustomEvent('sg:auth-changed'));
  },

  // Cart in localStorage
  getCart() {
    try { return JSON.parse(localStorage.getItem('sg_cart') || '[]'); }
    catch (_) { return []; }
  },
  setCart(items) {
    localStorage.setItem('sg_cart', JSON.stringify(items || []));
    document.dispatchEvent(new CustomEvent('sg:cart-changed'));
  },
  addToCart(product, qty = 1) {
    const cart = SG.getCart();
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx >= 0) {
      cart[idx].qty = (cart[idx].qty || 1) + qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        mrp: Number(product.mrp),
        weight: product.weight || '1 kg',
        image_url: product.image_url,
        qty: qty
      });
    }
    SG.setCart(cart);
  },
  removeFromCart(id) {
    SG.setCart(SG.getCart().filter(i => i.id !== id));
  },
  updateCartQty(id, qty) {
    const cart = SG.getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, qty);
      SG.setCart(cart);
    }
  },
  cartCount() {
    return SG.getCart().reduce((s, i) => s + (i.qty || 1), 0);
  },
  cartTotal() {
    return SG.getCart().reduce((s, i) => s + (Number(i.price) * (i.qty || 1)), 0);
  },

  // Toast helper
  toast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = `sg-toast sg-toast-${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2800);
  }
};
