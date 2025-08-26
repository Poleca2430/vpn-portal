export const metadata = { title: 'VPN Portal', description: 'FR' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-5xl mx-auto p-4">
          <header className="py-4 mb-6 border-b">
            <h1 className="text-2xl font-semibold">VPN Portal</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
