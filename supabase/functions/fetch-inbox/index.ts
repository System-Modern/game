import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

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
    let fetchedMessages: any[] = [];

    // =========================================================================
    // ENGINE 1: 1secmail (Super Cepat 1-2 Detik)
    // =========================================================================
    const secMailDomains = ['1secmail.com', '1secmail.org', '1secmail.net', 'kzccv.com', 'qiott.com', 'wuuvo.com', 'icznn.com'];
    const isSecMail = secMailDomains.includes(domainLower) || (!domainLower.includes('sharklasers') && !domainLower.includes('guerrillamail'));

    if (isSecMail) {
      const activeDomain = secMailDomains.includes(domainLower) ? domainLower : '1secmail.com';
      const cleanLogin = login.toLowerCase().replace(/[^a-z0-9]/g, '');

      try {
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
                  id: String(msg.id),
                  from: msg.from,
                  subject: msg.subject,
                  textBody: msgData.textBody || msgData.body?.replace(/<[^>]*>?/gm, '') || msg.subject,
                  received_at: msg.date || new Date().toISOString(),
                };
              } catch {
                return null;
              }
            });

            fetchedMessages = (await Promise.all(detailPromises)).filter(Boolean);
          }
        }
      } catch (err1) {
        console.error('1secmail error:', err1);
      }
    }

    // =========================================================================
    // ENGINE 2: Guerrilla Mail (sharklasers.com, guerrillamail.com, grr.la)
    // =========================================================================
    if (fetchedMessages.length === 0) {
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
                  id: String(msg.mail_id),
                  from: msg.mail_from,
                  subject: msg.mail_subject,
                  textBody: msgData.mail_body || msg.mail_excerpt || 'Pesan kosong.',
                  received_at: new Date().toISOString(),
                };
              });

              fetchedMessages = await Promise.all(emailPromises);
            }
          }
        }
      } catch (gErr) {
        console.error('Guerrilla fetch error:', gErr);
      }
    }

    // =========================================================================
    // 3. SIMPAN KE DATABASE SUPABASE (Tabel: account_inbox)
    // =========================================================================
    if (fetchedMessages.length > 0 && supabaseUrl && supabaseKey) {
      try {
        for (const msg of fetchedMessages) {
          // Cek apakah pesan sudah tersimpan sebelumnya
          const { data: existing } = await supabase
            .from('account_inbox')
            .select('id')
            .eq('account_email', targetEmail)
            .eq('message_id', msg.id)
            .maybeSingle();

          if (!existing) {
            await supabase.from('account_inbox').insert([
              {
                account_email: targetEmail,
                sender: msg.from,
                subject: msg.subject,
                body_text: msg.textBody,
                message_id: msg.id,
                received_at: msg.received_at || new Date().toISOString(),
              },
            ]);
          }
        }
      } catch (dbErr) {
        console.error('Error saving inbox to Supabase database:', dbErr);
      }
    }

    // =========================================================================
    // 4. AMBIL SELURUH RIWAYAT INBOX DARI DATABASE SUPABASE
    // =========================================================================
    if (supabaseUrl && supabaseKey) {
      try {
        const { data: savedInbox } = await supabase
          .from('account_inbox')
          .select('*')
          .eq('account_email', targetEmail)
          .order('received_at', { ascending: false });

        if (savedInbox && savedInbox.length > 0) {
          const formatted = savedInbox.map((item) => ({
            id: item.message_id || String(item.id),
            from: item.sender,
            subject: item.subject,
            textBody: item.body_text,
            received_at: item.received_at,
          }));

          return new Response(JSON.stringify(formatted), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (fetchErr) {
        console.error('Error fetching stored messages:', fetchErr);
      }
    }

    return new Response(JSON.stringify(fetchedMessages), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});