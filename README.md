# Wedding E-card · Supawadee & Nopparut · 30.10.2026

การ์ดเชิญออนไลน์ แสดงผลผ่าน GitHub Pages โดยฝังหน้าจาก Google Apps Script (RSVP บันทึกลง Google Sheet)

```
index.html        wrapper สำหรับ GitHub Pages  →  <iframe src=".../exec">
assets/           รูปภาพทั้งหมด (เสิร์ฟจาก GitHub Pages)
  photos/         รูปพรีเวดดิ้ง (ย่อจากต้นฉบับ ด้านยาว 2000px, JPEG q88)
  deco/           ดอกไม้ / ตราครั่ง (PNG โปร่งใส ต้นฉบับ)
  icons/          ไอคอนกำหนดการ + โมโนแกรม
  qr-promptpay.jpg
gas/
  index.html      ← ไฟล์ที่ต้องนำไปวางแทน index.html ใน Google Apps Script
  Code.gs         ตัวอย่าง doGet / saveRsvp ฝั่ง server (อ้างอิง)
```

## Flow

1. ผู้เยี่ยมชมเปิด `https://nopparut-win.github.io/wedding/`
2. `index.html` ฝัง Web app ของ Apps Script (`/exec`) แบบเต็มจอ
3. Apps Script เสิร์ฟ `gas/index.html` ซึ่งอ้างรูปจาก `https://nopparut-win.github.io/wedding/assets/...`
4. กดส่ง RSVP → `google.script.run.saveRsvp(fields)` → บันทึกลง Google Sheet

## อัปเดตหน้าการ์ด

1. แก้ `gas/index.html`
2. คัดลอกเนื้อหาทั้งไฟล์ไปวางทับ `index.html` ในโปรเจกต์ Apps Script
3. Deploy → Manage deployments → แก้ไข deployment เดิม → New version
   (ถ้าสร้าง deployment ใหม่ URL `/exec` จะเปลี่ยน ต้องแก้ใน `index.html` ที่ root ด้วย)

## อัปเดตรูป

วางไฟล์ใน `assets/` แล้ว push ขึ้น `main` เท่านั้น ไม่ต้อง deploy Apps Script ใหม่
(ชื่อไฟล์ต้องตรงกับที่อ้างใน `gas/index.html`)

## หมายเหตุ

- โฟลเดอร์ `ใช้ทำ Ecard/` (ไฟล์ต้นฉบับ, PDF, ร่างที่ฝัง base64) และ `old/` ถูก ignore ไม่ขึ้น git
- `Code.gs` ต้องตั้ง `setXFrameOptionsMode(ALLOWALL)` มิฉะนั้น GitHub Pages ฝัง iframe ไม่ได้
