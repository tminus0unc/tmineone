/**
 * T-0 Money Tracker — form submit webhook.
 *
 * Paste this into Extensions > Apps Script on EACH team's duplicated
 * "Money Tracker" form, then wire it up:
 *
 * 1. Rename the form to "<Team Name> Money Tracker" (the team name is
 *    read from the form title, so the whole form must literally be titled
 *    after the team, e.g. "Team Alpha Money Tracker").
 * 2. In the Apps Script editor: Project Settings (gear icon) > Script
 *    Properties > Add script property:
 *      WEBHOOK_URL    = https://<your-deployed-domain>/api/money-tracker
 *      WEBHOOK_SECRET = <same value as MONEY_TRACKER_WEBHOOK_SECRET>
 * 3. Triggers (clock icon) > Add Trigger > choose function "onFormSubmit",
 *    event source "From form", event type "On form submit" > Save, and
 *    grant the requested permissions.
 * 4. Submit a test response and confirm it shows up on /transactions.
 */

function onFormSubmit(e) {
  const props = PropertiesService.getScriptProperties();
  const webhookUrl = props.getProperty('WEBHOOK_URL');
  const webhookSecret = props.getProperty('WEBHOOK_SECRET');
  if (!webhookUrl || !webhookSecret) {
    throw new Error('Set WEBHOOK_URL and WEBHOOK_SECRET in Script Properties first.');
  }

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

  UrlFetchApp.fetch(webhookUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: { 'x-webhook-secret': webhookSecret },
    muteHttpExceptions: true,
  });
}
