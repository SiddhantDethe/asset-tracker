// // app/layout.tsx

import "./globals.css";
import Navbar from "@/app/components/Navbar";
import ClientProvider from "./Clientprovider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <ClientProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto p-6">{children}</main>
        </ClientProvider>
      </body>
    </html>
  );
}

