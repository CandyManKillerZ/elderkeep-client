const SHOW_RELEASES = 8;   // newest N on the page; 'All Releases' covers the rest

const FAQ = [
  {
    q: 'Who is ElderKeep for?',
    a: 'A single group of friends who want their own place to talk — a guild, a few housemates, an old group chat that outgrew itself, a small team. It is not a public platform you join to meet strangers; it is somewhere your group hangs out.'
  },
  {
    q: 'Is ElderKeep finished?',
    a: 'No, and it says so on purpose. It is in active development: stable enough that people use it every day for voice, screen sharing and chat, but things still change between releases. Features get added when the people using it ask for them — most of what is in there now started as somebody saying "can it do this?".'
  },
  {
    q: 'Is it free?',
    a: 'Yes, completely. No cost, no subscription, no paid tier, no ads, and nothing is sold on. It is a side project, not a business.'
  },
  {
    q: 'Do I need to sign up anywhere?',
    a: 'Just download the app, pick a username and a password, and you are in. No email, no phone number, no third-party account, no verification.'
  },
  {
    q: 'Is it private?',
    a: 'Private messages are end-to-end encrypted (ECDH P-256 + AES-256-GCM), so only you and the person you are talking to can read them. Files you send go straight between the two machines and are never stored on a server. There is no telemetry and no third-party analytics.'
  },
  {
    q: 'How many people can be in a voice room?',
    a: 'There is no hard cap. Voice is peer to peer, so each person connects directly to the others — that keeps the latency low, and it means a large room asks more of everyone’s connection rather than a central server.'
  },
  {
    q: 'What is push-to-talk, and do I have to use it?',
    a: 'Push-to-talk means your mic is only live while you hold a key — any keyboard key or mouse button you like. If you would rather not hold anything, voice activity detection opens the mic automatically when you speak. Your game audio ducks down while you talk, either way.'
  },
  {
    q: 'Is there a mobile version?',
    a: 'An Android app is available as a direct APK, still in beta — expect some rough edges. iOS is not supported.'
  },
  {
    q: 'Does it work on Mac?',
    a: 'Not yet. Windows 10/11, Linux and Android (beta) are supported today. Mac is possible but has no date on it.'
  },
  {
    q: 'Can I run ElderKeep on my own server?',
    a: 'Not today — there is one ElderKeep server, and everyone using the app is on it. Self-hosting is on the table though: if enough people ask for it, the server will be made available to run yourself. It is not promised and it has no date, but it is the kind of thing that gets built when people keep asking.'
  },
  {
    q: 'Can I ask for a feature?',
    a: 'Yes — that is how most of it got built. If something is missing or annoying, say so and it will be looked at. Small groups get a say in a way they never would on a big platform.'
  },
  {
    q: 'How do I get in touch?',
    a: 'Inside ElderKeep. Install it, make an account, type "/j Clan CsB" in the chat box, and say hello — I am CMK (CandyManKiller). Bugs, feature requests and questions all land in the same place, and you will usually get an answer from the person who wrote the code. If you would rather not install anything first, there is an issue tracker on GitHub.'
  },
];

function renderFaq() {
  const el = document.getElementById('faq-list');
  el.innerHTML = FAQ.map((f, i) => `
    <div class="faq-item" data-i="${i}">
      <div class="faq-q">${escHtml(f.q)}<span class="ch">▼</span></div>
      <div class="faq-a">${escHtml(f.a)}</div>
    </div>
  `).join('');

  el.addEventListener('click', e => {
    const item = e.target.closest('.faq-item');
    if (item) item.classList.toggle('open');
  });
}

async function renderChangelog() {
  const el = document.getElementById('changelog-list');
  try {
    // Served next to this page from the repo's own patch-notes.json — the single source of
    // truth the release pipeline writes. The old hard-coded raw.githubusercontent URL pointed
    // at the public dist repo, whose copy stopped being updated in May and left the changelog
    // six months stale while the app kept shipping.
    const res = await fetch('patch-notes.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('fetch failed');
    const all = await res.json();
    // 140 entries made the page absurdly long; the rest are a click away on GitHub.
    const data = all.slice(0, SHOW_RELEASES);

    el.innerHTML = data.map((entry, i) => `
      <div class="cl-entry${i === 0 ? ' open' : ''}">
        <div class="cl-header">
          <span class="cl-version">${escHtml(entry.version)}</span>
          <span class="cl-title">${escHtml(entry.title)}</span>
          <span class="cl-date">${escHtml(entry.date)}</span>
          <span class="cl-chevron">▼</span>
        </div>
        <div class="cl-body">
          <ul>${entry.items.map(item => `<li>${escHtml(item)}</li>`).join('')}</ul>
        </div>
      </div>
    `).join('');

    el.addEventListener('click', e => {
      const entry = e.target.closest('.cl-entry');
      if (entry) entry.classList.toggle('open');
    });
  } catch {
    el.innerHTML = `<p class="loading-txt">Could not load patch notes. <a href="https://github.com/CandyManKillerZ/elderkeep-client/releases" target="_blank" rel="noopener">View on GitHub ↗</a></p>`;
  }
}

/* ── Reviews ─────────────────────────────────────────────────────────────────
   Written by ElderKeep users with /review and published only after approval, so this
   endpoint already serves vetted text — it is still escaped here, because it is someone
   else's words on a page. Absolute URL on purpose: this page is served BOTH from the
   ElderKeep server and from GitHub Pages, and only the server has the data. The section
   hides itself when there is nothing to show, rather than advertising an empty wall. */
const REVIEWS_API = 'https://elderkeep.duckdns.org/api/reviews';

async function renderReviews() {
  const sec = document.getElementById('reviews');
  const list = document.getElementById('reviews-list');
  if (!sec || !list) return;
  // Drop the nav link with the section, or "Reviews" in the menu jumps to nothing.
  const drop = () => { sec.remove(); document.querySelector('.nav-menu a[href="#reviews"]')?.remove(); };
  let data = [];
  try {
    const res = await fetch(REVIEWS_API, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    data = await res.json();
  } catch (e) {
    drop();                     // server down or unreachable — say nothing at all
    return;
  }
  if (!Array.isArray(data) || !data.length) { drop(); return; }

  const stars = n => {
    const r = Math.max(1, Math.min(5, Math.round(Number(n) || 0)));
    return `<span class="rv-stars" aria-label="${r} out of 5">${'★'.repeat(r)}<span class="rv-dim">${'★'.repeat(5 - r)}</span></span>`;
  };
  list.innerHTML = data.map(r => `
    <figure class="rv-card">
      ${stars(r.rating)}
      <blockquote>${escHtml(String(r.body || ''))}</blockquote>
      <figcaption>&mdash; ${escHtml(String(r.username || ''))}</figcaption>
    </figure>
  `).join('');

  const avg = data.reduce((a, r) => a + (Number(r.rating) || 0), 0) / data.length;
  const sub = document.getElementById('reviews-sub');
  if (sub) sub.textContent = data.length === 1
    ? 'One review so far, from someone using it.'
    : `${data.length} reviews, averaging ${avg.toFixed(1)} out of 5.`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Mobile nav toggle
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-menu').classList.toggle('open');
});
document.querySelectorAll('.nav-menu a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('nav-menu').classList.remove('open');
  });
});

