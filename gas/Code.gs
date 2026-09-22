/**
 * Google Apps Script – Wedding E-card (Supawadee & Nopparut)
 *
 * ไฟล์นี้เป็นตัวอย่างอ้างอิงของฝั่ง server ที่ index.html ต้องการ
 * ถ้าโปรเจกต์ Apps Script เดิมมี doGet / saveRsvp อยู่แล้ว ไม่ต้องแทนที่
 * แค่ตรวจว่า:
 *   1. doGet ตั้ง XFrameOptionsMode = ALLOWALL  (เพื่อให้ GitHub Pages ฝัง iframe ได้)
 *   2. doGet เพิ่ม meta viewport ผ่าน addMetaTag  (HtmlService ไม่อ่าน <meta viewport> ในไฟล์ html)
 *   3. saveRsvp(fields) รับ { status, name, count, tel, side, note, wish } และคืน { ok: true }
 *
 * Deploy: Deploy > New deployment > Web app
 *   Execute as: Me   /   Who has access: Anyone
 * แล้วนำ URL /exec ไปใส่ใน index.html (wrapper) ที่ root ของ repo
 */

var SHEET_NAME = 'RSVP';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Supawadee & Nopparut · 30.10.2026')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * บันทึกคำตอบรับลง Google Sheet (sheet ชื่อ RSVP ใน spreadsheet ที่ผูกกับสคริปต์)
 * @param {{status:string,name:string,count:string,tel:string,side:string,note:string,wish:string}} f
 * @return {{ok:boolean}}
 */
function saveRsvp(f) {
  f = f || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(['เวลา', 'สถานะ', 'ชื่อ – นามสกุล', 'จำนวน', 'เบอร์โทร', 'ฝ่าย', 'หมายเหตุ', 'คำอวยพร']);
    }
    sh.appendRow([
      new Date(),
      String(f.status || ''),
      String(f.name || ''),
      String(f.count || ''),
      "'" + String(f.tel || ''),   // กัน Sheets ตัด 0 นำหน้าเบอร์โทร
      String(f.side || ''),
      String(f.note || ''),
      String(f.wish || '')
    ]);
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: String(e) };
  } finally {
    lock.releaseLock();
  }
}
