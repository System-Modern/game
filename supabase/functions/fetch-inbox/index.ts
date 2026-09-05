import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { targetEmail } = await req.json();

    if (!targetEmail) {
      return new Response(JSON.stringify({ error: 'Email wajib diisi' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (targetEmail.endsWith('@gmail.com')) {
      return new Response(
        JSON.stringify([{
          id: 'notice',
          from: 'System Security',
          subject: 'Pemberitahuan Akun Gmail',
          textBody: 'Email ini menggunakan domain @gmail.com. Silakan login langsung di gmail.com.'
        }]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ambil Username dari alamat email (misal "343.h0daa4rg" dari "343.h0daa4rg@sharklasers.com")
    const [emailUser] = targetEmail.split('@');

    // 1. Set Sesi Email di Guerrilla Mail
    const sessionRes = await fetch(
      `https://api.guerrillamail.com/ajax.php?f=set_email_user&email_user=${encodeURIComponent(emailUser)}&ip=127.0.0.1&agent=Mozilla`
    );
    const sessionData = await sessionRes.json();
    const sid_token = sessionData.sid_token;

    // 2. Ambil Daftar Email Masuk
    const inboxRes = await fetch(
      `https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${sid_token}`
    );
    const inboxData = await inboxRes.json();

    if (!inboxData.list || inboxData.list.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. FILTER: Buang email otomatis dari Guerrilla Mail
    const realEmails = inboxData.list.filter((msg: any) => 
      !msg.mail_from.includes('no-reply@guerrillamail.com') &&
      !msg.mail_from.includes('guerrillamail.com') &&
      !msg.mail_subject.includes('Welcome to Guerrilla Mail')
    );

    if (realEmails.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Fetch detail pesan untuk email yang lolos filter (Email OTP / Kiriman Manual)
    const emailPromises = realEmails.map(async (msg: any) => {
      const fetchMsgRes = await fetch(
        `https://api.guerrillamail.com/ajax.php?f=fetch_email&email_id=${msg.mail_id}&sid_token=${sid_token}`
      );
      const msgData = await fetchMsgRes.json();

      return {
        id: msg.mail_id,
        from: msg.mail_from,
        subject: msg.mail_subject,
        textBody: msgData.mail_body || msg.mail_excerpt || 'Pesan kosong.',
      };
    });

    const formattedInbox = await Promise.all(emailPromises);

    return new Response(JSON.stringify(formattedInbox), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});