// Scroll-in animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.anim-in').forEach(el => observer.observe(el));

// Nav active highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const scrollSpy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-menu a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => scrollSpy.observe(s));

renderFaq();
renderChangelog();
renderReviews();

/* ── Screenshot lightbox ─────────────────────────────────────── */
(function () {
  const lb = document.getElementById('shot-lb');
  const img = document.getElementById('shot-lb-img');
  if (!lb || !img) return;
  const open = src => { img.src = src; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
                        document.body.style.overflow = 'hidden'; };
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
                        document.body.style.overflow = ''; img.src = ''; };
  document.querySelectorAll('.shot[data-full]').forEach(fig => {
    fig.addEventListener('click', () => open(fig.dataset.full));
    // Keyboard users get the same thing: the figures are focusable.
    fig.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(fig.dataset.full); }
    });
  });
  lb.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
})();

/* ── Live preview: pause when unseen, enlarge on click ────────────────────────
   The preview iframe runs a canvas animation (rain, lightning, meteors). It used to
   run for the whole visit even while scrolled a screen away — a standing CPU cost and
   part of the top-of-page scroll jank. We tell it when it is actually on screen.

   Enlarging MOVES the same iframe into the overlay and puts it back on close. Cloning
   or pointing a second iframe at preview.html would run a second copy of that
   animation behind the first. */
(function () {
  const chrome = document.getElementById('preview-chrome');
  const frame  = document.getElementById('preview-frame');
  const lb     = document.getElementById('preview-lb');
  const inner  = document.getElementById('preview-lb-inner');
  const closeB = document.getElementById('preview-lb-close');
  const viewport = document.getElementById('preview-viewport');
  if (!chrome || !frame || !lb || !inner || !viewport) return;

  const tell = on => {
    try { frame.contentWindow?.postMessage({ t: 'ek-preview-visible', on }, '*'); } catch (_) {}
  };
  // The observer's first callback usually beats the iframe's listener into existence,
  // so the iframe announces itself and we answer with the state we are holding.
  let open = false, visible = true;
  const sync = () => tell(visible || open);
  window.addEventListener('message', e => {
    if (e.source === frame.contentWindow && e.data && e.data.t === 'ek-preview-ready') sync();
  });
  frame.addEventListener('load', sync);   // belt and braces

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => {
      visible = es.some(e => e.isIntersecting);
      sync();
    }, { rootMargin: '120px' }).observe(chrome);
  }

  /* The iframe renders at a fixed desktop size and is scaled to whatever box it is in,
     so the app layout is never squashed. Recomputed on resize and whenever it moves. */
  const NATIVE_W = 1280, NATIVE_H = 800;
  const fit = () => {
    const box = open ? inner : viewport;
    if (!box) return;
    const w = box.clientWidth || viewport.clientWidth;
    if (!w) return;
    const scale = open
      ? Math.min(w / NATIVE_W, (box.clientHeight || NATIVE_H) / NATIVE_H)
      : w / NATIVE_W;
    frame.style.transform = `scale(${scale})`;
    if (!open) viewport.style.height = Math.round(NATIVE_H * scale) + 'px';
    else viewport.style.height = Math.round(NATIVE_H * scale) + 'px';
  };
  window.addEventListener('resize', fit);
  frame.addEventListener('load', fit);
  fit();

  const home = viewport.parentNode, after = viewport.nextSibling;
  const openLb = () => {
    if (open) return;
    // Hold the panel's height so the page does not jump while the viewport is away.
    chrome.style.minHeight = chrome.offsetHeight + 'px';
    open = true;
    inner.appendChild(viewport);              // moved, not copied
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    fit();
    tell(true);
    closeB?.focus();
  };
  const closeLb = () => {
    if (!open) return;
    open = false;
    home.insertBefore(viewport, after);        // back exactly where it was
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    chrome.style.minHeight = '';
    fit();
    chrome.focus();
  };

  chrome.addEventListener('click', openLb);
  chrome.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(); }
  });
  closeB?.addEventListener('click', e => { e.stopPropagation(); closeLb(); });
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeLb(); });
})();
