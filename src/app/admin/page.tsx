'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState<'FR'>('FR');
  const [confText, setConfText] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    setMsg(null);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminSecret, email, country, confText })
    });
    const data = await res.json();
    if (!res.ok) setMsg(`Erro: ${data.error || res.statusText}`);
    else setMsg('OK! Perfil gravado.');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6 space-y-3">
      <h2 className="text-xl font-semibold">Admin · Associar .conf ao utilizador</h2>
      <input className="w-full border rounded-xl p-2" placeholder="ADMIN_SECRET" value={adminSecret} onChange={e=>setAdminSecret(e.target.value)} />
      <input className="w-full border rounded-xl p-2" placeholder="email do utilizador" value={email} onChange={e=>setEmail(e.target.value)} />
      <select className="w-full border rounded-xl p-2" value={country} onChange={e=>setCountry(e.target.value as 'FR')}>
        <option value="FR">França</option>
      </select>
      <textarea className="w-full border rounded-xl p-2 h-48" placeholder="cola aqui o conteúdo do ficheiro .conf" value={confText} onChange={e=>setConfText(e.target.value)} />
      <button onClick={submit} className="px-4 py-2 rounded-xl border">Gravar</button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
