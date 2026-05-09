// ============================================================
// SATYAM GOLD - Admin Panel Logic
// ============================================================

const ADMIN_KEY = 'sg_admin_session';

function toast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

function money(v) { return '₹' + (Number(v) || 0).toFixed(0); }

function statusBadge(s) {
  const map = {
    'Pending': 'b-pending', 'Accepted': 'b-accepted', 'Packed': 'b-packed',
    'Shipped': 'b-shipped', 'Out for Delivery': 'b-out', 'Delivered': 'b-delivered',
    'Rejected': 'b-rejected', 'Cancelled': 'b-cancelled'
  };
  return `<span class="badge ${map[s] || 'b-pending'}">${s}</span>`;
}

// ============================================================
// LOGIN
// ============================================================
async function tryLogin() {
  const u = document.getElementById('adUser').value.trim();
  const p = document.getElementById('adPass').value.trim();
  if (!u || !p) { toast('Enter username & password', 'error'); return; }

  const { data, error } = await sb.from('admin_users').select('*').eq('username', u).eq('password', p).maybeSingle();
  if (error) { toast(error.message, 'error'); return; }
  if (!data) { toast('Invalid credentials', 'error'); return; }

  localStorage.setItem(ADMIN_KEY, JSON.stringify({ username: u, ts: Date.now() }));
  showAdmin();
}

function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
  location.reload();
}

function showAdmin() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminApp').style.display = 'flex';
  loadDashboard();
}

document.addEventListener('DOMContentLoaded', () => {
  const session = localStorage.getItem(ADMIN_KEY);
  if (session) showAdmin();

  document.getElementById('adLogin').onclick = tryLogin;
  document.getElementById('adPass').addEventListener('keypress', e => { if (e.key === 'Enter') tryLogin(); });
  document.getElementById('adLogout').onclick = logoutAdmin;

  // Tab navigation
  document.querySelectorAll('.admin-sidebar nav button').forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });

  document.getElementById('ordRefresh').onclick = loadOrders;
  document.getElementById('ordFilter').onchange = loadOrders;
  document.getElementById('ordSearch').oninput = debounce(loadOrders, 300);
  document.getElementById('custSearch').oninput = debounce(loadCustomers, 300);
  document.getElementById('adChangePass').onclick = changePassword;
});

function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

function switchTab(name) {
  document.querySelectorAll('.admin-sidebar nav button').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.toggle('active', t.id === `tab-${name}`));
  document.getElementById('pageTitle').textContent = ({
    dashboard: 'Dashboard', orders: 'Orders', products: 'Products', customers: 'Customers',
    hero: 'Hero Slides', pages: 'Pages / Policies', settings: 'Site Settings',
    messages: 'Contact Messages', account: 'Change Password'
  })[name] || name;

  if (name === 'dashboard') loadDashboard();
  if (name === 'orders') loadOrders();
  if (name === 'products') loadProducts();
  if (name === 'customers') loadCustomers();
  if (name === 'hero') loadHero();
  if (name === 'pages') loadPages();
  if (name === 'settings') loadSettings();
  if (name === 'messages') loadMessages();
}

// ============================================================
// DASHBOARD
// ============================================================
async function loadDashboard() {
  const [{ data: orders }, { data: customers }] = await Promise.all([
    sb.from('orders').select('*').order('created_at', { ascending: false }),
    sb.from('customers').select('id')
  ]);

  const all = orders || [];
  const pending = all.filter(o => o.status === 'Pending').length;
  const revenue = all.filter(o => o.status === 'Delivered').reduce((s, o) => s + Number(o.total || 0), 0);

  document.getElementById('kpiOrders').textContent = all.length;
  document.getElementById('kpiPending').textContent = pending;
  document.getElementById('kpiRevenue').textContent = money(revenue);
  document.getElementById('kpiCustomers').textContent = (customers || []).length;

  const recent = all.slice(0, 5);
  document.getElementById('recentOrders').innerHTML = recent.length === 0
    ? '<p style="color:#6b7280">No orders yet</p>'
    : `<table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
       <tbody>${recent.map(o => `
         <tr>
           <td><b>${o.order_number}</b></td>
           <td>${escapeHtml(o.customer_name)} <br><small style="color:#6b7280">${o.customer_phone}</small></td>
           <td>${money(o.total)}</td>
           <td>${statusBadge(o.status)}</td>
           <td>${new Date(o.created_at).toLocaleDateString()}</td>
         </tr>
       `).join('')}</tbody></table>`;
}

