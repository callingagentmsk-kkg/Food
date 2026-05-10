// ============================================================
// SATYAM GOLD - Festival & Season Mode Animations
// 20+ themes: Diwali, Holi, Christmas, Eid, I-Day, R-Day, New Year,
// Rakhi, Janmashtami, Navratri, Durga Puja, Ganesh Chaturthi,
// Karwa Chauth, Lohri/Makar Sankranti, Onam, Pongal, Chhath,
// Valentine, Mother's/Father's Day, Friendship, Children's,
// Summer, Winter, Monsoon, Spring, Autumn
// ============================================================

window.SGFestival = {
  configs: {
    diwali: {
      name: 'Diwali',
      banner: '🪔 Happy Diwali — Special Festival Discounts! 🪔',
      bannerBg: 'linear-gradient(90deg,#7c2d12,#b91c1c,#f59e0b)',
      bannerColor: '#fff',
      emojis: ['🪔', '✨', '🎆', '🎇', '🌟'],
      cssClass: 'fest-diwali'
    },
    holi: {
      name: 'Holi',
      banner: '🎨 Happy Holi — Colourful Festival Offers! 🌈',
      bannerBg: 'linear-gradient(90deg,#ec4899,#a855f7,#3b82f6,#22c55e,#facc15)',
      bannerColor: '#fff',
      emojis: ['🌸', '🎨', '💐', '🌺', '🌈'],
      cssClass: 'fest-holi'
    },
    christmas: {
      name: 'Christmas',
      banner: '🎄 Merry Christmas — Grand Sale! 🎁',
      bannerBg: 'linear-gradient(90deg,#14532d,#dc2626)',
      bannerColor: '#fff',
      emojis: ['🎄', '❄️', '🎁', '⛄', '🌟'],
      cssClass: 'fest-christmas'
    },
    eid: {
      name: 'Eid',
      banner: '🌙 Eid Mubarak — Festival Discounts! 🕌',
      bannerBg: 'linear-gradient(90deg,#064e3b,#10b981)',
      bannerColor: '#fff',
      emojis: ['🌙', '✨', '🕌', '⭐'],
      cssClass: 'fest-eid'
    },
    independence: {
      name: 'Independence Day',
      banner: '🇮🇳 Happy Independence Day — Tiranga Sale! 🇮🇳',
      bannerBg: 'linear-gradient(90deg,#f97316,#fff,#16a34a)',
      bannerColor: '#1e293b',
      emojis: ['🇮🇳', '🎉', '🎊'],
      cssClass: 'fest-tiranga'
    },
    republic: {
      name: 'Republic Day',
      banner: '🇮🇳 Happy Republic Day — Special Offers! 🇮🇳',
      bannerBg: 'linear-gradient(90deg,#f97316,#fff,#16a34a)',
      bannerColor: '#1e293b',
      emojis: ['🇮🇳', '🎉'],
      cssClass: 'fest-tiranga'
    },
    newyear: {
      name: 'New Year',
      banner: '🎉 Happy New Year — Mega Discounts! 🥳',
      bannerBg: 'linear-gradient(90deg,#1e3a8a,#7c3aed,#db2777)',
      bannerColor: '#fff',
      emojis: ['🎉', '🎊', '🥂', '✨', '🎆'],
      cssClass: 'fest-newyear'
    },
    rakhi: {
      name: 'Raksha Bandhan',
      banner: '🎀 Happy Raksha Bandhan — Special Offers! 🎁',
      bannerBg: 'linear-gradient(90deg,#dc2626,#f97316,#facc15)',
      bannerColor: '#fff',
      emojis: ['🎀', '🪢', '💖', '🎁'],
      cssClass: 'fest-rakhi'
    },
    janmashtami: {
      name: 'Janmashtami',
      banner: '🦚 Happy Janmashtami — Krishna Special Offers! 🪈',
      bannerBg: 'linear-gradient(90deg,#1e3a8a,#7c3aed,#facc15)',
      bannerColor: '#fff',
      emojis: ['🦚', '🪈', '🥛', '🌼', '✨'],
      cssClass: 'fest-janmashtami'
    },
    navratri: {
      name: 'Navratri',
      banner: '💃 Happy Navratri — 9 Days of Mega Offers! 🪘',
      bannerBg: 'linear-gradient(90deg,#dc2626,#f97316,#facc15,#ec4899)',
      bannerColor: '#fff',
      emojis: ['💃', '🪘', '🌺', '🌼', '✨'],
      cssClass: 'fest-navratri'
    },
    durgapuja: {
      name: 'Durga Puja',
      banner: '🙏 Shubho Mahalaya — Durga Puja Special Sale! 🌺',
      bannerBg: 'linear-gradient(90deg,#b91c1c,#f97316,#facc15)',
      bannerColor: '#fff',
      emojis: ['🌺', '🪔', '🙏', '🌸', '✨'],
      cssClass: 'fest-durga'
    },
    ganesh: {
      name: 'Ganesh Chaturthi',
      banner: '🙏 Ganpati Bappa Morya — Festival Discounts! 🌺',
      bannerBg: 'linear-gradient(90deg,#f97316,#dc2626,#facc15)',
      bannerColor: '#fff',
      emojis: ['🐘', '🙏', '🌺', '🪔', '✨'],
      cssClass: 'fest-ganesh'
    },
    karwa: {
      name: 'Karwa Chauth',
      banner: '🌙 Happy Karwa Chauth — Special Offers! 💝',
      bannerBg: 'linear-gradient(90deg,#be123c,#dc2626,#f59e0b)',
      bannerColor: '#fff',
      emojis: ['🌙', '💝', '💍', '🌹', '✨'],
      cssClass: 'fest-karwa'
    },
    lohri: {
      name: 'Lohri / Makar Sankranti',
      banner: '🪁 Happy Lohri & Makar Sankranti — Festival Offers! 🔥',
      bannerBg: 'linear-gradient(90deg,#f59e0b,#dc2626,#facc15)',
      bannerColor: '#fff',
      emojis: ['🪁', '🔥', '🌽', '🥜', '✨'],
      cssClass: 'fest-lohri'
    },
    pongal: {
      name: 'Pongal',
      banner: '🌾 Happy Pongal — Harvest Festival Discounts! 🐄',
      bannerBg: 'linear-gradient(90deg,#16a34a,#facc15,#f97316)',
      bannerColor: '#fff',
      emojis: ['🌾', '🐄', '🌻', '🥥', '✨'],
      cssClass: 'fest-pongal'
    },
    onam: {
      name: 'Onam',
      banner: '🌼 Happy Onam — Pookalam Special Sale! 🚣',
      bannerBg: 'linear-gradient(90deg,#16a34a,#facc15,#f97316)',
      bannerColor: '#fff',
      emojis: ['🌼', '🌺', '🌻', '🍌', '🥥'],
      cssClass: 'fest-onam'
    },
    chhath: {
      name: 'Chhath Puja',
      banner: '🌅 Jai Chhathi Maiya — Special Bihar Sale! 🪔',
      bannerBg: 'linear-gradient(90deg,#f59e0b,#dc2626,#7c2d12)',
      bannerColor: '#fff',
      emojis: ['🌅', '🪔', '🌾', '🥥', '🙏'],
      cssClass: 'fest-chhath'
    },
    valentine: {
      name: "Valentine's Day",
      banner: "💖 Happy Valentine's Day — Love Special Offers! 💝",
      bannerBg: 'linear-gradient(90deg,#be123c,#ec4899,#f472b6)',
      bannerColor: '#fff',
      emojis: ['💖', '💝', '🌹', '💐', '💕'],
      cssClass: 'fest-valentine'
    },
    mothersday: {
      name: "Mother's Day",
      banner: "👩‍👧 Happy Mother's Day — Special Gift Offers! 💐",
      bannerBg: 'linear-gradient(90deg,#ec4899,#f472b6,#fbcfe8)',
      bannerColor: '#7c2d12',
      emojis: ['💐', '🌷', '💖', '🌹', '👩‍👧'],
      cssClass: 'fest-mothers'
    },
    fathersday: {
      name: "Father's Day",
      banner: "👨‍👦 Happy Father's Day — Special Gift Offers! 🎁",
      bannerBg: 'linear-gradient(90deg,#1e3a8a,#2563eb,#60a5fa)',
      bannerColor: '#fff',
      emojis: ['👨‍👦', '🎁', '👔', '🍻', '⭐'],
      cssClass: 'fest-fathers'
    },
    friendship: {
      name: 'Friendship Day',
      banner: '🤝 Happy Friendship Day — Buddy Special Sale! 💛',
      bannerBg: 'linear-gradient(90deg,#facc15,#f97316,#ec4899)',
      bannerColor: '#fff',
      emojis: ['🤝', '💛', '👫', '🎀', '✨'],
      cssClass: 'fest-friendship'
    },
    childrens: {
      name: "Children's Day",
      banner: "🎈 Happy Children's Day — Kids Special Offers! 🧸",
      bannerBg: 'linear-gradient(90deg,#3b82f6,#a855f7,#ec4899)',
      bannerColor: '#fff',
      emojis: ['🎈', '🧸', '🎂', '🎁', '🎉'],
      cssClass: 'fest-childrens'
    },
    teachers: {
      name: "Teacher's Day",
      banner: "🎓 Happy Teacher's Day — Knowledge Special! 📚",
      bannerBg: 'linear-gradient(90deg,#1e3a8a,#7c3aed,#0891b2)',
      bannerColor: '#fff',
      emojis: ['🎓', '📚', '🍎', '✏️', '⭐'],
      cssClass: 'fest-teachers'
    },
    summer: {
      name: 'Summer Sale',
      banner: '☀️ Summer Mega Sale — Beat the Heat with Hot Deals! 🌞',
      bannerBg: 'linear-gradient(90deg,#f59e0b,#facc15,#fb923c)',
      bannerColor: '#7c2d12',
      emojis: ['☀️', '🌞', '🍉', '🥭', '🌴'],
      cssClass: 'fest-summer'
    },
    winter: {
      name: 'Winter Sale',
      banner: '❄️ Winter Mega Sale — Warm Up with Cool Offers! ⛄',
      bannerBg: 'linear-gradient(90deg,#0891b2,#3b82f6,#a5f3fc)',
      bannerColor: '#fff',
      emojis: ['❄️', '⛄', '🧣', '☕', '🌨️'],
      cssClass: 'fest-winter'
    },
    monsoon: {
      name: 'Monsoon Sale',
      banner: '🌧️ Monsoon Mega Sale — Rainy-Day Special Offers! ☔',
      bannerBg: 'linear-gradient(90deg,#0f766e,#0891b2,#1e40af)',
      bannerColor: '#fff',
      emojis: ['🌧️', '☔', '🌈', '🍃', '💧'],
      cssClass: 'fest-monsoon'
    },
    spring: {
      name: 'Spring Sale',
      banner: '🌸 Spring Sale — Bloom with Fresh Offers! 🌷',
      bannerBg: 'linear-gradient(90deg,#ec4899,#f472b6,#86efac)',
      bannerColor: '#fff',
      emojis: ['🌸', '🌷', '🌼', '🦋', '🌿'],
      cssClass: 'fest-spring'
    },
    autumn: {
      name: 'Autumn Sale',
      banner: '🍂 Autumn Sale — Fall in Love with Discounts! 🍁',
      bannerBg: 'linear-gradient(90deg,#b45309,#dc2626,#f97316)',
      bannerColor: '#fff',
      emojis: ['🍂', '🍁', '🌰', '🎃', '🍄'],
      cssClass: 'fest-autumn'
    },
    none: null
  },

  apply(festKey, customMessage) {
    // Remove existing festival
    document.querySelectorAll('.fest-banner, .fest-particles').forEach(el => el.remove());
    document.body.classList.remove(...Array.from(document.body.classList).filter(c => c.startsWith('fest-')));

    if (!festKey || festKey === 'none') return;
    const cfg = this.configs[festKey];
    if (!cfg) return;

    document.body.classList.add(cfg.cssClass);

    // Top banner
    const banner = document.createElement('div');
    banner.className = 'fest-banner';
    banner.style.cssText = `background:${cfg.bannerBg};color:${cfg.bannerColor};`;
    banner.innerHTML = `<span>${customMessage || cfg.banner}</span>`;
    document.body.insertBefore(banner, document.body.firstChild);

    // Particles
    this.startParticles(cfg.emojis);
  },

  startParticles(emojis) {
    const container = document.createElement('div');
    container.className = 'fest-particles';
    document.body.appendChild(container);

    const spawn = () => {
      if (!document.body.contains(container)) return;
      const p = document.createElement('span');
      p.className = 'fest-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.fontSize = (16 + Math.random() * 18) + 'px';
      p.style.animationDuration = (6 + Math.random() * 8) + 's';
      p.style.animationDelay = Math.random() * 2 + 's';
      p.style.opacity = (0.5 + Math.random() * 0.5).toFixed(2);
      container.appendChild(p);
      setTimeout(() => p.remove(), 14000);
    };

    // Spawn periodically
    const interval = setInterval(() => {
      if (!document.body.contains(container)) { clearInterval(interval); return; }
      spawn();
    }, 700);

    // Initial burst
    for (let i = 0; i < 8; i++) setTimeout(spawn, i * 200);
  }
};

// Auto-apply festival from settings on page load
window.applyFestivalFromSettings = async function () {
  try {
    const settings = await getCachedSettings(true);
    const fest = settings.festival_mode || 'none';
    const msg = settings.festival_message || '';
    SGFestival.apply(fest, msg);
  } catch (e) {
    console.warn('Festival mode error', e);
  }
};
