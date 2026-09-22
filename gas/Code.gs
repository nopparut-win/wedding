/*** RSVP งานแต่ง สุภาวดี & นพรุจ — 30 ต.ค. 2569 ***/

// วาง ID ของชีทใหม่ตรงนี้ (เอาจาก URL: /spreadsheets/d/<<ID>>/edit)
const SHEET_ID   = '1tAe0X1KFCnnt6wIStv63_XUJxkFRu06OhTg4wcbGPek';
const SHEET_NAME = 'RSVP';

const HEADERS = ['วันที่-เวลา','สถานะ','ชื่อ-นามสกุล','จำนวนผู้ร่วมงาน',
                 'เบอร์โทร','มาในนามฝ่าย','หมายเหตุ','คำอวยพร'];

/** เสิร์ฟหน้าเว็บ */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Supawadee & Nopparut')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** รันครั้งเดียวหลังใส่ SHEET_ID เพื่อสร้างแท็บ + หัวตาราง */
function setupSheet() {
  const sh = getSheet();
  sh.getRange(1, 1, 1, HEADERS.length)
    .setValues([HEADERS])
    .setFontWeight('bold')
    .setBackground('#EFE7CF');
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 150);
  sh.setColumnWidth(3, 200);
  sh.setColumnWidth(7, 260);
  sh.setColumnWidth(8, 320);
  return 'พร้อมใช้งาน: ' + sh.getParent().getUrl();
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

/** เรียกจากหน้าเว็บผ่าน google.script.run */
function saveRsvp(d) {
  d = d || {};
  const name = clean(d.name);
  if (!name) return { ok: false, error: 'no-name' };

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const sh = getSheet();
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
    }
    sh.appendRow([
      Utilities.formatDate(new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss'),
      clean(d.status),
      name,
      clean(d.count),
      "'" + clean(d.tel),          // กัน Sheets ตัดเลข 0 ข้างหน้า
      clean(d.side),
      clean(d.note),
      clean(d.wish)
    ]);
    SpreadsheetApp.flush();
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: String(err) };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function clean(v) {
  return String(v == null ? '' : v).replace(/^[=+\-@]/, "'$&").trim().slice(0, 1000);
}