// ============================================================
// ORDERS
// ============================================================
let _orders = [];
async function loadOrders() {
  const filter = document.getElementById('ordFilter').value;
  const search = document.getElementById('ordSearch').value.trim();
  let q = sb.from('orders').select('*').order('created_at', { ascending: false });
  if (filter) q = q.eq('status', filter);
  const { data } = await q;
  _orders = (data || []).filter(o => {
    if (!search) return true;
    return (o.customer_phone || '').includes(search) || (o.order_number || '').toLowerCase().includes(search.toLowerCase());
  });

  const tbl = document.getElementById('ordersTable');
  if (_orders.length === 0) { tbl.innerHTML = '<tr><td>No orders</td></tr>'; return; }

  tbl.innerHTML = `
    <thead><tr>
      <th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th>
    </tr></thead>
    <tbody>
      ${_orders.map(o => `
        <tr>
          <td><b>${o.order_number}</b></td>
          <td>${escapeHtml(o.customer_name)}<br><small style="color:#6b7280">${o.customer_phone}</small></td>
          <td>${(o.items || []).map(i => `${escapeHtml(i.name)} ×${i.qty}`).join('<br>')}</td>
          <td><b>${money(o.total)}</b></td>
          <td>${o.payment_method}</td>
          <td>${statusBadge(o.status)}</td>
          <td>${new Date(o.created_at).toLocaleDateString()}<br><small>${new Date(o.created_at).toLocaleTimeString()}</small></td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="viewOrder(${o.id})">View</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

window.viewOrder = function (id) {
  const o = _orders.find(x => x.id === id);
  if (!o) return;
  const STATUSES = ['Pending', 'Accepted', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Rejected', 'Cancelled'];
  const html = `
    <div class="modal-bg" id="ordModal">
      <div class="modal">
        <div class="modal-header">
          <h3>Order ${o.order_number}</h3>
          <span class="close-x" onclick="document.getElementById('ordModal').remove()">&times;</span>
        </div>
        <div class="modal-body">
          <p><b>Customer:</b> ${escapeHtml(o.customer_name)}</p>
          <p><b>Phone:</b> ${o.customer_phone}${o.alt_phone ? ' / Alt: ' + o.alt_phone : ''}</p>
          <p><b>Address:</b> ${escapeHtml(o.address || '')} | Pin: ${o.pincode || ''} | Ward: ${o.ward_no || ''}</p>
          <p><b>Payment:</b> ${o.payment_method} (${o.payment_status})</p>
          <hr style="margin:10px 0">
          <h4>Items</h4>
          <table>
            <thead><tr><th>Name</th><th>Weight</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
            <tbody>${(o.items || []).map(i => `<tr><td>${escapeHtml(i.name)}</td><td>${escapeHtml(i.weight || '')}</td><td>${i.qty}</td><td>${money(i.price)}</td><td>${money(i.price * i.qty)}</td></tr>`).join('')}</tbody>
          </table>
          <p style="margin-top:10px;text-align:right"><b>Total: ${money(o.total)}</b></p>

          <hr style="margin:14px 0">
          <div class="field">
            <label>Update Status</label>
            <select id="ordStatusSel">
              ${STATUSES.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>Admin Notes (optional)</label>
            <textarea id="ordNotes" rows="2">${escapeHtml(o.notes || '')}</textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('ordModal').remove()">Cancel</button>
          <button class="btn btn-success" onclick="updateOrderStatus(${o.id})">💾 Save</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
};

window.updateOrderStatus = async function (id) {
  const status = document.getElementById('ordStatusSel').value;
  const notes = document.getElementById('ordNotes').value;
  const { error } = await sb.from('orders').update({ status, notes, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) { toast(error.message, 'error'); return; }
  toast('Order updated', 'success');
  document.getElementById('ordModal').remove();
  loadOrders();
};

// ============================================================
// PRODUCTS
// ============================================================
let _products = [];
async function loadProducts() {
  const { data } = await sb.from('products').select('*').order('sort_order', { ascending: true });
  _products = data || [];
  const tbl = document.getElementById('productsTable');
  if (_products.length === 0) { tbl.innerHTML = '<tr><td>No products</td></tr>'; return; }

  tbl.innerHTML = `
    <thead><tr>
      <th>Image</th><th>Name</th><th>MRP</th><th>Price</th><th>Discount</th>
      <th>Stock</th><th>Loved (base)</th><th>Real Loves</th><th>Actions</th>
    </tr></thead>
    <tbody>
      ${_products.map(p => {
        const disc = p.mrp > 0 && p.price > 0 && p.price < p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
        return `
          <tr>
            <td><img class="product-thumb" src="${p.image_url || ''}" onerror="this.style.opacity=0.3"></td>
            <td><b>${escapeHtml(p.name)}</b><br><small style="color:#6b7280">${escapeHtml(p.weight || '')}</small></td>
            <td>${money(p.mrp)}</td>
            <td>${money(p.price)}</td>
            <td><span class="badge ${disc > 0 ? 'b-accepted' : 'b-cancelled'}">${disc}%</span></td>
            <td>${p.in_stock ? '<span class="badge b-delivered">In Stock</span>' : '<span class="badge b-rejected">Out</span>'}</td>
            <td>${p.loved_by_base || 0}</td>
            <td>${p.loved_by_real || 0}</td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="openProductForm(${p.id})">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">🗑</button>
            </td>
          </tr>
        `;
      }).join('')}
    </tbody>`;
}

window.openProductForm = function (id) {
  const p = id ? _products.find(x => x.id === id) : {};
  const editing = !!id;
  const html = `
    <div class="modal-bg" id="prodModal">
      <div class="modal">
        <div class="modal-header">
          <h3>${editing ? 'Edit Product' : 'Add Product'}</h3>
          <span class="close-x" onclick="document.getElementById('prodModal').remove()">&times;</span>
        </div>
        <div class="modal-body">
          <div class="field"><label>Name</label><input id="pfName" value="${escapeHtml(p.name)}"></div>
          <div class="field"><label>Description (Hindi/English)</label><textarea id="pfDesc" rows="3">${escapeHtml(p.description)}</textarea></div>
          <div class="field"><label>Image URL</label><input id="pfImg" value="${escapeHtml(p.image_url)}"></div>
          <div class="field-row">
            <div class="field"><label>MRP / Print Price ₹</label><input id="pfMrp" type="number" step="0.01" value="${p.mrp || ''}"></div>
            <div class="field"><label>Selling Price ₹</label><input id="pfPrice" type="number" step="0.01" value="${p.price || ''}"></div>
          </div>
          <p style="font-size:12px;color:#16a34a;margin:-6px 0 8px">📊 Discount % is auto-calculated and shown on product card.</p>
          <div class="field-row">
            <div class="field"><label>Weight Display</label><input id="pfWeight" value="${escapeHtml(p.weight || '1 kg')}"></div>
            <div class="field"><label>Category</label><input id="pfCat" value="${escapeHtml(p.category || 'Flour')}"></div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>In Stock</label>
              <select id="pfStock"><option value="true" ${p.in_stock !== false ? 'selected' : ''}>Yes</option><option value="false" ${p.in_stock === false ? 'selected' : ''}>No (Out of Stock)</option></select>
            </div>
            <div class="field"><label>Sort Order</label><input id="pfSort" type="number" value="${p.sort_order || 0}"></div>
          </div>
          <div class="field"><label>Loved by - Base Count <small style="color:#6b7280">(initial display, e.g. 1500 = "1.5k")</small></label><input id="pfLoved" type="number" value="${p.loved_by_base || 0}"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('prodModal').remove()">Cancel</button>
          <button class="btn btn-success" onclick="saveProduct(${id || 0})">💾 Save</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
};

window.saveProduct = async function (id) {
  const obj = {
    name: pfName.value.trim(),
    description: pfDesc.value.trim(),
    image_url: pfImg.value.trim(),
    mrp: parseFloat(pfMrp.value) || 0,
    price: parseFloat(pfPrice.value) || 0,
    weight: pfWeight.value.trim(),
    category: pfCat.value.trim(),
    in_stock: pfStock.value === 'true',
    sort_order: parseInt(pfSort.value) || 0,
    loved_by_base: parseInt(pfLoved.value) || 0,
    updated_at: new Date().toISOString()
  };
  if (!obj.name) { toast('Name is required', 'error'); return; }
  let res;
  if (id) res = await sb.from('products').update(obj).eq('id', id);
  else res = await sb.from('products').insert(obj);
  if (res.error) { toast(res.error.message, 'error'); return; }
  toast('Saved', 'success');
  document.getElementById('prodModal').remove();
  loadProducts();
};

window.deleteProduct = async function (id) {
  if (!confirm('Delete this product?')) return;
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) { toast(error.message, 'error'); return; }
  toast('Deleted', 'success');
  loadProducts();
};

// ============================================================
// CUSTOMERS
// ============================================================
async function loadCustomers() {
  const search = document.getElementById('custSearch').value.trim();
  let q = sb.from('customers').select('*').order('last_login', { ascending: false });
  const { data } = await q;
  let list = data || [];
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(c => (c.phone || '').includes(search) || (c.name || '').toLowerCase().includes(s));
  }

  const tbl = document.getElementById('customersTable');
  if (list.length === 0) { tbl.innerHTML = '<tr><td>No customers</td></tr>'; return; }

  // Get order counts
  const { data: orders } = await sb.from('orders').select('customer_phone, total');
  const stats = {};
  (orders || []).forEach(o => {
    if (!stats[o.customer_phone]) stats[o.customer_phone] = { count: 0, total: 0 };
    stats[o.customer_phone].count++;
    stats[o.customer_phone].total += Number(o.total || 0);
  });

  tbl.innerHTML = `
    <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Orders</th><th>Spent</th><th>Joined</th></tr></thead>
    <tbody>
      ${list.map(c => `
        <tr>
          <td><b>${escapeHtml(c.name || '-')}</b></td>
          <td>${c.phone}</td>
          <td>${escapeHtml(c.email || '-')}</td>
          <td><small>${escapeHtml(c.default_address || '-')}<br>${c.default_pincode || ''}</small></td>
          <td>${stats[c.phone]?.count || 0}</td>
          <td>${money(stats[c.phone]?.total || 0)}</td>
          <td><small>${new Date(c.created_at).toLocaleDateString()}</small></td>
        </tr>
      `).join('')}
    </tbody>`;
}

