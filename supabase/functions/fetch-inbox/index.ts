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

    // Penanganan khusus Gmail
    if (targetEmail.endsWith('@gmail.com')) {
      return new Response(
        JSON.stringify([{
          id: 'notice',
          from: 'System Security',
          subject: 'Pemberitahuan Akun Gmail',
          textBody: 'Email ini menggunakan domain @gmail.com. Silakan login langsung di mail.google.com.'
        }]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [login, domain] = targetEmail.split('@');
    const domainLower = (domain || '').toLowerCase();

    // =========================================================================
    // ENGINE 1: 1secmail (Ultra Cepat & Real-Time Instant Delivery)
    // Domain: 1secmail.com, 1secmail.org, 1secmail.net, kzccv.com, qiott.com, wuuvo.com, icznn.com
    // =========================================================================
    const secMailDomains = ['1secmail.com', '1secmail.org', '1secmail.net', 'kzccv.com', 'qiott.com', 'wuuvo.com', 'icznn.com'];
    const isSecMail = secMailDomains.includes(domainLower) || !domainLower.includes('sharklasers') && !domainLower.includes('guerrillamail');

    if (isSecMail) {
      const activeDomain = secMailDomains.includes(domainLower) ? domainLower : '1secmail.com';
      const cleanLogin = login.toLowerCase().replace(/[^a-z0-9]/g, '');

      const listRes = await fetch(
        `https://www.1secmail.com/api/v1/?action=getMessages&login=${encodeURIComponent(cleanLogin)}&domain=${encodeURIComponent(activeDomain)}`
      );

      if (listRes.ok) {
        const messages = await listRes.json();
        if (Array.isArray(messages) && messages.length > 0) {
          const detailPromises = messages.map(async (msg: any) => {
            try {
              const msgRes = await fetch(
                `https://www.1secmail.com/api/v1/?action=readMessage&login=${encodeURIComponent(cleanLogin)}&domain=${encodeURIComponent(activeDomain)}&id=${msg.id}`
              );
              if (!msgRes.ok) return null;
              const msgData = await msgRes.json();
              return {
                id: msg.id,
                from: msg.from,
                subject: msg.subject,
                textBody: msgData.textBody || msgData.body?.replace(/<[^>]*>?/gm, '') || msg.subject,
                received_at: msg.date || new Date().toISOString(),
              };
            } catch {
              return null;
            }
          });

          const results = (await Promise.all(detailPromises)).filter(Boolean);
          if (results.length > 0) {
            return new Response(JSON.stringify(results), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      }
    }

    // =========================================================================
    // ENGINE 2: Guerrilla Mail (sharklasers.com, guerrillamail.com, grr.la)
    // =========================================================================
    try {
      const sessionRes = await fetch(
        `https://api.guerrillamail.com/ajax.php?f=set_email_user&email_user=${encodeURIComponent(login)}&ip=127.0.0.1&agent=Mozilla`
      );
      const sessionData = await sessionRes.json();
      const sid_token = sessionData?.sid_token;

      if (sid_token) {
        const inboxRes = await fetch(
          `https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${sid_token}`
        );
        const inboxData = await inboxRes.json();

        if (inboxData.list && inboxData.list.length > 0) {
          const realEmails = inboxData.list.filter((msg: any) =>
            !msg.mail_from.includes('no-reply@guerrillamail.com') &&
            !msg.mail_from.includes('guerrillamail.com') &&
            !msg.mail_subject.includes('Welcome to Guerrilla Mail')
          );

          if (realEmails.length > 0) {
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
                received_at: new Date().toISOString(),
              };
            });

            const formattedInbox = await Promise.all(emailPromises);
            return new Response(JSON.stringify(formattedInbox), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      }
    } catch (gErr) {
      console.error('Guerrilla fetch error:', gErr);
    }

    // Jika belum ada pesan masuk
    return new Response(JSON.stringify([]), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});