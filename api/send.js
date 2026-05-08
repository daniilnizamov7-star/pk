export default async function handler(req, res) {
  // Только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, type, budget, comment } = req.body;

  // Валидация
  if (!name || !phone) {
    return res.status(400).json({ error: 'Имя и телефон обязательны' });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID   = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Сервер не настроен' });
  }

  const text = [
    '🖥️ <b>Новая заявка — BYTELAB</b>',
    '',
    `👤 <b>Имя:</b> ${name}`,
    `📞 <b>Телефон:</b> ${phone}`,
    `🔧 <b>Тип:</b> ${type || '—'}`,
    `💰 <b>Бюджет:</b> ${budget || '—'}`,
    comment ? `💬 <b>Комментарий:</b> ${comment}` : '',
    '',
    `🌐 sborkapc74.vercel.app`
  ].filter(Boolean).join('\n');

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: 'HTML'
        })
      }
    );

    const data = await tgRes.json();

    if (data.ok) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(500).json({ error: data.description });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