// ============================================================
// HERO SLIDES
// ============================================================
let _slides = [];
async function loadHero() {
  const { data } = await sb.from('hero_slides').select('*').order('sort_order', { ascending: true });
  _slides = data || [];
  const list = document.getElementById('heroList');
  if (_slides.length === 0) { list.innerHTML = '<p style="color:#6b7280">No slides yet</p>'; return; }
  list.innerHTML = _slides.map(s => `
    <div style="display:flex;gap:12px;padding:10px;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:10px;align-items:center;flex-wrap:wrap">
      <img src="${s.image_url}" style="width:120px;height:60px;object-fit:cover;border-radius:6px" onerror="this.style.opacity=0.3">
      <div style="flex:1;min-width:160px">
        <b>${escapeHtml(s.title || '(no title)')}</b>
        <div style="font-size:12px;color:#6b7280">${escapeHtml(s.subtitle || '')}</div>
        <div style="font-size:11px;color:#6b7280">Sort: ${s.sort_order} · Active: ${s.active ? 'Yes' : 'No'}</div>
      </div>
      <div>
        <button class="btn btn-primary btn-sm" onclick="openHeroForm(${s.id})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteHero(${s.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

window.openHeroForm = function (id) {
  const s = id ? _slides.find(x => x.id === id) : {};
  const editing = !!id;
  const html = `
    <div class="modal-bg" id="heroModal">
      <div class="modal">
        <div class="modal-header"><h3>${editing ? 'Edit Slide' : 'Add Slide'}</h3>
          <span class="close-x" onclick="document.getElementById('heroModal').remove()">&times;</span>
        </div>
        <div class="modal-body">
          <div class="field"><label>Image URL</label><input id="hfImg" value="${escapeHtml(s.image_url)}"></div>
          <div class="field"><label>Title</label><input id="hfTitle" value="${escapeHtml(s.title)}"></div>
          <div class="field"><label>Subtitle</label><input id="hfSub" value="${escapeHtml(s.subtitle)}"></div>
          <div class="field-row">
            <div class="field"><label>Button Text</label><input id="hfBtn" value="${escapeHtml(s.button_text || 'Shop Now')}"></div>
            <div class="field"><label>Button Link</label><input id="hfLink" value="${escapeHtml(s.button_link || '#products')}"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Sort Order</label><input id="hfSort" type="number" value="${s.sort_order || 0}"></div>
            <div class="field"><label>Active</label><select id="hfActive"><option value="true" ${s.active !== false ? 'selected' : ''}>Yes</option><option value="false" ${s.active === false ? 'selected' : ''}>No</option></select></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('heroModal').remove()">Cancel</button>
          <button class="btn btn-success" onclick="saveHero(${id || 0})">💾 Save</button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
};

window.saveHero = async function (id) {
  const obj = {
    image_url: hfImg.value.trim(),
    title: hfTitle.value.trim(),
    subtitle: hfSub.value.trim(),
    button_text: hfBtn.value.trim(),
    button_link: hfLink.value.trim(),
    sort_order: parseInt(hfSort.value) || 0,
    active: hfActive.value === 'true'
  };
  if (!obj.image_url) { toast('Image URL is required', 'error'); return; }
  const res = id
    ? await sb.from('hero_slides').update(obj).eq('id', id)
    : await sb.from('hero_slides').insert(obj);
  if (res.error) { toast(res.error.message, 'error'); return; }
  toast('Saved', 'success');
  document.getElementById('heroModal').remove();
  loadHero();
};

window.deleteHero = async function (id) {
  if (!confirm('Delete this slide?')) return;
  const { error } = await sb.from('hero_slides').delete().eq('id', id);
  if (error) { toast(error.message, 'error'); return; }
  loadHero();
};

// ============================================================
// PAGES (Privacy / Terms / etc)
// ============================================================
async function loadPages() {
  const { data } = await sb.from('policy_pages').select('*').order('id');
  const list = document.getElementById('pagesList');
  if (!data || data.length === 0) { list.innerHTML = '<p>No pages yet</p>'; return; }
  list.innerHTML = data.map(p => `
    <div style="border:1px solid #e5e7eb;border-radius:10px;padding:12px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:8px">
        <div><b>${escapeHtml(p.title)}</b> <small style="color:#6b7280">/${p.page_key}.html</small></div>
        <button class="btn btn-success btn-sm" onclick="savePage('${p.page_key}')">💾 Save</button>
      </div>
      <div class="field"><label>Title</label><input id="pageTitle_${p.page_key}" value="${escapeHtml(p.title)}"></div>
      <div class="field"><label>Content (HTML supported)</label><textarea id="pageContent_${p.page_key}" rows="8" style="font-family:monospace;font-size:12px">${escapeHtml(p.content || '')}</textarea></div>
    </div>
  `).join('');
}

window.savePage = async function (key) {
  const title = document.getElementById(`pageTitle_${key}`).value.trim();
  const content = document.getElementById(`pageContent_${key}`).value;
  const { error } = await sb.from('policy_pages').update({ title, content, updated_at: new Date().toISOString() }).eq('page_key', key);
  if (error) { toast(error.message, 'error'); return; }
  toast(`${title} saved`, 'success');
};

// ============================================================
// SETTINGS
// ============================================================
async function loadSettings() {
  const { data } = await sb.from('site_settings').select('*');
  const map = {};
  (data || []).forEach(r => map[r.setting_key] = r.setting_value);
  const v = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };

  v('setSiteName', map.site_name);
  v('setLogo', map.site_logo);
  v('setHeroTag', map.hero_tagline);
  v('setFooterTag', map.footer_tagline);
  v('setFooter', map.footer_text);
  v('setPhone', map.phone_number);
  v('setWA', map.whatsapp_number);
  v('setEmail', map.email_address);
  v('setAddr', map.business_address);
  v('setLegal', map.legal_entity);
  v('setMap', map.map_embed_url);
  v('setFB', map.facebook_url);
  v('setIG', map.instagram_url);
  v('setYT', map.youtube_url);
  v('setWAChat', map.whatsapp_chat_url);
  v('setCFApp', map.cashfree_app_id);
  v('setCFSecret', map.cashfree_secret);
  v('setCFMode', map.cashfree_mode || 'TEST');
  v('setPEClient', map.phone_email_client_id);
  v('setFestival', map.festival_mode || 'none');
  v('setFestivalMsg', map.festival_message);

  document.getElementById('logoPreview').innerHTML = map.site_logo
    ? `<img src="${map.site_logo}" style="height:50px;border:1px solid #e5e7eb;padding:4px;border-radius:6px">`
    : '';
}

