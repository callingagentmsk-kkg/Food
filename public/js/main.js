// ============================================================
// SATYAM GOLD - Main Frontend Logic (Professional Edition)
// ============================================================

let _allProducts = [];
let _myLoves = new Set();

// ----- Header -----
async function renderHeader() {
  const settings = await getCachedSettings();
  const customer = SG.getCustomer();
  const cartCount = SG.cartCount();

  const header = document.getElementById('sgHeader');
  if (!header) return;

  header.innerHTML = `
    <div class="sg-header-inner">
      <a href="/" class="sg-logo">
        ${settings.site_logo ? `<img src="${settings.site_logo}" alt="${settings.site_name || 'Satyam Gold'}">` : ''}
        <span class="name">${settings.site_name || 'Satyam Gold'}</span>
      </a>
      <nav class="sg-nav">
        <a href="/">Home</a>
        <a href="/#products">Products</a>
        <a href="/pages/track.html">Track Order</a>
        <a href="/#contact-us">Contact</a>
        <a href="/pages/about.html">About</a>
        <button class="icon-btn keep" id="cartBtn" title="Cart">
          ${SGIcons.cart}
          ${cartCount > 0 ? `<span class="badge">${cartCount}</span>` : ''}
        </button>
        ${customer
          ? `<button class="keep" id="profileBtn" title="${customer.name}" style="display:inline-flex;align-items:center;gap:6px">${SGIcons.user} ${(customer.name || 'You').split(' ')[0]}</button>`
          : `<button class="keep" id="loginBtn">Login</button>`
        }
      </nav>
    </div>
  `;

  document.getElementById('cartBtn').onclick = openCartDrawer;
  if (customer) {
    document.getElementById('profileBtn').onclick = openProfileMenu;
  } else {
    document.getElementById('loginBtn').onclick = () => openLoginModal();
  }
}

// ----- Contact Section (above footer) -----
async function renderContactSection() {
  const settings = await getCachedSettings();
  const wrap = document.getElementById('sgContact');
  if (!wrap) return;
  const phone = settings.phone_number || '8252487551';
  const wa = (settings.whatsapp_number || phone).replace(/\D/g, '');
  const email = settings.email_address || 'satyamgold@gmail.com';
  const addr = settings.business_address || 'Bidyadhar, Khagaria, Bihar - 851204';

  wrap.innerHTML = `
    <div class="sg-contact-inner">
      <div class="sg-contact-title">
        <h2>Contact Us</h2>
        <p>Get in touch with us for any queries or support</p>
      </div>
      <div class="sg-contact-grid">
        <div class="sg-contact-info">
          <h3>Get in Touch</h3>
          <div class="info-row">
            <span class="ico phone-ico">${SGIcons.phone}</span>
            <a href="tel:${phone}">${phone}</a>
          </div>
          <div class="info-row">
            <span class="ico wa-ico">${SGIcons.whatsapp}</span>
            <a href="https://wa.me/91${wa}" target="_blank">${wa}</a>
          </div>
          <div class="info-row">
            <span class="ico mail-ico">${SGIcons.mail}</span>
            <a href="mailto:${email}">${email}</a>
          </div>
          <div class="info-row">
            <span class="ico pin-ico">${SGIcons.pin}</span>
            <span>${escapeHtml(addr)}</span>
          </div>
        </div>
        <div class="sg-contact-form">
          <h3>Quick Order</h3>
          <input id="qoName" placeholder="Your Name">
          <input id="qoPhone" placeholder="Phone Number" maxlength="10">
          <textarea id="qoMsg" rows="4" placeholder="Your Requirements"></textarea>
          <button id="qoSend">Send Message</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('qoSend').onclick = async () => {
    const name = document.getElementById('qoName').value.trim();
    const ph = document.getElementById('qoPhone').value.trim();
    const msg = document.getElementById('qoMsg').value.trim();
    if (!name || !ph || !msg) { SG.toast('Please fill all fields', 'error'); return; }
    const btn = document.getElementById('qoSend');
    btn.disabled = true; btn.innerHTML = '<span class="sg-loader"></span> Sending...';
    const { error } = await sb.from('contact_messages').insert({ name, phone: ph, message: msg });
    btn.disabled = false; btn.textContent = 'Send Message';
    if (error) { SG.toast(error.message, 'error'); return; }
    SG.toast('Message sent! We will contact you soon.', 'success');
    document.getElementById('qoName').value = '';
    document.getElementById('qoPhone').value = '';
    document.getElementById('qoMsg').value = '';
  };
}

// ----- Map Section -----
async function renderMap() {
  const settings = await getCachedSettings();
  const wrap = document.getElementById('sgMap');
  if (!wrap) return;
  const mapUrl = settings.map_embed_url ||
    'https://www.google.com/maps?q=Khagaria,Bihar,India&output=embed';
  const addr = settings.business_address || 'Bidyadhar, Khagaria, Bihar - 851204';
  wrap.innerHTML = `
    <div class="sg-map-title">
      <h2>📍 Find Us</h2>
      <p>${escapeHtml(addr)}</p>
    </div>
    <div class="sg-map-wrap">
      <iframe src="${mapUrl}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  `;
}

