'use client';
import { useState } from 'react';
import QRCode from 'qrcode';
import type { VpnProfile } from '@/types';

export default function CountryCard({ profile }: { profile: VpnProfile }) {
  const [qr, setQr] = useState<string | null>(null);

  const downloadConf = () => {
    const blob = new Blob([profile.conf_text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.country}.conf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const showQR = async () => {
    const dataUrl = await QRCode.toDataURL(profile.conf_text);
    setQr(dataUrl);
  };

  return (
    <div className="rounded-2xl shadow p-4 bg-white border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{profile.country}</h3>
          <p className="text-sm text-gray-500">Perfil WireGuard</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadConf} className="px-3 py-2 rounded-xl border">Descarregar .conf</button>
          <button onClick={showQR} className="px-3 py-2 rounded-xl border">Ver QR</button>
        </div>
      </div>
      {qr && (
        <div className="mt-4">
          <img src={qr} alt={`QR ${profile.country}`} className="w-48 h-48" />
        </div>
      )}
    </div>
  );
}
