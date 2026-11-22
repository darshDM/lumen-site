/*
 * Early-access forms. Set data-endpoint on a <form class="signup"> to a form service URL
 * (Formspree, Tally, Getform…) and it posts there. With no endpoint it opens an email instead.
 */
(function () {
  'use strict';
  const CONTACT = 'darshmamtora2122@gmail.com';
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  function wire(form) {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button');
    const note = form.querySelector('.signup__note');
    const idle = note ? note.textContent : '';
    const say = (text, kind) => {
      if (!note) return;
      note.textContent = text;
      note.dataset.kind = kind || '';
    };
    input.addEventListener('input', () => {
      if (form.dataset.state === 'error') {
        form.dataset.state = '';
        say(idle);
      }
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!valid(email)) {
        form.dataset.state = 'error';
        say('That email looks incomplete. Check it and try again.', 'error');
        input.focus();
        return;
      }
      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        const subject = encodeURIComponent('Lumen early access');
        const body = encodeURIComponent(`Please add ${email} to the Lumen early-access list.`);
        window.location.href = `mailto:${CONTACT}?subject=${subject}&body=${body}`;
        form.dataset.state = 'done';
        say('Your email app should open. Send the message and you are on the list.', 'ok');
        return;
      }
      form.dataset.state = 'loading';
      button.disabled = true;
      say('Adding you…');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.dataset.state = 'done';
        input.value = '';
        say("You're on the list. One email when Lumen opens.", 'ok');
      } catch {
        form.dataset.state = 'error';
        say('That did not go through. Check your connection and try again.', 'error');
      } finally {
        button.disabled = false;
      }
    });
  }

  const run = () => document.querySelectorAll('form.signup').forEach(wire);
  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
})();