// ----- Footer (Professional) -----
async function renderFooter() {
  const settings = await getCachedSettings();
  const footer = document.getElementById('sgFooter');
  if (!footer) return;
  const phone = settings.phone_number || '8252487551';
  const wa = (settings.whatsapp_number || phone).replace(/\D/g, '');
  const email = settings.email_address || 'satyamgold@gmail.com';
  const addr = settings.business_address || 'Bidyadhar, Khagaria, Bihar - 851204';

  footer.innerHTML = `
    <div class="sg-footer-inner">
      <div class="brand-block">
        <div class="logo-row">
          ${settings.site_logo ? `<img src="${settings.site_logo}" alt="logo">` : ''}
          <span class="nm">${settings.site_name || 'Satyam Gold'}</span>
        </div>
        <p>${settings.legal_entity || 'Satyam Gold is a brand owned and operated by Satyam Food Product'}.</p>
        <p style="margin-top:8px;font-size:12px">${settings.footer_tagline || 'Pure & tasty premium quality food products, delivered fresh.'}</p>
        <div class="socials">
          <a href="https://wa.me/91${wa}" target="_blank" class="wa" aria-label="WhatsApp">${SGIcons.whatsapp}</a>
          ${settings.facebook_url ? `<a href="${settings.facebook_url}" target="_blank" class="fb" aria-label="Facebook">${SGIcons.facebook}</a>` : ''}
          ${settings.instagram_url ? `<a href="${settings.instagram_url}" target="_blank" class="ig" aria-label="Instagram">${SGIcons.instagram}</a>` : ''}
          ${settings.youtube_url ? `<a href="${settings.youtube_url}" target="_blank" class="yt" aria-label="YouTube">${SGIcons.youtube}</a>` : ''}
        </div>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/#products">Products</a></li>
          <li><a href="/pages/track.html">Track Order</a></li>
          <li><a href="/pages/about.html">About Us</a></li>
          <li><a href="/pages/contact.html">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h4>Policies</h4>
        <ul>
          <li><a href="/pages/privacy.html">Privacy Policy</a></li>
          <li><a href="/pages/terms.html">Terms &amp; Conditions</a></li>
          <li><a href="/pages/return.html">Return Policy</a></li>
          <li><a href="/pages/refund.html">Refund Policy</a></li>
          <li><a href="/pages/shipping.html">Shipping Policy</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <div class="contact-row"><span class="ico-circle">${SGIcons.phone}</span>
          <span><a href="tel:${phone}"><b>${phone}</b></a><br>
          <small style="color:#78716c">Mobile / Call</small></span></div>
        <div class="contact-row"><span class="ico-circle">${SGIcons.whatsapp}</span>
          <span><a href="https://wa.me/91${wa}" target="_blank"><b>WhatsApp ${wa}</b></a><br>
          <small style="color:#78716c">Tap to chat 24×7</small></span></div>
        <div class="contact-row"><span class="ico-circle">${SGIcons.mail}</span><a href="mailto:${email}">${email}</a></div>
        <div class="contact-row"><span class="ico-circle">${SGIcons.pin}</span><span>${escapeHtml(addr)}</span></div>
      </div>
    </div>
    <div class="sg-footer-bottom">
      <div>${settings.footer_text || '© 2026 Satyam Gold. All rights reserved.'}</div>
      <div class="made-with">Brand owned & operated by <strong>Satyam Food Product</strong> · Made with ❤️ in Bihar</div>
    </div>
  `;
}

