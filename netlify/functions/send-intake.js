const nodemailer = require('nodemailer');

// ─────────────────────────────────────────────
//  Build the beautiful HTML — used as both
//  email body AND attached file
// ─────────────────────────────────────────────
function buildHTML(formData) {
  const PRI = {
    urgent: { label: '🔴 เร่งด่วนมาก', sub: 'ภายใน 24-48 ชั่วโมง', bg: '#FCEBEB', accent: '#A32D2D' },
    high:   { label: '🟠 เร่งด่วน',     sub: 'ภายใน 1-2 สัปดาห์',  bg: '#FAEEDA', accent: '#854F0B' },
    normal: { label: '🟡 ปกติ',          sub: 'ภายใน 1 เดือน',       bg: '#FDF8E8', accent: '#634F0A' },
    low:    { label: '🟢 ไม่เร่งด่วน',   sub: 'ยืดหยุ่นได้',          bg: '#EAF3DE', accent: '#3B6D11' },
  };
  const pri = PRI[formData.priority] || PRI.normal;

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const nl  = s => esc(s).replace(/\n/g, '<br>');

  const row = (label, value) => value && value !== '-' && value !== '' ? `
    <tr>
      <td style="padding:11px 0;width:38%;color:#6B7280;font-size:13px;border-bottom:1px solid #F1EFE8;vertical-align:top">${esc(label)}</td>
      <td style="padding:11px 0;color:#0F2744;font-size:14px;border-bottom:1px solid #F1EFE8;font-weight:500">${esc(value)}</td>
    </tr>` : '';

  const sec = (icon, title) => `
    <tr><td colspan="2" style="padding:28px 0 14px">
      <div style="font-size:11px;color:#9CA3AF;letter-spacing:1.8px;text-transform:uppercase;font-weight:700;border-bottom:2px solid #0F2744;padding-bottom:8px">
        <span style="margin-right:6px">${icon}</span>${esc(title)}
      </div>
    </td></tr>`;

  const docsHas = formData.documents.filter(d => d.has);
  const docsNo  = formData.documents.filter(d => !d.has);

  const serviceTags = formData.services.map(s =>
    `<span style="display:inline-block;background:#EBF2FC;color:#0F2744;border:1px solid #C7DBF6;border-radius:6px;padding:6px 12px;font-size:12px;font-weight:500;margin:3px 5px 3px 0">${esc(s)}</span>`
  ).join('');

  const channelTags = formData.contact.channels.map(c =>
    `<span style="display:inline-block;background:#F8F6EF;color:#4A5568;border:1px solid #E8E4D8;border-radius:6px;padding:5px 11px;font-size:12px;margin:2px 4px 2px 0">${esc(c)}</span>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ลูกค้าใหม่ ${esc(formData.ref)}</title>
</head>
<body style="margin:0;padding:0;background:#F5F5F0;font-family:'Sarabun','Noto Sans Thai','Segoe UI',Arial,sans-serif;color:#0F2744;-webkit-font-smoothing:antialiased">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F5F0;padding:32px 16px">
  <tr><td align="center">

    <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,39,68,0.08)">

      <!-- HEADER -->
      <tr>
        <td style="background:#0F2744;padding:36px 36px 30px;color:white">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding-bottom:14px">
              <span style="display:inline-block;background:rgba(212,175,55,0.18);color:#D4AF37;border:1px solid rgba(212,175,55,0.4);border-radius:20px;padding:5px 14px;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase">
                ⚖ ลูกค้าใหม่
              </span>
            </td></tr>
            <tr><td style="font-size:26px;font-weight:700;color:white;line-height:1.3;padding-bottom:10px">
              ${esc(formData.client.nameTh)}
            </td></tr>
            <tr><td style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7">
              <span style="color:#D4AF37;font-weight:600;letter-spacing:0.5px">${esc(formData.ref)}</span>
              &nbsp;·&nbsp; ${esc(formData.submittedAt)}
            </td></tr>
          </table>
        </td>
      </tr>

      <!-- PRIORITY BAR -->
      <tr>
        <td style="background:${pri.bg};padding:14px 36px;border-bottom:1px solid ${pri.accent}22">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size:14px;font-weight:600;color:${pri.accent}">${pri.label}</td>
              <td align="right" style="font-size:12px;color:${pri.accent};opacity:0.85">${pri.sub}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- QUICK CONTACT -->
      <tr><td style="padding:24px 36px 0">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FDF8E8;border:1.5px solid #D4C89A;border-radius:10px">
          <tr><td style="padding:18px 22px">
            <div style="font-size:11px;color:#888;letter-spacing:1.3px;text-transform:uppercase;font-weight:700;margin-bottom:8px">📞 ติดต่อด่วน</div>
            <div style="font-size:20px;font-weight:700;color:#0F2744;letter-spacing:0.5px;margin-bottom:6px">${esc(formData.contact.phone)}</div>
            ${formData.contact.line ? `<div style="font-size:13px;color:#4A5568;margin-bottom:3px">📱 LINE: <strong style="color:#0F2744">${esc(formData.contact.line)}</strong></div>` : ''}
            ${formData.contact.email ? `<div style="font-size:13px;color:#4A5568">✉️ ${esc(formData.contact.email)}</div>` : ''}
          </td></tr>
        </table>
      </td></tr>

      <!-- BODY -->
      <tr><td style="padding:8px 36px 16px">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">

          ${sec('📌','สรุปเรื่อง')}
          <tr><td colspan="2" style="padding:0 0 6px">
            <div style="background:#F8F6EF;border-left:4px solid #B8970A;border-radius:0 8px 8px 0;padding:16px 20px;font-size:14px;line-height:1.75;color:#0F2744">
              ${nl(formData.case.summary)}
            </div>
          </td></tr>
          ${formData.services.length ? `
          <tr><td colspan="2" style="padding:14px 0 0">
            <div style="font-size:12px;color:#6B7280;margin-bottom:8px;font-weight:500">บริการที่ต้องการ</div>
            <div>${serviceTags}</div>
          </td></tr>` : ''}

          ${sec('👤','ข้อมูลส่วนตัว')}
          ${row('ชื่อ-นามสกุล (ไทย)', formData.client.nameTh)}
          ${row('Name (English)', formData.client.nameEn)}
          ${row('สัญชาติ', formData.client.nationality)}
          ${row('ประเภทลูกค้า', formData.client.type)}
          ${row('เลขบัตร / Passport', formData.client.idNumber)}
          ${row('บริษัท / องค์กร', formData.client.company)}
          ${row('ตำแหน่ง', formData.client.position)}

          ${sec('📞','ช่องทางการติดต่อ')}
          ${row('เบอร์โทรศัพท์', formData.contact.phone)}
          ${row('LINE ID', formData.contact.line)}
          ${row('WeChat / WhatsApp', formData.contact.wechat)}
          ${row('อีเมล', formData.contact.email)}
          ${row('ที่อยู่', formData.contact.address)}
          ${formData.contact.channels.length ? `<tr><td colspan="2" style="padding:14px 0;border-bottom:1px solid #F1EFE8"><div style="font-size:12px;color:#6B7280;margin-bottom:6px">ช่องทางที่ต้องการ</div>${channelTags}</td></tr>` : ''}

          ${sec('⚖','รายละเอียดคดี')}
          ${row('มีคู่กรณี', formData.case.counterparty)}
          ${row('สถานะทางกฎหมาย', formData.case.legalStatus)}
          ${row('คู่กรณี', formData.case.opponent)}
          ${formData.case.value ? row('มูลค่า', `${Number(formData.case.value).toLocaleString()} ${formData.case.currency}`) : ''}
          ${row('วันนัดศาล', formData.case.courtDate)}
          ${row('Deadline', formData.case.deadline)}
          ${row('ประวัติ', formData.case.history)}

          ${(docsHas.length || docsNo.length) ? sec('📋','เอกสารที่มี') : ''}
          ${docsHas.length ? `
          <tr><td colspan="2" style="padding:8px 0 4px">
            <div style="font-size:12px;color:#1A5C3A;font-weight:600;margin-bottom:8px">✅ มีพร้อมแล้ว (${docsHas.length})</div>
            ${docsHas.map(d => `<div style="font-size:13px;color:#1A5C3A;padding:4px 0;line-height:1.5">✓ ${esc(d.label)}</div>`).join('')}
          </td></tr>` : ''}
          ${docsNo.length ? `
          <tr><td colspan="2" style="padding:12px 0 4px">
            <div style="font-size:12px;color:#9CA3AF;font-weight:600;margin-bottom:8px">⏳ ยังไม่มี (${docsNo.length})</div>
            ${docsNo.map(d => `<div style="font-size:13px;color:#9CA3AF;padding:4px 0;line-height:1.5">○ ${esc(d.label)}</div>`).join('')}
          </td></tr>` : ''}

          ${(formData.budget || formData.payment) ? sec('💰','งบประมาณ') : ''}
          ${row('งบประมาณ', formData.budget)}
          ${row('รูปแบบชำระเงิน', formData.payment)}

          ${sec('ℹ️','ข้อมูลเพิ่มเติม')}
          ${row('ทราบจาก', formData.additional.source)}
          ${row('ภาษาที่ต้องการ', formData.additional.language)}
          ${row('ผู้แนะนำ', formData.additional.referrer)}
          ${row('หมายเหตุ', formData.additional.extra)}

        </table>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#F8F6EF;padding:22px 36px;border-top:1px solid #E8E4D8;text-align:center">
        <div style="font-size:12px;color:#6B7280;line-height:1.8">
          🔒 ข้อมูลนี้เป็นความลับ — ใช้เพื่อการให้บริการทางกฎหมายเท่านั้น<br>
          <span style="color:#9CA3AF">ส่งโดยอัตโนมัติจากแบบฟอร์มรับลูกค้าใหม่</span>
        </div>
      </td></tr>

    </table>

  </td></tr>
</table>
</body>
</html>`;
}

// ─────────────────────────────────────────────
//  Netlify Function handler
// ─────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { formData, _hp1, _hp2, _ts } = body;

    // ─────────────────────────────────────────────
    //  ANTI-BOT PROTECTION
    // ─────────────────────────────────────────────

    // 1. Honeypot fields — humans can't see these, bots fill them
    if (_hp1 || _hp2) {
      console.log('Bot detected: honeypot filled', { _hp1, _hp2 });
      // Pretend it succeeded so bot doesn't retry — but don't send email
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    // 2. Time check — bots submit instantly, humans take >5 seconds minimum
    if (typeof _ts === 'number' && _ts < 5000) {
      console.log('Bot detected: too fast', { _ts });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    // 3. Basic field validation — block obviously empty/spam submissions
    if (!formData || !formData.client?.nameTh || !formData.contact?.phone || !formData.case?.summary) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // 4. Length limits — protect against payload spam
    if (formData.case.summary.length > 5000 || formData.client.nameTh.length > 200) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Field length exceeded' }) };
    }

    // ─────────────────────────────────────────────
    //  SEND EMAIL
    // ─────────────────────────────────────────────

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const html = buildHTML(formData);
    const priorityLabel = {
      urgent: '🔴 เร่งด่วนมาก',
      high:   '🟠 เร่งด่วน',
      normal: '🟡 ปกติ',
      low:    '🟢 ไม่เร่งด่วน',
    }[formData.priority] || '';

    await transporter.sendMail({
      from: `"แบบฟอร์มลูกค้าใหม่" <${process.env.GMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: `🆕 ลูกค้าใหม่ ${formData.ref} — ${formData.client.nameTh} ${priorityLabel ? '['+priorityLabel+']' : ''}`,
      html: html,
      attachments: [
        {
          filename: `ลูกค้าใหม่_${formData.ref}.html`,
          content: html,
          contentType: 'text/html; charset=utf-8',
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };

  } catch (err) {
    console.error('send-intake error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