window.saveSettings = async function () {
  const g = id => (document.getElementById(id)?.value ?? '');
  const updates = {
    site_name: g('setSiteName'),
    site_logo: g('setLogo'),
    hero_tagline: g('setHeroTag'),
    footer_tagline: g('setFooterTag'),
    footer_text: g('setFooter'),
    phone_number: g('setPhone'),
    whatsapp_number: g('setWA'),
    email_address: g('setEmail'),
    business_address: g('setAddr'),
    legal_entity: g('setLegal'),
    map_embed_url: g('setMap'),
    facebook_url: g('setFB'),
    instagram_url: g('setIG'),
    youtube_url: g('setYT'),
    whatsapp_chat_url: g('setWAChat'),
    cashfree_app_id: g('setCFApp'),
    cashfree_secret: g('setCFSecret'),
    cashfree_mode: g('setCFMode') || 'TEST',
    phone_email_client_id: g('setPEClient'),
    festival_mode: g('setFestival') || 'none',
    festival_message: g('setFestivalMsg')
  };

  const rows = Object.entries(updates).map(([setting_key, setting_value]) => ({
    setting_key,
    setting_value,
    updated_at: new Date().toISOString()
  }));

  const { error } = await sb.from('site_settings').upsert(rows, { onConflict: 'setting_key' });
  if (error) { toast('Save failed: ' + error.message, 'error'); return; }
  toast('✅ Settings saved successfully', 'success');
  loadSettings();
};