// ----- Hero Slider -----
async function renderHero() {
  const wrap = document.getElementById('sgHero');
  if (!wrap) return;
  const { data: slides } = await sb
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (!slides || slides.length === 0) { wrap.style.display = 'none'; return; }

  wrap.innerHTML = `
    <div class="slides">
      ${slides.map((s, i) => `
        <div class="slide ${i === 0 ? 'active' : ''}" style="background-image:url('${s.image_url}')">
          <h1>${escapeHtml(s.title || '')}</h1>
          <p>${escapeHtml(s.subtitle || '')}</p>
          ${s.button_text ? `<a class="cta" href="${s.button_link || '#products'}">${escapeHtml(s.button_text)}</a>` : ''}
        </div>
      `).join('')}
      <div class="dots">
        ${slides.map((_, i) => `<span class="${i === 0 ? 'active' : ''}" data-i="${i}"></span>`).join('')}
      </div>
    </div>
  `;

  const slideEls = wrap.querySelectorAll('.slide');
  const dotEls = wrap.querySelectorAll('.dots span');
  let idx = 0;
  const goTo = (i) => {
    slideEls.forEach((s, k) => s.classList.toggle('active', k === i));
    dotEls.forEach((d, k) => d.classList.toggle('active', k === i));
    idx = i;
  };
  dotEls.forEach((d, k) => d.onclick = () => goTo(k));
  if (slides.length > 1) setInterval(() => goTo((idx + 1) % slides.length), 5000);
}

// ----- Products -----
async function loadMyLoves() {
  const c = SG.getCustomer();
  _myLoves = new Set();
  if (!c) return;
  const { data } = await sb.from('product_loves').select('product_id').eq('customer_phone', c.phone);
  (data || []).forEach(r => _myLoves.add(r.product_id));
}

