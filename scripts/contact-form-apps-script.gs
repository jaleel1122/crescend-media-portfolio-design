/**
 * Crescend Media — Contact form → Google Sheet
 * Free setup (no backend). Optional email notification included.
 *
 * SETUP:
 * 1. Create a Google Sheet (e.g. "Crescend Leads")
 * 2. Extensions → Apps Script → paste this file → Save
 * 3. Set NOTIFY_EMAIL (or "" for Sheets-only)
 * 4. Deploy → New deployment → Web app
 *      Execute as: Me | Who has access: Anyone
 * 5. Paste the Web App URL into index.html as CONTACT_SHEET_ENDPOINT
 *
 * After edits: Deploy → Manage deployments → Edit → New version
 */

// Optional: get email alerts. Leave "" for Sheets-only.
var NOTIFY_EMAIL = 'shaikabduljaleel1214@gmail.com';

var SHEET_NAME = 'Leads';
var HEADERS = [
  'Timestamp',
  'Name',
  'Brand',
  'Email',
  'Phone',
  'Modules',
  'Timeline',
  'Message',
  'Source'
];

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);
    var sheet = getOrCreateLeadsSheet_();

    var modules = Array.isArray(data.modules) ? data.modules.join(', ') : (data.modules || '');
    var timelineLabels = {
      asap: 'ASAP',
      '1m': 'Within 1 month',
      '3m': '1–3 months',
      explore: 'Just exploring'
    };
    var timeline = timelineLabels[data.timeline] || (data.timeline || '');

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.brand || '',
      data.email || '',
      data.phone || '',
      modules,
      timeline,
      data.message || '',
      data.source || 'website'
    ]);

    formatDataRows_(sheet);

    if (NOTIFY_EMAIL) {
      var subject = 'New Crescend blueprint: ' + (data.name || 'Unknown') +
        (data.brand ? ' — ' + data.brand : '');
      var body =
        'New growth blueprint submission\n\n' +
        'Name: ' + (data.name || '') + '\n' +
        'Brand: ' + (data.brand || '') + '\n' +
        'Email: ' + (data.email || '') + '\n' +
        'Phone: ' + (data.phone || '') + '\n' +
        'Modules: ' + modules + '\n' +
        'Timeline: ' + timeline + '\n\n' +
        'Message:\n' + (data.message || '') + '\n';
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet() {
  // Visiting the URL also formats the sheet (useful one-time cleanup).
  try {
    formatLeadsSheet_();
    return jsonResponse({
      ok: true,
      message: 'Crescend contact endpoint is live. Sheet formatted. Use POST from the website form.'
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

/** One-click cleanup from the Apps Script editor: select formatLeadsSheet_ → Run */
function formatLeadsSheet_() {
  var sheet = getOrCreateLeadsSheet_();
  formatDataRows_(sheet);
}

function getOrCreateLeadsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  ensureHeaderRow_(sheet);
  applyTableStyle_(sheet);
  return sheet;
}

function ensureHeaderRow_(sheet) {
  var firstCell = String(sheet.getRange(1, 1).getDisplayValue() || '').trim();
  var looksLikeHeader = firstCell.toLowerCase() === 'timestamp';

  if (sheet.getLastRow() === 0 || !firstCell) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return;
  }

  if (!looksLikeHeader) {
    // Existing leads were written without headers — push them down one row
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function applyTableStyle_(sheet) {
  var lastCol = HEADERS.length;
  var header = sheet.getRange(1, 1, 1, lastCol);

  header.setValues([HEADERS]);
  header.setFontFamily('Arial');
  header.setFontWeight('bold');
  header.setFontSize(11);
  header.setFontColor('#050505');
  header.setBackground('#FFB536');
  header.setHorizontalAlignment('left');
  header.setVerticalAlignment('middle');

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 36);

  // Column widths tuned for lead intake
  sheet.setColumnWidth(1, 170); // Timestamp
  sheet.setColumnWidth(2, 140); // Name
  sheet.setColumnWidth(3, 160); // Brand
  sheet.setColumnWidth(4, 220); // Email
  sheet.setColumnWidth(5, 140); // Phone
  sheet.setColumnWidth(6, 220); // Modules
  sheet.setColumnWidth(7, 140); // Timeline
  sheet.setColumnWidth(8, 320); // Message
  sheet.setColumnWidth(9, 150); // Source

  // Filter / “table” controls on the header
  var existing = sheet.getFilter();
  if (existing) existing.remove();
  var maxRows = Math.max(sheet.getMaxRows(), 500);
  sheet.getRange(1, 1, maxRows, lastCol).createFilter();
}

function formatDataRows_(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = HEADERS.length;
  if (lastRow < 2) return;

  var data = sheet.getRange(2, 1, lastRow, lastCol);
  data.setFontFamily('Arial');
  data.setFontSize(10);
  data.setFontColor('#1a1a1a');
  data.setVerticalAlignment('middle');
  data.setWrap(true);

  // Timestamp column
  sheet.getRange(2, 1, lastRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');

  // Alternating row colors
  for (var r = 2; r <= lastRow; r++) {
    var bg = (r % 2 === 0) ? '#FFF8E8' : '#FFFFFF';
    sheet.getRange(r, 1, 1, lastCol).setBackground(bg);
  }

  // Light border around used table
  sheet.getRange(1, 1, lastRow, lastCol)
    .setBorder(true, true, true, true, true, true, '#E5E0D6', SpreadsheetApp.BorderStyle.SOLID);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