// ============================================================
// MESSAGES
// ============================================================
async function loadMessages() {
  const { data } = await sb.from('contact_messages').select('*').order('created_at', { ascending: false });
  const list = document.getElementById('messagesList');
  if (!data || data.length === 0) { list.innerHTML = '<p style="color:#6b7280">No messages yet</p>'; return; }
  list.innerHTML = data.map(m => `
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px"><b>${escapeHtml(m.name)}</b><small style="color:#6b7280">${new Date(m.created_at).toLocaleString()}</small></div>
      <div style="font-size:13px;color:#6b7280;margin:4px 0">📞 ${m.phone} ${m.email ? ' · ✉️ ' + m.email : ''}</div>
      <p style="font-size:14px">${escapeHtml(m.message)}</p>
    </div>
  `).join('');
}

// ============================================================
// CHANGE PASSWORD
// ============================================================
async function changePassword() {
  const cur = curPass.value, nu = newUser.value.trim(), np = newPass.value;
  if (!cur || !np) { toast('Fill all fields', 'error'); return; }
  const session = JSON.parse(localStorage.getItem(ADMIN_KEY) || '{}');
  const { data } = await sb.from('admin_users').select('*').eq('username', session.username).eq('password', cur).maybeSingle();
  if (!data) { toast('Current password is incorrect', 'error'); return; }
  const upd = { password: np };
  if (nu && nu !== session.username) upd.username = nu;
  const { error } = await sb.from('admin_users').update(upd).eq('id', data.id);
  if (error) { toast(error.message, 'error'); return; }
  toast('Updated. Please login again.', 'success');
  setTimeout(logoutAdmin, 800);
}