function productCardHTML(p) {
  const discount = SG.calcDiscount(p.mrp, p.price);
  const totalLoved = (Number(p.loved_by_base) || 0) + (Number(p.loved_by_real) || 0);
  const lovedFmt = SG.formatLoved(totalLoved);
  const loved = _myLoves.has(p.id);
  const inStock = p.in_stock !== false;

  return `
    <div class="sg-card" data-id="${p.id}">
      <div class="img-wrap">
        ${discount > 0 ? `<span class="badge-discount">${discount}% OFF</span>` : ''}
        <img class="product-img" src="${p.image_url || ''}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.style.opacity=0.3">
      </div>
      <div class="body">
        <div class="name">${escapeHtml(p.name)}</div>
        <div class="desc">${escapeHtml(p.description || '')}</div>
        <div class="weight">${escapeHtml(p.weight || '1 kg')}</div>
        <div class="price-row">
          <span class="price">${SG.money(p.price)}</span>
          ${p.mrp > p.price ? `<span class="mrp">${SG.money(p.mrp)}</span>` : ''}
        </div>
        <div class="loved ${loved ? 'active' : ''}" data-action="love">
          <span class="heart">${loved ? SGIcons.heart : SGIcons.heartOutline}</span>
          <span>Loved by ${lovedFmt}</span>
        </div>
        <div class="actions">
          ${inStock ? `
            <button class="sg-btn sg-btn-primary" data-action="add">ADD TO CART</button>
            <button class="sg-btn sg-btn-outline" data-action="buy">BUY NOW</button>
          ` : `
            <button class="sg-btn sg-btn-disabled" disabled>OUT OF STOCK</button>
          `}
        </div>
        <button class="sg-btn sg-btn-success bulk" data-action="bulk">${SGIcons.whatsapp} BULK ORDER</button>
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

async function renderProducts() {
  const grid = document.getElementById('sgProducts');
  if (!grid) return;

  grid.innerHTML = Array(4).fill(0).map(() =>
    `<div class="sg-card"><div class="img-wrap skeleton" style="aspect-ratio:1/1"></div>
     <div class="body"><div class="skeleton" style="height:18px;width:60%"></div>
     <div class="skeleton" style="height:14px;width:90%;margin-top:6px"></div></div></div>`
  ).join('');

  const { data: products, error } = await sb
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) { console.error(error); grid.innerHTML = '<p>Failed to load products.</p>'; return; }
  _allProducts = products || [];
  await loadMyLoves();

  if (_allProducts.length === 0) {
    grid.innerHTML = '<div class="empty"><p>No products available yet.</p></div>';
    return;
  }
  grid.innerHTML = _allProducts.map(productCardHTML).join('');

  grid.addEventListener('click', onProductClick);
}

async function onProductClick(e) {
  const card = e.target.closest('.sg-card');
  if (!card) return;
  const id = Number(card.dataset.id);
  const product = _allProducts.find(p => p.id === id);
  if (!product) return;

  const action = e.target.closest('[data-action]')?.dataset.action;
  if (!action) return;

  if (action === 'add') {
    SG.addToCart(product, 1);
    SG.toast('Added to cart', 'success');
  } else if (action === 'buy') {
    SG.addToCart(product, 1);
    openCheckout();
  } else if (action === 'bulk') {
    const settings = await getCachedSettings();
    const wa = (settings.whatsapp_number || '8252487551').replace(/\D/g, '');
    const msg = encodeURIComponent(`Hi, I'd like to place a BULK ORDER for: ${product.name} (${product.weight || '1 kg'})`);
    window.open(`https://wa.me/91${wa}?text=${msg}`, '_blank');
  } else if (action === 'love') {
    await toggleLove(product, card);
  }
}

async function toggleLove(product, cardEl) {
  const customer = SG.getCustomer();
  if (!customer) {
    openLoginModal();
    return;
  }

  const already = _myLoves.has(product.id);

  if (already) {
    await sb.from('product_loves').delete().eq('product_id', product.id).eq('customer_phone', customer.phone);
    _myLoves.delete(product.id);
    product.loved_by_real = Math.max(0, (product.loved_by_real || 0) - 1);
    await sb.from('products').update({ loved_by_real: product.loved_by_real }).eq('id', product.id);
  } else {
    const { error } = await sb.from('product_loves').insert({ product_id: product.id, customer_phone: customer.phone });
    if (error && !String(error.message).includes('duplicate')) {
      SG.toast('Failed to update', 'error'); return;
    }
    _myLoves.add(product.id);
    product.loved_by_real = (product.loved_by_real || 0) + 1;
    await sb.from('products').update({ loved_by_real: product.loved_by_real }).eq('id', product.id);
  }

  const total = (Number(product.loved_by_base) || 0) + (Number(product.loved_by_real) || 0);
  const lovedEl = cardEl.querySelector('[data-action="love"]');
  lovedEl.classList.toggle('active', _myLoves.has(product.id));
  lovedEl.querySelector('.heart').innerHTML = _myLoves.has(product.id) ? SGIcons.heart : SGIcons.heartOutline;
  lovedEl.querySelector('span:last-child').textContent = `Loved by ${SG.formatLoved(total)}`;
}

