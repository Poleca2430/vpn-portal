import { NextRequest, NextResponse } from 'next/server';
import { createClient, type User } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
  { auth: { persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const { adminSecret, email, country, confText } = await req.json();

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    if (!email || !country || !confText) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    // procurar utilizador por email (API nova)
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    let user: User | undefined = users.users.find((u) => u.email === email);

    if (!user) {
      const created = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
      });
      if (!created.data.user) {
        return NextResponse.json({ error: 'cannot create user' }, { status: 500 });
      }
      user = created.data.user;
    }

    const user_id = user.id;

    const { error } = await supabaseAdmin
      .from('vpn_profiles')
      .upsert({ user_id, country, conf_text: confText }, { onConflict: 'user_id,country' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'unexpected';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
