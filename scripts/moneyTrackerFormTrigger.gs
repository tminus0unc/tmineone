/**
 * T-0 Money Tracker — form submit webhook.
 *
 * Set this up ONCE on the master form before duplicating it for every team:
 *
 * 1. Paste this whole file into Extensions > Apps Script on the master form,
 *    replacing anything already there. Save (Cmd+S).
 * 2. Set the webhook config EITHER way (the code checks Script Properties
 *    first, then falls back to the WEBHOOK_URL/WEBHOOK_SECRET constants
 *    below):
 *      - Script Properties (gear icon > Project Settings > Script
 *        Properties): WEBHOOK_URL, WEBHOOK_SECRET — convenient for testing
 *        the master form, but does NOT carry over to duplicates.
 *      - The constants below — DOES carry over to duplicates (code is
 *        copied, Script Properties are not), so this is what actually
 *        matters once you start duplicating. Fill in the real secret only
 *        inside the Apps Script editor, never commit it back to this repo
 *        file.
 * 3. Triggers (clock icon, left sidebar) > Add Trigger > function
 *    "onFormSubmit" > event source "From form" > event type "On form
 *    submit" > Save, and grant the requested permissions.
 * 4. Select "testConnection" in the function dropdown at the top of the
 *    editor and click Run. Check View > Executions for the logged response
 *    code if nothing shows up on /transactions or the team portal.
 *
 * Then, for each team:
 * 1. Duplicate the master form (File > Make a copy). The copy keeps this
 *    script's code (and the hardcoded constants) automatically.
 * 2. Rename the copy to "<Team Name> Money Tracker".
 * 3. Open the copy's Apps Script editor > Triggers > Add Trigger the same
 *    way as step 3 above. This is the one step that does NOT carry over
 *    when a form is duplicated — Google doesn't copy triggers, only code.
 * 4. That's it — no portal setup needed. The team registers itself
 *    automatically using the form's own ID (not the title text) the first
 *    time it submits.
 */

var WEBHOOK_URL = 'https://www.tminus0.net/api/money-tracker';
var WEBHOOK_SECRET = 'REPLACE_WITH_MONEY_TRACKER_WEBHOOK_SECRET'; // fill in locally, never commit the real value

function getWebhookConfig() {
  var props = PropertiesService.getScriptProperties();
  return {
    url: props.getProperty('WEBHOOK_URL') || WEBHOOK_URL,
    secret: props.getProperty('WEBHOOK_SECRET') || WEBHOOK_SECRET,
  };
}

function onFormSubmit(e) {
  const form = FormApp.getActiveForm();
  const team = form.getTitle().replace(/\s*money tracker\s*$/i, '').trim() || form.getTitle();
  const formId = form.getId();

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

  sendToWebhook({
    team: team,
    formId: formId,
    amount: amount,
    method: method,
    imageUrl: imageUrl,
    responseId: e.response.getId(),
  });
}

// Run manually (function dropdown at the top of the editor > testConnection
// > Run) to verify the webhook + register this team immediately, without
// waiting for a real form submission. Check View > Executions afterward —
// the logged line shows the real HTTP response from the server.
function testConnection() {
  const form = FormApp.getActiveForm();
  const team = form.getTitle().replace(/\s*money tracker\s*$/i, '').trim() || form.getTitle();

  sendToWebhook({
    team: team,
    formId: form.getId(),
    amount: 0,
    method: 'Connection test',
    imageUrl: null,
    responseId: 'test-' + new Date().getTime(),
  });
}

function sendToWebhook(payload) {
  const config = getWebhookConfig();
  const response = UrlFetchApp.fetch(config.url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: { 'x-webhook-secret': config.secret },
    muteHttpExceptions: true,
  });
  Logger.log('Webhook response: ' + response.getResponseCode() + ' ' + response.getContentText());
}