// ----- Cart Drawer -----
function openCartDrawer() {
  const cart = SG.getCart();
  const backdrop = document.createElement('div');
  backdrop.className = 'sg-drawer-backdrop';

  const drawer = document.createElement('aside');
  drawer.className = 'sg-drawer';

  const renderBody = () => {
    const items = SG.getCart();
    if (items.length === 0) {
      return `<div class="empty"><p>Your cart is empty</p></div>`;
    }
    return items.map(it => `
      <div class="cart-item" data-id="${it.id}">
        <img src="${it.image_url || ''}" alt="${escapeHtml(it.name)}">
        <div class="info">
          <div class="nm">${escapeHtml(it.name)}</div>
          <div style="font-size:12px;color:#6b7280">${escapeHtml(it.weight || '1 kg')}</div>
          <div class="pr">${SG.money(it.price)} × ${it.qty}</div>
          <div class="qty">
            <button data-act="dec">−</button>
            <span>${it.qty}</span>
            <button data-act="inc">+</button>
            <button class="rm" data-act="rm" title="Remove">🗑</button>
          </div>
        </div>
      </div>
    `).join('');
  };

  const total = SG.cartTotal();
  drawer.innerHTML = `
    <div class="sg-drawer-header">
      <h3 style="display:flex;align-items:center;gap:8px">${SGIcons.cart} Your Cart</h3>
      <button class="close" id="cartClose">&times;</button>
    </div>
    <div class="sg-drawer-body" id="cartBody">${renderBody()}</div>
    <div class="sg-drawer-footer">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span>Total:</span><b style="font-size:18px">${SG.money(total)}</b>
      </div>
      <button class="sg-btn sg-btn-primary" id="checkoutBtn" style="width:100%" ${cart.length === 0 ? 'disabled' : ''}>
        Proceed to Checkout
      </button>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);

  const close = () => { backdrop.remove(); drawer.remove(); };
  backdrop.onclick = close;
  drawer.querySelector('#cartClose').onclick = close;

  drawer.querySelector('#cartBody').addEventListener('click', (e) => {
    const item = e.target.closest('.cart-item');
    if (!item) return;
    const id = Number(item.dataset.id);
    const act = e.target.dataset.act;
    if (!act) return;
    const c = SG.getCart().find(i => i.id === id);
    if (act === 'inc') SG.updateCartQty(id, (c?.qty || 1) + 1);
    if (act === 'dec') {
      if ((c?.qty || 1) <= 1) SG.removeFromCart(id);
      else SG.updateCartQty(id, c.qty - 1);
    }
    if (act === 'rm') SG.removeFromCart(id);

    drawer.querySelector('#cartBody').innerHTML = renderBody();
    drawer.querySelector('.sg-drawer-footer b').textContent = SG.money(SG.cartTotal());
    renderHeader();
  });

  drawer.querySelector('#checkoutBtn').onclick = () => {
    close();
    openCheckout();
  };
}

// ----- Checkout -----
async function openCheckout() {
  if (SG.getCart().length === 0) { SG.toast('Cart is empty', 'error'); return; }
  let customer = SG.getCustomer();
  if (!customer) {
    SG.toast('Please login to continue', 'info');
    openLoginModal();
    return;
  }
  customer = await SGAuth.refreshCustomer() || customer;

  const total = SG.cartTotal();
  const overlay = document.createElement('div');
  overlay.className = 'sg-modal-backdrop';
  overlay.innerHTML = `
    <div class="sg-modal" style="max-width:520px">
      <div class="sg-modal-header">
        <h3>Checkout</h3>
        <button class="close" id="coClose">&times;</button>
      </div>
      <div class="sg-modal-body">
        <h4 style="margin-bottom:8px;font-size:14px;color:#6b7280">Order Summary</h4>
        <div style="background:#f9fafb;padding:10px;border-radius:8px;margin-bottom:14px">
          ${SG.getCart().map(i => `<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
            <span>${escapeHtml(i.name)} × ${i.qty}</span><span>${SG.money(i.price * i.qty)}</span>
          </div>`).join('')}
          <hr style="margin:8px 0">
          <div style="display:flex;justify-content:space-between;font-weight:700"><span>Total</span><span>${SG.money(total)}</span></div>
        </div>

        <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
          <label style="font-size:12px"><input type="checkbox" id="useSaved" ${customer.default_address ? 'checked' : ''} ${customer.default_address ? '' : 'disabled'}> Use saved address</label>
        </div>

        <div class="sg-field"><label>Full Name</label><input id="coName" value="${escapeHtml(customer.name || '')}"></div>
        <div class="sg-field"><label>Phone</label><input id="coPhone" value="${customer.phone}" readonly></div>
        <div class="sg-field"><label>Alternate Phone</label><input id="coAlt" value="${escapeHtml(customer.default_alt_phone || '')}"></div>
        <div class="sg-field"><label>Address</label><textarea id="coAddr" rows="2">${escapeHtml(customer.default_address || '')}</textarea></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div class="sg-field"><label>Pincode</label><input id="coPin" value="${escapeHtml(customer.default_pincode || '')}"></div>
          <div class="sg-field"><label>Ward No.</label><input id="coWard" value="${escapeHtml(customer.default_ward || '')}"></div>
        </div>

        <div class="sg-field">
          <label>Payment Method</label>
          <select id="coPay">
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="ONLINE">Online (Cashfree) - coming soon</option>
          </select>
        </div>

        <button class="sg-btn sg-btn-primary" id="coPlace" style="width:100%">Place Order ${SG.money(total)}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#coClose').onclick = () => overlay.remove();

  const useSaved = overlay.querySelector('#useSaved');
  useSaved?.addEventListener('change', () => {
    if (useSaved.checked) {
      overlay.querySelector('#coAddr').value = customer.default_address || '';
      overlay.querySelector('#coPin').value = customer.default_pincode || '';
      overlay.querySelector('#coWard').value = customer.default_ward || '';
      overlay.querySelector('#coAlt').value = customer.default_alt_phone || '';
    }
  });

  overlay.querySelector('#coPlace').onclick = async () => {
    const name = overlay.querySelector('#coName').value.trim();
    const addr = overlay.querySelector('#coAddr').value.trim();
    const pin = overlay.querySelector('#coPin').value.trim();
    const ward = overlay.querySelector('#coWard').value.trim();
    const alt = overlay.querySelector('#coAlt').value.trim();
    const pay = overlay.querySelector('#coPay').value;

    if (!name || !addr || !pin) { SG.toast('Please fill name, address and pincode', 'error'); return; }
    const btn = overlay.querySelector('#coPlace');
    btn.disabled = true; btn.innerHTML = '<span class="sg-loader"></span> Placing...';

    try {
      await sb.from('customers').update({
        name, default_address: addr, default_pincode: pin, default_ward: ward, default_alt_phone: alt
      }).eq('phone', customer.phone);

      const orderNumber = 'SG-' + Date.now();
      const items = SG.getCart();
      const subtotal = SG.cartTotal();

      const { data: order, error } = await sb.from('orders').insert({
        order_number: orderNumber,
        customer_phone: customer.phone,
        customer_name: name,
        customer_email: customer.email,
        address: addr,
        pincode: pin,
        ward_no: ward,
        alt_phone: alt,
        items: items,
        subtotal: subtotal,
        shipping: 0,
        total: subtotal,
        payment_method: pay,
        payment_status: pay === 'COD' ? 'COD' : 'Pending',
        status: 'Pending'
      }).select().single();

      if (error) throw error;

      SG.setCart([]);
      overlay.remove();
      SG.toast(`Order ${orderNumber} placed!`, 'success');
      showOrderPlaced(order);
      renderHeader();
    } catch (e) {
      console.error(e);
      SG.toast(e.message || 'Failed to place order', 'error');
      btn.disabled = false; btn.textContent = `Place Order ${SG.money(total)}`;
    }
  };
}

