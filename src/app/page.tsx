import Link from "next/link";

export default function Home() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "4vh", minHeight: "calc(100vh - 80px)", justifyContent: "center" }}>

      {/* ===================================================
          TÍTULO GIGANTE DINÂMICO (Se adapta à altura da tela)
          =================================================== */}
      <section style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: "max(2vh, 20px)", paddingBottom: "max(2vh, 10px)", paddingLeft: "20px", paddingRight: "20px" }}>
        <svg width="100%" height="100%" viewBox="0 0 800 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: "800px", maxHeight: "18vh" }}>
          <defs>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" /> 
              <stop offset="50%" stopColor="#A855F7" /> 
              <stop offset="100%" stopColor="#FB7185" /> 
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#1E293B" floodOpacity="1" />
            </filter>
          </defs>

          {/* Estrelas decorativas */}
          <path d="M100 20 L105 35 L120 40 L105 45 L100 60 L95 45 L80 40 L95 35 Z" fill="#FBBF24" />
          <path d="M720 110 L725 120 L735 123 L725 126 L720 136 L715 126 L705 123 L715 120 Z" fill="#34D399" />
          <circle cx="150" cy="130" r="8" fill="#FB7185" />
          <circle cx="680" cy="40" r="12" fill="#38BDF8" />

          {/* O Texto Desenhado */}
          <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="900" 
            fontSize="72" 
            fill="url(#textGrad)" 
            stroke="#1E293B" 
            strokeWidth="4"
            filter="url(#shadow)"
            letterSpacing="-2"
          >
            Pequenos Gênios
          </text>

          {/* Subtítulo integrado */}
          <text 
            x="50%" 
            y="85%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="800" 
            fontSize="22" 
            fill="#475569" 
            letterSpacing="1"
          >
            A MAGIA DE APRENDER BRINCANDO
          </text>
        </svg>
      </section>

      {/* ===================================================
          TEXTO DE APRESENTAÇÃO RESPONSIVO
          =================================================== */}
      <section style={{ width: "100%", maxWidth: "800px", textAlign: "center", padding: "0 24px", marginBottom: "max(4vh, 20px)" }}>
        <p style={{ 
          fontSize: "clamp(16px, 2vw, 20px)", /* A mágica: Nunca fica menor que 16px, nem maior que 20px */
          color: "#64748B", 
          lineHeight: "1.6", 
          fontWeight: "600" 
        }}>
          Selecione a fase de aprendizado abaixo. Preparamos desafios visuais, de lógica e alfabetização feitos sob medida para estimular a mente do seu filho longe dos vídeos passivos.
        </p>
      </section>

      {/* ===================================================
          BOTÕES DE IDADE - GRID INTELIGENTE (Celular, Tablet e PC)
          =================================================== */}
      <section style={{ 
        width: "100%", 
        maxWidth: "1000px", 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", /* A mágica do layout: Quebra as colunas sozinho conforme a tela */
        gap: "20px", 
        padding: "0 24px" 
      }}>
        
        {/* Categoria: 2-3 anos */}
        <Link href="/playground" style={{ textDecoration: "none" }}>
          <div style={{ backgroundColor: "#FFFFFF", border: "3px solid #1E293B", borderRadius: "30px", padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "4px 4px 0px #1E293B", transition: "transform 0.2s", height: "100%" }}>
            <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "12px" }}>
              <circle cx="50" cy="50" r="40" fill="#FDE047" stroke="#1E293B" strokeWidth="6"/>
              <path d="M35 45 Q50 20 65 45" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round"/>
              <circle cx="35" cy="55" r="5" fill="#1E293B"/>
              <circle cx="65" cy="55" r="5" fill="#1E293B"/>
              <path d="M45 70 Q50 80 55 70" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: "clamp(20px, 2.5vw, 24px)", fontWeight: "900", color: "#1E293B", textAlign: "center" }}>2 – 3 anos</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#94A3B8", marginTop: "4px" }}>Exploradores</span>
          </div>
        </Link>

        {/* Categoria: 4-5 anos */}
        <Link href="/playground" style={{ textDecoration: "none" }}>
          <div style={{ backgroundColor: "#FFFFFF", border: "3px solid #1E293B", borderRadius: "30px", padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "4px 4px 0px #1E293B", transition: "transform 0.2s", height: "100%" }}>
            <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "12px" }}>
              <path d="M20 70 L50 20 L80 70 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"/>
              <path d="M35 70 L50 45 L65 70" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: "clamp(20px, 2.5vw, 24px)", fontWeight: "900", color: "#1E293B", textAlign: "center" }}>4 – 5 anos</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#94A3B8", marginTop: "4px" }}>Descobridores</span>
          </div>
        </Link>

        {/* Categoria: 6 anos */}
        <Link href="/playground" style={{ textDecoration: "none" }}>
          <div style={{ backgroundColor: "#FFFFFF", border: "3px solid #1E293B", borderRadius: "30px", padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "4px 4px 0px #1E293B", transition: "transform 0.2s", height: "100%" }}>
            <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "12px" }}>
              <rect x="25" y="25" width="50" height="50" rx="10" fill="#A855F7" stroke="#1E293B" strokeWidth="6"/>
              <circle cx="50" cy="50" r="10" fill="#FFF" stroke="#1E293B" strokeWidth="6"/>
            </svg>
            <span style={{ fontSize: "clamp(20px, 2.5vw, 24px)", fontWeight: "900", color: "#1E293B", textAlign: "center" }}>6 anos</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#94A3B8", marginTop: "4px" }}>Aprendizes</span>
          </div>
        </Link>

        {/* Categoria: 7-8 anos */}
        <Link href="/playground" style={{ textDecoration: "none" }}>
          <div style={{ backgroundColor: "#FFFFFF", border: "3px solid #1E293B", borderRadius: "30px", padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "4px 4px 0px #1E293B", transition: "transform 0.2s", height: "100%" }}>
            <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "12px" }}>
              <path d="M20 50 L40 20 L80 20 L60 50 L80 80 L40 80 Z" fill="#FB7185" stroke="#1E293B" strokeWidth="6" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: "clamp(20px, 2.5vw, 24px)", fontWeight: "900", color: "#1E293B", textAlign: "center" }}>7 – 8 anos</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#94A3B8", marginTop: "4px" }}>Gênios</span>
          </div>
        </Link>

      </section>

    </div>
  );
}