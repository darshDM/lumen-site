# Early-access signups → Google Sheet

The site's "Get early access" forms post to a Google Apps Script web app that adds each email to a sheet
you own. No server, no token in the page. Until the URL is set, the button opens an email instead.

## Set it up (about 5 minutes)

1. Create a new Google Sheet, e.g. "Lumen early access".
2. In the sheet: **Extensions → Apps Script**. Delete the sample code, paste all of `tools/signup-sheet.gs`,
   and save.
3. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, allow the permissions Google asks for (it is your own script), and copy the
   **Web app URL** (ends in `/exec`).
5. In `index.html`, paste that URL into the one meta tag near the top:
   `<meta name="signup-endpoint" content="https://script.google.com/macros/s/…/exec">`
6. Commit and push. Signups appear in the **Signups** tab: email, time, and which form (top or bottom).

Duplicates are skipped, and the hidden `website` field quietly drops most bots.

## If you change the script later

Use **Deploy → Manage deployments → Edit → Version: New version**. That keeps the same URL; a brand-new
deployment gets a new URL and you would have to update `index.html`.