function showOrderPlaced(order) {
  const overlay = document.createElement('div');
  overlay.className = 'sg-modal-backdrop';
  overlay.innerHTML = `
    <div class="sg-modal">
      <div class="sg-modal-body" style="text-align:center;padding:30px">
        <div style="font-size:60px;animation:pop .5s ease">✅</div>
        <h2 style="margin:10px 0;color:var(--green-dark)">Order Placed!</h2>
        <p style="color:#6b7280">Order Number: <b>${order.order_number}</b></p>
        <p style="color:#6b7280;margin:10px 0">Total: <b>${SG.money(order.total)}</b></p>
        <p style="font-size:13px">We'll contact you on <b>${order.customer_phone}</b> shortly.</p>
        <div style="display:flex;gap:8px;margin-top:20px">
          <a class="sg-btn sg-btn-outline" href="/pages/track.html?o=${order.order_number}">Track Order</a>
          <button class="sg-btn sg-btn-primary" id="okBtn">Continue Shopping</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#okBtn').onclick = () => { overlay.remove(); location.href = '/'; };
}

function openProfileMenu() {
  const customer = SG.getCustomer();
  if (!customer) return;

  const overlay = document.createElement('div');
  overlay.className = 'sg-modal-backdrop';
  overlay.innerHTML = `
    <div class="sg-modal">
      <div class="sg-modal-header">
        <h3>${SGIcons.user} ${escapeHtml(customer.name || 'Profile')}</h3>
        <button class="close" id="pmClose">&times;</button>
      </div>
      <div class="sg-modal-body">
        <p style="font-size:13px;color:#6b7280;margin-bottom:8px">📞 ${customer.phone}</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          <a class="sg-btn sg-btn-outline" href="/pages/track.html">📦 My Orders</a>
          <a class="sg-btn sg-btn-outline" href="/pages/profile.html">✏️ Edit Profile</a>
          <button class="sg-btn sg-btn-primary" id="logoutBtn">🚪 Logout</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#pmClose').onclick = () => overlay.remove();
  overlay.querySelector('#logoutBtn').onclick = () => {
    SGAuth.logout();
    overlay.remove();
    renderHeader();
  };
}

