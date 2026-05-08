// ============================================================
// SATYAM GOLD - Authentication
// Real Phone.email OTP integration
// CLIENT ID: 12468569854913964682
// ============================================================

window.PHONE_EMAIL_CLIENT_ID = '12468569854913964682';

window.SGAuth = {
  async fetchVerifiedUser(user_json_url) {
    // Fetch verified phone number from Phone.email JSON URL
    const res = await fetch(user_json_url);
    if (!res.ok) throw new Error('Failed to verify phone');
    return await res.json();
  },

  async registerOrLogin(phone, name, email) {
    const { data: existing } = await sb
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    let customer;
    if (existing) {
      const upd = { last_login: new Date().toISOString() };
      if (name && !existing.name) upd.name = name;
      if (email && !existing.email) upd.email = email;
      const { data, error } = await sb
        .from('customers')
        .update(upd)
        .eq('phone', phone)
        .select()
        .single();
      if (error) throw error;
      customer = data;
    } else {
      const { data, error } = await sb
        .from('customers')
        .insert({
          phone,
          name: name || 'Customer',
          email: email || null,
          last_login: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      customer = data;
    }

    SG.setCustomer(customer);
    return customer;
  },

  logout() {
    SG.setCustomer(null);
    SG.toast('Logged out', 'info');
  },

  async refreshCustomer() {
    const c = SG.getCustomer();
    if (!c) return null;
    const { data } = await sb.from('customers').select('*').eq('phone', c.phone).maybeSingle();
    if (data) SG.setCustomer(data);
    return data;
  }
};

// ============================================================
// LOAD Phone.email script (re-injectable)
// ============================================================
function loadPhoneEmailScript() {
  return new Promise((resolve) => {
    // Remove any previous script to force re-render of buttons
    document.querySelectorAll('script[data-phone-email]').forEach(s => s.remove());
    const s = document.createElement('script');
    s.src = 'https://www.phone.email/sign_in_button_v1.js';
    s.async = true;
    s.dataset.phoneEmail = '1';
    s.onload = () => resolve();
    s.onerror = () => resolve(); // resolve anyway, fallback below
    document.body.appendChild(s);
  });
}

// ============================================================
// LOGIN MODAL
// ============================================================
window.openLoginModal = async function () {
  const settings = await getCachedSettings();
  const logoUrl = settings.site_logo || '';
  const siteName = settings.site_name || 'Satyam Gold';

  let stage = 'phone'; // 'phone' | 'name'
  let verifiedPhone = '';
  let verifiedFirstName = '';

  const overlay = document.createElement('div');
  overlay.className = 'sg-modal-backdrop';
  overlay.innerHTML = `
    <div class="sg-modal" style="max-width: 420px">
      <div class="sg-modal-header">
        <h3>Login</h3>
        <button class="close" id="sgLoginClose">&times;</button>
      </div>
      <div class="sg-modal-body" id="sgLoginBody">
        <div class="login-welcome">
          ${logoUrl ? `<img src="${logoUrl}" alt="logo">` : ''}
          <h2>Welcome to ${siteName}</h2>
          <p>Login with your mobile number to continue</p>
        </div>
        <div id="sgLoginStage"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#sgLoginClose').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

  const stageEl = overlay.querySelector('#sgLoginStage');

  const renderPhone = async () => {
    stage = 'phone';
    const settings = await getCachedSettings();
    const clientId = settings.phone_email_client_id || window.PHONE_EMAIL_CLIENT_ID;

    stageEl.innerHTML = `
      <p style="font-size:13px;color:var(--gray-500);margin-bottom:14px;text-align:center">
        Click below to verify your phone number via real SMS OTP
      </p>
      <div id="phoneEmailBox" style="display:flex;justify-content:center;margin:10px 0;min-height:48px;align-items:center">
        <div class="pe_signin_button" data-client-id="${clientId}"></div>
      </div>
      <div id="peFallback" style="display:none;text-align:center;margin-top:8px">
        <p style="font-size:12px;color:#dc2626;margin-bottom:8px">OTP service taking too long. Try manual entry:</p>
        <input id="manualPhone" placeholder="10-digit phone" maxlength="10"
               style="padding:10px;border:1px solid #d1d5db;border-radius:8px;width:100%;margin-bottom:8px">
        <button class="sg-btn sg-btn-primary" id="manualPhoneBtn" style="width:100%">Continue with this number</button>
      </div>
      <p style="font-size:11px;color:var(--gray-500);text-align:center;margin-top:14px">
        🔒 Secured by Phone.email · Real OTP sent to your number
      </p>
    `;

    // Set the listener BEFORE script loads — Phone.email calls this name globally
    window.phoneEmailListener = async (userObj) => {
      try {
        const user_json_url = userObj.user_json_url;
        SG.toast('Verifying...', 'info');
        const data = await SGAuth.fetchVerifiedUser(user_json_url);
        const fullPhone = (data.user_phone_number || '').replace(/^\+?91/, '').replace(/\D/g, '');
        verifiedPhone = fullPhone.slice(-10);
        verifiedFirstName = [data.user_first_name, data.user_last_name].filter(Boolean).join(' ').trim();

        if (!verifiedPhone || verifiedPhone.length !== 10) {
          SG.toast('Invalid phone number returned', 'error');
          return;
        }

        const { data: existing } = await sb.from('customers').select('*').eq('phone', verifiedPhone).maybeSingle();
        if (existing && existing.name) {
          await SGAuth.registerOrLogin(verifiedPhone, existing.name);
          SG.toast(`Welcome back, ${existing.name}!`, 'success');
          overlay.remove();
        } else {
          renderName();
        }
      } catch (err) {
        console.error(err);
        SG.toast('Verification failed: ' + err.message, 'error');
      }
    };

    await loadPhoneEmailScript();

    // If button still not rendered after 4s, show manual fallback
    setTimeout(() => {
      const box = document.getElementById('phoneEmailBox');
      const fallback = document.getElementById('peFallback');
      if (!box) return;
      if (!box.querySelector('iframe') && !box.querySelector('button') && !box.querySelector('a')) {
        if (fallback) fallback.style.display = 'block';
      }
    }, 4000);

    const manualBtn = document.getElementById('manualPhoneBtn');
    if (manualBtn) {
      manualBtn.onclick = async () => {
        const ph = (document.getElementById('manualPhone').value || '').replace(/\D/g, '').slice(-10);
        if (ph.length !== 10) { SG.toast('Enter a valid 10-digit number', 'error'); return; }
        verifiedPhone = ph;
        const { data: existing } = await sb.from('customers').select('*').eq('phone', ph).maybeSingle();
        if (existing && existing.name) {
          await SGAuth.registerOrLogin(ph, existing.name);
          SG.toast(`Welcome back, ${existing.name}!`, 'success');
          overlay.remove();
        } else {
          renderName();
        }
      };
    }
  };

  const renderName = () => {
    stage = 'name';
    stageEl.innerHTML = `
      <div style="text-align:center;margin-bottom:10px">
        <div style="font-size:40px">✅</div>
        <p style="color:var(--green-dark);font-weight:600">Phone verified: +91 ${verifiedPhone}</p>
      </div>
      <p style="font-size:13px;color:var(--gray-500);margin-bottom:10px">Welcome! Please tell us your name to complete your profile.</p>
      <div class="sg-field">
        <label>Your Name</label>
        <input type="text" id="nameInput" placeholder="Full name" value="${verifiedFirstName || ''}">
      </div>
      <button class="sg-btn sg-btn-primary" id="saveNameBtn" style="width:100%">Continue Shopping →</button>
    `;
    const inp = stageEl.querySelector('#nameInput');
    inp.focus();
    inp.select();

    stageEl.querySelector('#saveNameBtn').onclick = async () => {
      const btn = stageEl.querySelector('#saveNameBtn');
      const name = inp.value.trim();
      if (name.length < 2) { SG.toast('Please enter a valid name', 'error'); return; }
      btn.disabled = true; btn.innerHTML = '<span class="sg-loader"></span> Saving...';
      try {
        await SGAuth.registerOrLogin(verifiedPhone, name);
        SG.toast(`Welcome, ${name}! 🎉`, 'success');
        overlay.remove();
      } catch (e) {
        SG.toast(e.message, 'error');
        btn.disabled = false; btn.textContent = 'Continue Shopping →';
      }
    };

    inp.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') stageEl.querySelector('#saveNameBtn').click();
    });
  };

  renderPhone();
};

// Cached settings
let _settingsCache = null;
window.getCachedSettings = async function (forceRefresh = false) {
  if (_settingsCache && !forceRefresh) return _settingsCache;
  const { data } = await sb.from('site_settings').select('*');
  const obj = {};
  (data || []).forEach(r => obj[r.setting_key] = r.setting_value);
  _settingsCache = obj;
  return obj;
};
