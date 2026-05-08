// ============================================================
// SATYAM GOLD - Festival Mode Animations
// Diwali, Holi, Christmas, Eid, Independence Day, Republic Day, New Year
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
