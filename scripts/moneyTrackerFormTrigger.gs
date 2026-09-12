/**
 * T-0 Money Tracker — form submit webhook.
 *
 * Set this up ONCE on the master form before duplicating it for every team:
 *
 * 1. Paste this whole file into Extensions > Apps Script on the master form,
 *    replacing anything already there. Fill in WEBHOOK_SECRET below with the
 *    real value (same as MONEY_TRACKER_WEBHOOK_SECRET in Vercel/.env.local)
 *    — do NOT commit the real secret back into this repo file. Save (Cmd+S).
 * 2. Triggers (clock icon, left sidebar) > Add Trigger > function
 *    "onFormSubmit" > event source "From form" > event type "On form
 *    submit" > Save, and grant the requested permissions.
 * 3. Submit a test response and confirm it shows up on /transactions.
 *
 * Then, for each team:
 * 1. Duplicate the master form (File > Make a copy). The copy keeps this
 *    script's code automatically.
 * 2. Rename the copy to "<Team Name> Money Tracker" — the team name is read
 *    from the form title, and must match the name in the team portal
 *    (matching is trim + case-insensitive, but keep it exact for clarity).
 * 3. Open the copy's Apps Script editor > Triggers > Add Trigger the same
 *    way as step 2 above. This is the one step that does NOT carry over
 *    when a form is duplicated — Google doesn't copy triggers, only code.
 */

var WEBHOOK_URL = 'https://www.tminus0.net/api/money-tracker';
var WEBHOOK_SECRET = 'REPLACE_WITH_MONEY_TRACKER_WEBHOOK_SECRET'; // fill in locally, never commit the real value

function onFormSubmit(e) {
  const form = FormApp.getActiveForm();
  const team = form.getTitle().replace(/\s*money tracker\s*$/i, '').trim() || form.getTitle();

  let amount = null;
  let method = null;
  let fileId = null;

  e.response.getItemResponses().forEach(function (itemResponse) {
    const title = itemResponse.getItem().getTitle().toLowerCase();
    if (title.indexOf('how much') !== -1) {
      amount = parseFloat(String(itemResponse.getResponse()).replace(/[^0-9.-]/g, ''));
    } else if (title.indexOf('how did you raise') !== -1) {
      method = itemResponse.getResponse();
    } else if (title.indexOf('upload an image') !== -1) {
      const response = itemResponse.getResponse();
      fileId = Array.isArray(response) ? response[0] : response;
    }
  });

  let imageUrl = null;
  if (fileId) {
    const file = DriveApp.getFileById(fileId);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    imageUrl = 'https://drive.google.com/uc?export=view&id=' + fileId;
  }

  const payload = {
    team: team,
    amount: amount,
    method: method,
    imageUrl: imageUrl,
    responseId: e.response.getId(),
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: { 'x-webhook-secret': WEBHOOK_SECRET },
    muteHttpExceptions: true,
  });
}
