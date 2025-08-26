'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { VpnProfile } from '@/types';
import CountryCard from '@/components/CountryCard';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<VpnProfile[]>([]);
  const [health, setHealth] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) setUserId(u.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setUserId(sess?.user?.id ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const { data, error } = await supabase
        .from('vpn_profiles')
        .select('*')
        .order('country');
      if (error) setError(error.message); else setProfiles(data as VpnProfile[]);
      const hc = await fetch('/api/health', { cache: 'no-store' }).then(r => r.json());
      setHealth(hc);
    };
    load();
  }, [userId]);

  const signUp = async () => {
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  };

  const signIn = async () => {
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  };

  const signOut = async () => { await supabase.auth.signOut(); setProfiles([]); };

  if (!userId) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Entrar</h2>
        <div className="space-y-3">
          <input className="w-full border rounded-xl p-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded-xl p-2" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button onClick={signIn} disabled={loading} className="px-4 py-2 rounded-xl border">Login</button>
            <button onClick={signUp} disabled={loading} className="px-4 py-2 rounded-xl border">Registar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Os meus perfis</h2>
        <button onClick={signOut} className="px-3 py-2 rounded-xl border">Sair</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {profiles.map(p => (<CountryCard key={p.id} profile={p} />))}
      </div>

      <div className="mt-6 p-4 bg-white rounded-2xl border">
        <h3 className="font-medium mb-2">Estado do Servidor</h3>
        <pre className="text-sm bg-gray-50 p-2 rounded-xl overflow-auto">{JSON.stringify(health, null, 2)}</pre>
      </div>
    </div>
  );
}
