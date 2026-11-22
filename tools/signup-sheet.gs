/**
 * Lumen early-access signups → this Google Sheet.
 * Paste into Extensions → Apps Script of the sheet, then deploy as a web app
 * (Execute as: Me, Who has access: Anyone). Steps: tools/SIGNUP-SHEET.md.
 */
const SHEET_NAME = 'Signups';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Bots fill the hidden "website" field; pretend it worked and store nothing.
  if (p.website) return reply({ ok: true });

  const email = String(p.email || '').trim().toLowerCase();
  // Reject anything a spreadsheet could read as a formula.
  if (email.length > 254 || !EMAIL.test(email) || /^[=+\-@]/.test(email)) {
    return reply({ ok: false, error: 'invalid_email' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(['Email', 'Signed up', 'Form']);
    const rows = sheet.getLastRow() - 1;
    const known = rows > 0 ? sheet.getRange(2, 1, rows, 1).getValues().flat() : [];
    if (known.indexOf(email) === -1) {
      sheet.appendRow([email, new Date(), String(p.source || '').slice(0, 20)]);
    }
    return reply({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
