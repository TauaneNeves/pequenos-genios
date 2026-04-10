"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ATIVIDADES = [
  { id: 1, titulo: "Pincel Mágico", idade: "2-3", tags: ["cores"], desc: "Escolha um lápis e pinte livremente na tela!", emoji: "🖌️", blocked: false, link: "/estoura-cores", cor: "#FDE047" },
  { id: 2, titulo: "Som dos Bichos", idade: "2-3", tags: ["sons"], desc: "Aprenda o som de cada animal.", emoji: "🐶", blocked: false, link: "/sons-dos-bichos", cor: "#FB7185" },
  { id: 3, titulo: "Festa dos Balões", idade: "4-5", tags: ["abc"], desc: "Estoure os balões e ouça as letras.", emoji: "🎈", blocked: false, link: "/jogo-baloes", cor: "#38BDF8" },
  { id: 4, titulo: "Contando Maçãs", idade: "4-5", tags: ["numeros"], desc: "Coloque as maçãs na cesta.", emoji: "🍎", blocked: true, cor: "#34D399" },
  { id: 5, titulo: "Fábrica de Sílabas", idade: "6", tags: ["abc"], desc: "Junte as letras para formar palavras.", emoji: "🧩", blocked: true, cor: "#A855F7" },
  { id: 6, titulo: "Pequena Soma", idade: "6", tags: ["numeros"], desc: "Contas simples com desenhos.", emoji: "➕", blocked: true, cor: "#FB7185" },
  { id: 7, titulo: "Tabuada Espacial", idade: "7-8", tags: ["numeros"], desc: "Acerte os meteoros com os resultados.", emoji: "🚀", blocked: true, cor: "#38BDF8" },
];

function PlaygroundContent() {
  const params = useSearchParams();
  const idadeInicial = params.get('idade') || "2-3";
  
  const [abaAtiva, setAbaAtiva] = useState(idadeInicial);
  const [filtroHabilidade, setFiltroHabilidade] = useState<string | null>(null);

  let listaFiltrada = ATIVIDADES;
  if (abaAtiva === "pais" && filtroHabilidade) {
    listaFiltrada = ATIVIDADES.filter(a => a.tags.includes(filtroHabilidade));
  } else if (abaAtiva !== "pais") {
    listaFiltrada = ATIVIDADES.filter(a => a.idade === abaAtiva);
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "900", color: "#1E293B", margin: "0 0 10px 0" }}>Área de Missões</h1>
        <p style={{ fontSize: "18px", color: "#64748B", fontWeight: "700" }}>Conteúdos escolares adaptados para aprender brincando.</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "40px" }}>
        {["2-3", "4-5", "6", "7-8", "pais"].map((aba) => (
          <button
            key={aba}
            onClick={() => { setAbaAtiva(aba); setFiltroHabilidade(null); }}
            style={{
              padding: "12px 24px",
              borderRadius: "9999px",
              fontWeight: "800",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.2s",
              border: abaAtiva === aba ? "4px solid #1E293B" : "4px solid #E2E8F0",
              backgroundColor: abaAtiva === aba ? (aba === "pais" ? "#1E293B" : "#38BDF8") : "#FFFFFF",
              color: abaAtiva === aba ? "#FFFFFF" : "#64748B",
              boxShadow: abaAtiva === aba ? "4px 4px 0px #1E293B" : "none"
            }}
          >
            {aba === "pais" ? "⚙️ Painel dos Pais" : `${aba} anos`}
          </button>
        ))}
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: "30px", 
        width: "100%", 
        maxWidth: "1100px" 
      }}>
        {listaFiltrada.map((item) => (
          item.blocked ? (
            <div key={item.id} style={{ backgroundColor: "#FFFFFF", border: "4px solid #E2E8F0", borderRadius: "40px", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", opacity: 0.6 }}>
              <span style={{ fontSize: "60px", marginBottom: "20px" }}>{item.emoji}</span>
              <h3 style={{ fontSize: "24px", fontWeight: "900", color: "#1E293B", margin: "0 0 10px 0" }}>{item.titulo}</h3>
              <p style={{ color: "#94A3B8", fontWeight: "700", textAlign: "center", marginBottom: "20px" }}>{item.desc}</p>
              <div style={{ width: "100%", padding: "12px", backgroundColor: "#F1F5F9", color: "#94A3B8", fontWeight: "900", borderRadius: "20px", textAlign: "center" }}>EM BREVE</div>
            </div>
          ) : (
            <Link key={item.id} href={item.link || "#"} style={{ textDecoration: "none" }}>
              <div style={{ backgroundColor: "#FFFFFF", border: "4px solid #1E293B", borderRadius: "40px", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "6px 6px 0px #1E293B", transition: "transform 0.2s" }}>
                <span style={{ fontSize: "60px", marginBottom: "20px" }}>{item.emoji}</span>
                <h3 style={{ fontSize: "24px", fontWeight: "900", color: "#1E293B", margin: "0 0 10px 0" }}>{item.titulo}</h3>
                <p style={{ color: "#64748B", fontWeight: "700", textAlign: "center", marginBottom: "20px" }}>{item.desc}</p>
                <div style={{ width: "100%", padding: "12px", backgroundColor: item.cor, color: "#1E293B", fontWeight: "900", borderRadius: "20px", textAlign: "center", border: "3px solid #1E293B" }}>JOGAR AGORA</div>
              </div>
            </Link>
          )
        ))}
      </div>
    </div>
  );
}

export default function Playground() {
  return (
    <Suspense fallback={<div style={{ padding: "100px", textAlign: "center", fontWeight: "900", color: "#CBD5E1" }}>CARREGANDO MISSÕES...</div>}>
      <PlaygroundContent />
    </Suspense>
  );
}