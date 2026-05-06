// ============================================================
// SATYAM GOLD - Authentication (Phone OTP via Supabase)
// ============================================================

window.SGAuth = {
  // Generate 6-digit OTP
  _genOTP() {
    return String(Math.floor(100000 + Math.random() * 900000));
  },

  // Send OTP - In real prod this would integrate SMS gateway.
  // Here we store OTP in Supabase + show it in console for testing.
  // (User can wire MSG91/Twilio/Cashfree SMS later via Supabase Edge Functions.)
  async sendOTP(phone) {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      throw new Error('Please enter a valid 10-digit Indian mobile number');
    }
    const code = this._genOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Invalidate previous OTPs
    await sb.from('otp_codes').update({ verified: true }).eq('phone', phone).eq('verified', false);

    const { error } = await sb.from('otp_codes').insert({ phone, code, expires_at });
    if (error) throw error;

    // For demo / testing - show OTP in console & toast
    console.log(`[Satyam Gold] OTP for ${phone}: ${code}`);
    SG.toast(`OTP sent! (Demo OTP: ${code})`, 'success');

    return true;
  },

  async verifyOTP(phone, code) {
    const { data, error } = await sb
      .from('otp_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .order('id', { ascending: false })
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Invalid or expired OTP');

    await sb.from('otp_codes').update({ verified: true }).eq('id', data[0].id);

    // Look up customer
    const { data: existing } = await sb
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    return { isNew: !existing, customer: existing };
  },

  async registerOrLogin(phone, name) {
    const { data: existing } = await sb
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    let customer;
    if (existing) {
      // Update last_login & possibly name
      const upd = { last_login: new Date().toISOString() };
      if (name && !existing.name) upd.name = name;
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
        .insert({ phone, name: name || 'Customer', last_login: new Date().toISOString() })
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
// LOGIN MODAL
// ============================================================
window.openLoginModal = async function () {
  const settings = await getCachedSettings();
  const logoUrl = settings.site_logo || '';
  const siteName = settings.site_name || 'Satyam Gold';

  let phone = '';
  let stage = 'phone'; // 'phone' | 'otp' | 'name'

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
          <p>Login with your mobile number</p>
        </div>
        <div id="sgLoginStage"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#sgLoginClose').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

  const stageEl = overlay.querySelector('#sgLoginStage');

  const renderPhone = () => {
    stage = 'phone';
    stageEl.innerHTML = `
      <div class="sg-field">
        <label>Mobile Number</label>
        <input type="tel" id="loginPhone" maxlength="10" placeholder="10-digit mobile number" inputmode="numeric">
      </div>
      <button class="sg-btn sg-btn-primary" id="sendOtpBtn" style="width:100%">Send OTP</button>
    `;
    const inp = stageEl.querySelector('#loginPhone');
    inp.focus();
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(0, 10); });
    stageEl.querySelector('#sendOtpBtn').onclick = async () => {
      const btn = stageEl.querySelector('#sendOtpBtn');
      const v = inp.value.trim();
      btn.disabled = true; btn.innerHTML = '<span class="sg-loader"></span> Sending...';
      try {
        await SGAuth.sendOTP(v);
        phone = v;
        renderOTP();
      } catch (e) {
        SG.toast(e.message || 'Failed to send OTP', 'error');
        btn.disabled = false; btn.textContent = 'Send OTP';
      }
    };
  };

  const renderOTP = () => {
    stage = 'otp';
    stageEl.innerHTML = `
      <p style="font-size:13px;color:var(--gray-500);margin-bottom:10px">
        OTP sent to <b>+91 ${phone}</b>. <a href="#" id="changePhone" style="color:var(--primary-dark)">Change</a>
      </p>
      <div class="sg-field">
        <label>Enter OTP</label>
        <input type="tel" id="otpInput" maxlength="6" placeholder="6-digit OTP" inputmode="numeric">
      </div>
      <button class="sg-btn sg-btn-primary" id="verifyOtpBtn" style="width:100%">Verify OTP</button>
      <p style="text-align:center;margin-top:10px;font-size:12px"><a href="#" id="resendOtp" style="color:var(--primary-dark)">Resend OTP</a></p>
    `;
    const inp = stageEl.querySelector('#otpInput');
    inp.focus();
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(0, 6); });

    stageEl.querySelector('#changePhone').onclick = (e) => { e.preventDefault(); renderPhone(); };
    stageEl.querySelector('#resendOtp').onclick = async (e) => {
      e.preventDefault();
      try { await SGAuth.sendOTP(phone); } catch (err) { SG.toast(err.message, 'error'); }
    };
    stageEl.querySelector('#verifyOtpBtn').onclick = async () => {
      const btn = stageEl.querySelector('#verifyOtpBtn');
      btn.disabled = true; btn.innerHTML = '<span class="sg-loader"></span> Verifying...';
      try {
        const result = await SGAuth.verifyOTP(phone, inp.value.trim());
        if (result.isNew) {
          renderName();
        } else {
          await SGAuth.registerOrLogin(phone, result.customer.name);
          SG.toast(`Welcome back, ${result.customer.name || 'Customer'}!`, 'success');
          overlay.remove();
        }
      } catch (e) {
        SG.toast(e.message || 'Invalid OTP', 'error');
        btn.disabled = false; btn.textContent = 'Verify OTP';
      }
    };
  };

  const renderName = () => {
    stage = 'name';
    stageEl.innerHTML = `
      <p style="font-size:13px;color:var(--gray-500);margin-bottom:10px">Welcome! Tell us your name to complete signup.</p>
      <div class="sg-field">
        <label>Your Name</label>
        <input type="text" id="nameInput" placeholder="Full name" autocomplete="name">
      </div>
      <button class="sg-btn sg-btn-primary" id="saveNameBtn" style="width:100%">Continue</button>
    `;
    const inp = stageEl.querySelector('#nameInput');
    inp.focus();
    stageEl.querySelector('#saveNameBtn').onclick = async () => {
      const btn = stageEl.querySelector('#saveNameBtn');
      const name = inp.value.trim();
      if (name.length < 2) { SG.toast('Please enter a valid name', 'error'); return; }
      btn.disabled = true; btn.innerHTML = '<span class="sg-loader"></span> Saving...';
      try {
        await SGAuth.registerOrLogin(phone, name);
        SG.toast(`Welcome, ${name}!`, 'success');
        overlay.remove();
      } catch (e) {
        SG.toast(e.message, 'error');
        btn.disabled = false; btn.textContent = 'Continue';
      }
    };
  };

  renderPhone();
};

// Cached settings
let _settingsCache = null;
window.getCachedSettings = async function () {
  if (_settingsCache) return _settingsCache;
  const { data } = await sb.from('site_settings').select('*');
  const obj = {};
  (data || []).forEach(r => obj[r.setting_key] = r.setting_value);
  _settingsCache = obj;
  return obj;
};