async function renderWAFloat() {
  const settings = await getCachedSettings();
  const wa = (settings.whatsapp_number || '8252487551').replace(/\D/g, '');
  const url = settings.whatsapp_chat_url || `https://wa.me/91${wa}`;
  const el = document.getElementById('sgWAFloat');
  if (el) {
    el.href = url;
    el.innerHTML = SGIcons.whatsapp;
  }
}

// ----- Scroll Reveal -----
function setupScrollReveal() {
  const targets = document.querySelectorAll(
    '.sg-section, .sg-contact-section, .sg-map-section, .sg-footer, .sg-card, .info-row'
  );
  targets.forEach((el, i) => {
    if (el.classList.contains('sg-card')) el.classList.add('reveal-zoom');
    else if (el.classList.contains('info-row')) el.classList.add('reveal-left');
    else el.classList.add('reveal');
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => io.observe(el));
}

// ----- INIT -----
document.addEventListener('DOMContentLoaded', async () => {
  await renderHeader();
  await renderHero();
  await renderProducts();
  await renderContactSection();
  await renderMap();
  await renderFooter();
  await renderWAFloat();
  if (window.applyFestivalFromSettings) await applyFestivalFromSettings();
  setupScrollReveal();
});

document.addEventListener('sg:cart-changed', renderHeader);
document.addEventListener('sg:auth-changed', async () => {
  await renderHeader();
  await loadMyLoves();
  await renderProducts();
});
