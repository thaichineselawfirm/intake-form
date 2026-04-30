# แบบฟอร์มรับลูกค้าใหม่ — Online Intake Form

ระบบฟอร์มรับลูกค้าใหม่สำหรับสำนักงานกฎหมาย ลูกค้ากรอกออนไลน์ → ทีมงานได้รับ email สวยงามพร้อมไฟล์แนบทันที

---

## ✨ คุณสมบัติ

- ฟอร์ม 7 sections ครอบคลุมข้อมูลลูกค้าทุกด้าน
- ส่ง email อัตโนมัติเมื่อลูกค้ากรอกเสร็จ
- Email สวยงาม จัดรูปแบบครบทุกข้อมูล
- แนบไฟล์ HTML สวยงามเหมือนกัน (เปิดดูในเบราว์เซอร์ได้)
- รองรับมือถือเต็มรูปแบบ
- ฟรี 100% (ใช้ Netlify Free + Gmail)

---

## 🚀 วิธี Deploy (15 นาที)

### ขั้นตอนที่ 1 — เตรียม Gmail App Password (3 นาที)

1. ไปที่ https://myaccount.google.com/security
2. เปิด **2-Step Verification** (ถ้ายังไม่เปิด)
3. กลับไปที่หน้า Security → คลิก **App passwords**
   - ถ้าหาไม่เจอ ไปที่ https://myaccount.google.com/apppasswords
4. ตั้งชื่อ App: `Intake Form` → กด **Create**
5. **คัดลอกรหัส 16 หลัก** ที่ได้ (ลักษณะ `xxxx xxxx xxxx xxxx`) เก็บไว้ใช้ในขั้น 4

### ขั้นตอนที่ 2 — อัปโหลดขึ้น GitHub (5 นาที)

1. สมัคร / เข้าสู่ระบบ https://github.com
2. คลิกมุมขวาบน **+** → **New repository**
3. ตั้งชื่อ repo: `intake-form` → คลิก **Create repository**
4. ที่หน้า repo เปล่า คลิก **uploading an existing file**
5. **ลาก** ไฟล์และโฟลเดอร์ทั้งหมดในโปรเจกต์ (intake.html, netlify.toml, package.json, .gitignore, โฟลเดอร์ netlify) ไปวางในหน้านั้น
6. คลิก **Commit changes**

### ขั้นตอนที่ 3 — เชื่อม Netlify กับ GitHub (3 นาที)

1. สมัคร / เข้าสู่ระบบ https://app.netlify.com (สมัครด้วย GitHub ได้เลย)
2. คลิก **Add new site** → **Import an existing project**
3. คลิก **Deploy with GitHub** → อนุญาตให้ Netlify เข้าถึง repo
4. เลือก repo `intake-form`
5. ค่าตั้งต้นปล่อยตามนี้ (ไม่ต้องแก้):
   - Build command: ว่างไว้
   - Publish directory: `.`
6. คลิก **Deploy intake-form**

### ขั้นตอนที่ 4 — ตั้งค่า Environment Variables (3 นาที)

1. ในหน้า Netlify ของ site ที่เพิ่ง deploy → **Site configuration** → **Environment variables**
2. คลิก **Add a variable** → เพิ่มทีละตัว:

   | Key | Value |
   |---|---|
   | `GMAIL_USER` | `yourmail@gmail.com` (Gmail ที่ใช้ส่ง) |
   | `GMAIL_APP_PASSWORD` | `xxxx xxxx xxxx xxxx` (รหัส 16 หลักจากขั้น 1) |
   | `TO_EMAIL` | email ที่ต้องการรับฟอร์ม (จะเป็นตัวเดียวกับ GMAIL_USER ก็ได้) |

3. กลับไปที่ **Deploys** → **Trigger deploy** → **Deploy site**

### ขั้นตอนที่ 5 — ทดสอบ ✅

1. คลิก URL ของ site (Netlify จะให้ชื่อแบบ `random-name-xxx.netlify.app`)
2. กรอกฟอร์มทดสอบ → กด **ส่งข้อมูลให้ทีมงาน**
3. เช็ก inbox ของ `TO_EMAIL` → ควรได้ email สวยๆ พร้อมไฟล์ HTML แนบมา

---

## 🌐 ใช้โดเมนของตัวเอง (ถ้าต้องการ)

Netlify Site → **Domain settings** → **Add custom domain** → ทำตามคำแนะนำ ฟรี ใช้ HTTPS อัตโนมัติ

---

## 🔧 แก้ไขฟอร์มในอนาคต

วิธีที่ง่ายที่สุด:
1. ไปที่ repo ใน GitHub → คลิกไฟล์ที่ต้องการแก้
2. คลิกไอคอน ✏️ ดินสอ → แก้ไข → **Commit changes**
3. Netlify จะ deploy ใหม่อัตโนมัติภายใน 1-2 นาที

---

## 📁 โครงสร้างไฟล์

```
intake-form/
├── intake.html                       ฟอร์มหลัก (หน้าเดียว)
├── netlify.toml                      config สำหรับ Netlify
├── package.json                      dependencies (nodemailer)
├── .gitignore                        ไม่ commit node_modules
├── README.md                         ไฟล์นี้
└── netlify/
    └── functions/
        └── send-intake.js            backend ส่ง email
```

---

## ❓ ถ้ามีปัญหา

- **Email ไม่ส่ง** → เช็ก Environment Variables ใน Netlify ว่าใส่ครบหรือยัง โดยเฉพาะ App Password (เว้นวรรคได้ ต้องครบ 16 หลัก)
- **Site ขึ้น error** → ดู Functions log ใน Netlify Dashboard → tab **Functions** → คลิก `send-intake`
- **Gmail ส่งไม่ได้** → เปลี่ยน App Password ใหม่ (รหัสเก่าอาจถูก revoke)
- **Email โดน spam** → เพิ่มอีเมลผู้ส่งใน contacts ของ inbox ปลายทาง

---

## 🔒 ความปลอดภัย

- App Password ถูกเก็บเป็น Environment Variable บน Netlify (encrypted)
- ไม่มีการเก็บข้อมูลลูกค้าในฐานข้อมูล (ส่งตรงเข้า email เท่านั้น)
- Netlify Function รันบน HTTPS โดยอัตโนมัติ
