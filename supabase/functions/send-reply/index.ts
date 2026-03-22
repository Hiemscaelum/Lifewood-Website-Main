import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

serve(async (req) => {
  try {
    const { to, subject, text, html, from_name, from_email } = await req.json()

    if (!to || !subject || (!text && !html)) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL')
    if (!apiKey || !fromEmail) {
      return new Response(JSON.stringify({ error: 'Email service not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = {
      from: fromEmail,
      to: [to],
      subject,
      text: text || undefined,
      html: html || undefined,
      reply_to: from_email || undefined,
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text()
      return new Response(JSON.stringify({ error: errorBody || 'Failed to send email.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await resendResponse.json()
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || 'Unexpected error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
