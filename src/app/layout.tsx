import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const nunito = Nunito({ 
  subsets: ["latin"], 
  weight: ["400", "600", "800", "900"] 
});

export const metadata: Metadata = {
  title: "Pequenos Gênios",
  description: "Atividades e jogos educativos sob medida para crianças.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${nunito.className} min-h-screen flex flex-col`} style={{ backgroundColor: "#F8FAFC", color: "#1E293B", margin: 0 }}>
        
        {/* NAVEGAÇÃO ESTILO PÍLULA (IGUAL À IMAGEM) */}
        <nav style={{ 
          width: "100%", 
          backgroundColor: "#FFFFFF", 
          padding: "16px 20px", 
          display: "flex", 
          justifyContent: "center",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}>
          <div style={{ 
            display: "flex", 
            gap: "10px", 
            overflowX: "auto", 
            padding: "4px",
            WebkitOverflowScrolling: "touch" 
          }} className="hide-scrollbar">
            
            <NavLink 
              href="/" 
              label="Início" 
              icon={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></>} 
            />
            <NavLink 
              href="/playground" 
              label="Playground" 
              icon={<><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 12h4"></path><path d="M8 10v4"></path><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line></>} 
            />
            <NavLink 
              href="/mao-na-massa" 
              label="Atividades" 
              icon={<><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></>} 
            />
            <NavLink 
              href="/para-imprimir" 
              label="Para Imprimir" 
              icon={<><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></>} 
            />
            <NavLink 
              href="/como-funciona" 
              label="Como Funciona" 
              icon={<><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></>} 
            />
            
          </div>
        </nav>
        
        <main style={{ width: "100%", flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>

        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          * { box-sizing: border-box; }
        `}} />
      </body>
    </html>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href} style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "8px", 
      padding: "8px 20px", 
      backgroundColor: "#F1F5F9", 
      color: "#475569", 
      fontWeight: "700", 
      borderRadius: "9999px", 
      textDecoration: "none", 
      whiteSpace: "nowrap",
      fontSize: "14px",
      border: "1px solid #E2E8F0"
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
      {label}
    </Link>
  );
}