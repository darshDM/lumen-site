/*
 * Early-access forms. They post to the Google Apps Script URL in <meta name="signup-endpoint">
 * (setup: tools/SIGNUP-SHEET.md). With no URL set, the button opens an email instead.
 */
(function () {
  'use strict';
  const CONTACT = 'darshmamtora2122@gmail.com';
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  function wire(form) {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button');
    const note = form.querySelector('.signup__note');
    const idle = note ? note.innerHTML : '';
    const say = (text, kind) => {
      if (!note) return;
      note.textContent = text;
      note.dataset.kind = kind || '';
    };
    input.addEventListener('input', () => {
      if (form.dataset.state === 'error') {
        form.dataset.state = '';
        note.innerHTML = idle;
        note.dataset.kind = '';
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
      const meta = document.querySelector('meta[name="signup-endpoint"]');
      const endpoint = form.dataset.endpoint || (meta && meta.content.trim());
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
        // A form-encoded POST is a "simple" request, so Apps Script needs no CORS preflight.
        const trap = form.querySelector('input[name="website"]');
        const body = new URLSearchParams({ email, source: form.dataset.source || '', website: trap ? trap.value : '' });
        const res = await fetch(endpoint, { method: 'POST', body, redirect: 'follow' });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json().catch(() => ({ ok: true }));
        if (data.ok === false) {
          form.dataset.state = 'error';
          say('That email looks incomplete. Check it and try again.', 'error');
          return;
        }
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
