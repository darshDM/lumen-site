/* Fills every .phone[data-screen] with a recreated Lumen screen (sample content). */
(function () {
  'use strict';
  const I = {
    back: '<path d="M15 5l-7 7 7 7"/>',
    bookmark: '<path d="M7 4h10v16l-5-3.5L7 20z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    send: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    chats: '<path d="M4 5h11v8H8l-4 3z"/><path d="M15 9h5v8l-3-2h-6v-2"/>',
    plan: '<circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.8 2.8L16.2 9.6"/>',
    insights: '<path d="M4 19h16M7 15v-4M12 15V6M17 15v-7"/>',
    more: '<circle cx="5.5" cy="12" r=".6"/><circle cx="12" cy="12" r=".6"/><circle cx="18.5" cy="12" r=".6"/>',
    repeat: '<path d="M4 11V9a3 3 0 013-3h11M15 3l3 3-3 3M20 13v2a3 3 0 01-3 3H6M9 21l-3-3 3-3"/>',
    alarm: '<circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.2 1.6M4 5l3-2.2M20 5l-3-2.2"/>',
  };
  const ico = (n) => `<svg class="ap-ico" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

  const status = `<div class="ap-status"><span>9:41</span><span class="ap-status__icons">
    <i style="width:1.3em;height:.85em;clip-path:polygon(0 100%,100% 0,100% 100%)"></i>
    <i style="width:1.9em;height:.95em;border-radius:.25em"></i></span></div>`;

  function ring(pct, color, size = 76, stroke = 7) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return `<svg viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#2c2d33" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
        stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/></svg>`;
  }

  const tabs = (on) =>
    `<nav class="ap-tabs">${[
      ['sun', 'Today'],
      ['chats', 'Chats'],
      ['plan', 'Plan'],
      ['insights', 'Insights'],
    ]
      .map(([i, l]) => `<div class="ap-tab${l === on ? ' ap-tab--on' : ''}">${ico(i)}<span>${l}</span></div>`)
      .join('')}</nav>`;

  const screens = {
    chat: () => `${status}
      <div class="ap-top">${ico('back')}<div class="ap-top__title">Shipping the beta</div>${ico('bookmark')}</div>
      <div class="ap-scroll">
        <div class="ap-msg ap-msg--me">I keep saying I'll ship the beta this month, but every evening I end up polishing the landing page instead.</div>
        <div class="ap-reading"><span class="ap-chip">Work</span><span class="ap-chip">Frustrated</span><span class="ap-chip ap-chip--goal">Ship the beta</span></div>
        <div class="ap-msg ap-msg--lumen"><span class="ap-orb"></span><span>That's the third time since October you've moved "this month". The page is easier because nobody can say no to it yet. Want a plan that gets the beta to five people by the 30th?</span></div>
        <div class="ap-msg ap-msg--me">Yes. Make it a goal.</div>
        <div class="ap-card">
          <div class="ap-plan__head"><span class="ap-plan__title">Beta in 5 people's hands</span><span class="ap-plan__due">by Nov 30</span></div>
          <ol class="ap-steps">
            <li><span>1</span><span>Freeze the landing page as it is</span></li>
            <li><span>2</span><span>Write down five people and message them</span></li>
            <li><span>3</span><span>Fix the two sign-up bugs</span></li>
            <li><span>4</span><span>Send the build on Friday</span></li>
          </ol>
          <div class="ap-btns"><span class="ap-btn ap-btn--primary">Add goal</span><span class="ap-btn">Edit</span></div>
        </div>
      </div>
      <div class="ap-composer"><span>Message Lumen</span><span class="ap-round">${ico('mic')}</span></div>`,

    today: () => `${status}
      <div class="ap-scroll">
        <div><h3 class="ap-h1">Today</h3><p class="ap-sub">Sunday, 22 November</p></div>
        <div class="ap-rings">
          <div class="ap-ring"><div class="ap-ring__wrap">${ring(40, 'var(--a-primary)')}<span class="ap-ring__pct">40%</span></div><span class="ap-ring__name">Beta in 5 hands</span></div>
          <div class="ap-ring"><div class="ap-ring__wrap">${ring(67, 'var(--a-mint)')}<span class="ap-ring__pct">67%</span></div><span class="ap-ring__name">Run a 10K</span></div>
          <div class="ap-ring"><div class="ap-ring__wrap">${ring(20, 'var(--a-amber)')}<span class="ap-ring__pct">20%</span></div><span class="ap-ring__name">Read 12 books</span></div>
        </div>
        <div class="ap-list">
          <div class="ap-row"><span class="ap-check ap-check--done">${ico('check')}</span><div class="ap-row__main"><div class="ap-row__title">Morning pages</div><div class="ap-row__meta">Habit · done 5 of 7 days</div></div></div>
          <div class="ap-row"><span class="ap-check"></span><div class="ap-row__main"><div class="ap-row__title">Evening run</div><div class="ap-row__meta">Habit · due 19:00</div></div></div>
          <div class="ap-row"><span class="ap-dot" style="background:var(--a-amber)"></span><div class="ap-row__main"><div class="ap-row__title">Read 12 books</div><div class="ap-row__meta">Quiet for 6 days</div></div></div>
          <div class="ap-row"><span class="ap-check"></span><div class="ap-row__main"><div class="ap-row__title">Message five beta testers</div><div class="ap-row__meta">Task · Beta in 5 hands</div></div></div>
          <div class="ap-row"><span class="ap-check"></span><div class="ap-row__main"><div class="ap-row__title">Fix the sign-up bugs</div><div class="ap-row__meta">Task · tomorrow</div></div></div>
        </div>
      </div>
      <span class="ap-fab">${ico('plus')}</span>
      ${tabs('Today')}`,

    insights: () => `${status}
      <div class="ap-scroll">
        <div><h3 class="ap-h1">Insights</h3><p class="ap-sub">What Lumen noticed this week</p></div>
        <div class="ap-card ap-note">
          <div class="ap-note__sec">What I noticed</div>
          <p>You plan most when you're tired. Four of your last six late-night chats ended with a new goal, and none of those goals had a step done the next day.</p>
          <div class="ap-note__sec">Honest feedback</div>
          <p>The beta keeps losing to polish. Polish feels like progress because it never gets a no.</p>
          <div class="ap-quote">From 4 of your conversations · "I'll ship it once the page feels right."</div>
          <div class="ap-note__sec">One thing to try</div>
          <p>Send the build before you open the landing page again.</p>
          <div class="ap-btns"><span class="ap-btn ap-btn--primary">Try this week</span><span class="ap-btn">Doesn't fit</span></div>
        </div>
      </div>
      ${tabs('Insights')}`,

    plan: () => `${status}
      <div class="ap-scroll">
        <div><h3 class="ap-h1">Plan</h3></div>
        <div class="ap-add"><span class="ap-btn">${ico('plus')}Goal</span><span class="ap-btn">${ico('plus')}Habit</span><span class="ap-btn">${ico('plus')}Task</span></div>
        <div class="ap-label">Goals</div>
        <div>
          <div class="ap-goalrow">${ring(40, 'var(--a-primary)', 30, 4)}<div class="ap-row__main"><div class="ap-row__title">Beta in 5 hands</div><div class="ap-row__meta">2 of 5 steps · by Nov 30</div></div></div>
          <div class="ap-goalrow">${ring(67, 'var(--a-mint)', 30, 4)}<div class="ap-row__main"><div class="ap-row__title">Run a 10K</div><div class="ap-row__meta">4 of 6 steps · moving</div></div></div>
        </div>
        <div class="ap-label">Repeating</div>
        <div class="ap-row">${ico('repeat')}<div class="ap-row__main"><div class="ap-row__title">Evening run</div><div class="ap-row__meta">Mon, Wed, Fri · 19:00</div></div></div>
        <div class="ap-label">Lumen will ask about</div>
        <div class="ap-row">${ico('chats')}<div class="ap-row__main"><div class="ap-row__title">How the investor call went</div><div class="ap-row__meta">Tuesday</div></div></div>
        <div class="ap-label">Alarms</div>
        <div class="ap-row">${ico('alarm')}<div class="ap-row__main"><div class="ap-time">06:30</div><div class="ap-row__meta">Gym · weekdays</div></div></div>
      </div>
      ${tabs('Plan')}`,
  };

  function render(root = document) {
    root.querySelectorAll('.phone[data-screen]').forEach((el) => {
      const make = screens[el.dataset.screen];
      if (!make || el.dataset.filled) return;
      el.dataset.filled = '1';
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', el.getAttribute('aria-label') || `Lumen app, ${el.dataset.screen} screen (sample content)`);
      el.innerHTML = `<div class="phone__body"><div class="phone__screen">${make()}</div></div>`;
    });
  }

  window.Phones = { render };
  if (document.readyState !== 'loading') render();
  else document.addEventListener('DOMContentLoaded', () => render());
})();
