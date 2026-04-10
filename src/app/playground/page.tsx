"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Banco de Dados de Atividades
const ATIVIDADES = [
  { id: 1, titulo: "Estoura Cores", idade: "2-3", tags: ["cores"], desc: "Estoure as bolhas para aprender as cores.", emoji: "🎨", blocked: true },
  { id: 2, titulo: "Som dos Bichos", idade: "2-3", tags: ["sons"], desc: "Aprenda o som de cada animal.", emoji: "🐶", blocked: true },
  { id: 3, titulo: "Festa dos Balões", idade: "4-5", tags: ["abc"], desc: "Estoure os balões e ouça as letras.", emoji: "🎈", blocked: false, link: "/jogo-baloes" },
  { id: 4, titulo: "Contando Maçãs", idade: "4-5", tags: ["numeros"], desc: "Coloque as maçãs na cesta.", emoji: "🍎", blocked: true },
  { id: 5, titulo: "Fábrica de Sílabas", idade: "6", tags: ["abc"], desc: "Junte as letras para formar palavras.", emoji: "🧩", blocked: true },
  { id: 6, titulo: "Pequena Soma", idade: "6", tags: ["numeros"], desc: "Contas simples com desenhos.", emoji: "➕", blocked: true },
  { id: 7, titulo: "Tabuada Espacial", idade: "7-8", tags: ["numeros"], desc: "Acerte os meteoros com os resultados.", emoji: "🚀", blocked: true },
];

function PlaygroundContent() {
  const params = useSearchParams();
  const idadeInicial = params.get('idade') || "2-3";
  
  const [abaAtiva, setAbaAtiva] = useState(idadeInicial);
  const [filtroHabilidade, setFiltroHabilidade] = useState<string | null>(null);

  // Lógica de filtragem
  let listaFiltrada = ATIVIDADES;
  if (abaAtiva === "pais" && filtroHabilidade) {
    listaFiltrada = ATIVIDADES.filter(a => a.tags.includes(filtroHabilidade));
  } else if (abaAtiva !== "pais") {
    listaFiltrada = ATIVIDADES.filter(a => a.idade === abaAtiva);
  }

  return (
    <div className="w-full flex flex-col items-center bg-slate-50 min-h-screen pt-10 pb-20 px-6">
      
      {/* TÍTULO E EXPLICAÇÃO */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-800 mb-2">Área de Missões</h1>
        <p className="text-slate-500 font-bold">Conteúdos escolares adaptados para aprender brincando.</p>
      </div>

      {/* MENU DE SELEÇÃO (ABAS) */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {["2-3", "4-5", "6", "7-8", "pais"].map((aba) => (
          <button
            key={aba}
            onClick={() => { setAbaAtiva(aba); setFiltroHabilidade(null); }}
            className={`px-6 py-3 rounded-full font-black transition-all ${
              abaAtiva === aba 
              ? "bg-sky-500 text-white shadow-lg" 
              : "bg-white text-slate-400 border-2 border-slate-200 hover:border-sky-200"
            }`}
          >
            {aba === "pais" ? "⚙️ Painel dos Pais" : `${aba} anos`}
          </button>
        ))}
      </div>

      {/* FILTROS DOS PAIS (Aparece apenas na aba Painel) */}
      {abaAtiva === "pais" && (
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm mb-10 flex flex-wrap justify-center gap-4">
          <p className="w-full text-center font-bold text-slate-400 mb-2">Deseja focar em qual conteúdo hoje?</p>
          <button onClick={() => setFiltroHabilidade("abc")} className={`px-5 py-2 rounded-xl font-bold ${filtroHabilidade === "abc" ? "bg-purple-500 text-white" : "bg-slate-100 text-slate-500"}`}>🔤 Alfabeto e Leitura</button>
          <button onClick={() => setFiltroHabilidade("numeros")} className={`px-5 py-2 rounded-xl font-bold ${filtroHabilidade === "numeros" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}>🔢 Matemática e Lógica</button>
          <button onClick={() => setFiltroHabilidade("cores")} className={`px-5 py-2 rounded-xl font-bold ${filtroHabilidade === "cores" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"}`}>🎨 Cores e Formas</button>
        </div>
      )}

      {/* GRADE DE ATIVIDADES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {listaFiltrada.map((item) => (
          item.blocked ? (
            <div key={item.id} className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 opacity-60 flex flex-col items-center text-center">
              <span className="text-6xl mb-4">{item.emoji}</span>
              <h3 className="text-2xl font-black text-slate-800 mb-2">{item.titulo}</h3>
              <p className="text-slate-500 font-medium mb-6">{item.desc}</p>
              <div className="mt-auto w-full py-3 bg-slate-100 text-slate-400 font-black rounded-2xl uppercase">Em Breve</div>
            </div>
          ) : (
            <Link key={item.id} href={item.link || "#"} className="group no-underline">
              <div className="bg-white border-4 border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-sky-400 transition-all transform hover:-translate-y-2">
                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">{item.emoji}</span>
                <h3 className="text-2xl font-black text-slate-800 mb-2">{item.titulo}</h3>
                <p className="text-slate-500 font-medium mb-6">{item.desc}</p>
                <div className="mt-auto w-full py-3 bg-sky-500 text-white font-black rounded-2xl uppercase shadow-md shadow-sky-100">Jogar Agora</div>
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
    <Suspense fallback={<div className="p-20 text-center font-bold text-slate-300">Carregando Missões...</div>}>
      <PlaygroundContent />
    </Suspense>
  );
}