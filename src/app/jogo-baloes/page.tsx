"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const CORES = ['#EF4444', '#3B82F6', '#22C55E', '#FDE047', '#A855F7', '#EC4899'];

// NOVO: Componente de Estilhaços de Borracha (Parece balão real)
const ParticulaEstouro = ({ x, y, cor }: { x: number; y: number; cor: string }) => {
  const estilhaços = Array.from({ length: 8 }); // Menos partículas, mas maiores e mais irregulares
  
  return (
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 5, transform: 'translate(-50%, -50%)' }}>
      {estilhaços.map((_, i) => {
        const angle = Math.random() * 360; 
        const velocity = Math.random() * 100 + 40; 
        const rotation = Math.random() * 360;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '25px', // Pedaços maiores de "borracha"
              height: '15px',
              backgroundColor: cor,
              border: '3px solid #1E293B', // Borda grossa estilo cápsula
              // clipPath cria formas triangulares/irregulares de estilhaço
              clipPath: 'polygon(20% 0%, 100% 40%, 70% 100%, 0% 80%)',
              opacity: 1,
              animation: `estilhaçar 0.6s ease-out forwards`,
              // @ts-ignore
              '--angle': `${angle}deg`,
              '--distance': `${velocity}px`,
              '--rot': `${rotation}deg`,
            }}
          />
        );
      })}
      
      {/* Círculo de "Onda de Choque" rápida */}
      <div style={{
        position: 'absolute',
        width: '100px',
        height: '100px',
        border: `8px solid ${cor}`,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'ondaChoque 0.4s ease-out forwards'
      }} />
    </div>
  );
};

export default function JogoBaloes() {
  const [baloes, setBaloes] = useState<{ id: number; letra: string; x: number; cor: string }[]>([]);
  const [pontos, setPontos] = useState(0);
  const [efeitoEstouro, setEfeitoEstouro] = useState<{ x: number; y: number; cor: string } | null>(null);

  const tocarSomLetra = (letra: string) => {
    // Busca o som na sua nova pasta /sounds/abc/
    const audio = new Audio(`/sounds/abc/${letra.toLowerCase()}.mp3`);
    audio.play().catch(() => {
      const msg = new SpeechSynthesisUtterance(letra);
      msg.lang = 'pt-BR';
      msg.rate = 0.8;
      window.speechSynthesis.speak(msg);
    });
  };

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (baloes.length > 12) return;
      const novaLetra = ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
      setBaloes(prev => [...prev, {
        id: Date.now(),
        letra: novaLetra,
        x: Math.random() * 80 + 10,
        cor: CORES[Math.floor(Math.random() * CORES.length)]
      }]);
    }, 1700);
    return () => clearInterval(intervalo);
  }, [baloes.length]);

  const estourar = (e: React.MouseEvent<HTMLButtonElement>, id: number, letra: string, cor: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setEfeitoEstouro({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, cor });
    
    tocarSomLetra(letra);
    setBaloes(prev => prev.filter(b => b.id !== id));
    setPontos(prev => prev + 1);
    
    setTimeout(() => setEfeitoEstouro(null), 600);
  };

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#F0F9FF", overflow: "hidden", position: "relative", touchAction: "none" }}>
      
      {/* Placar */}
      <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", display: "flex", justifyContent: "space-between", zIndex: 10 }}>
        <Link href="/playground?idade=4-5" style={{ textDecoration: "none", padding: "12px 24px", backgroundColor: "#FFFFFF", border: "4px solid #1E293B", borderRadius: "20px", color: "#1E293B", fontWeight: "900", boxShadow: "4px 4px 0px #1E293B" }}>
          ⬅ VOLTAR
        </Link>
        <div style={{ padding: "12px 30px", backgroundColor: "#FFFFFF", border: "4px solid #1E293B", borderRadius: "20px", fontSize: "28px", fontWeight: "900", boxShadow: "4px 4px 0px #1E293B" }}>
          PONTOS: {pontos}
        </div>
      </div>

      {baloes.map((balao) => (
        <button
          key={balao.id}
          onClick={(e) => estourar(e, balao.id, balao.letra, balao.cor)}
          style={{
            position: "absolute",
            left: `${balao.x}%`,
            bottom: "-150px",
            width: "110px",
            height: "140px",
            backgroundColor: balao.cor,
            borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
            border: "5px solid #1E293B", // Borda estilo cápsula
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "50px",
            fontWeight: "900",
            color: "#FFFFFF",
            textShadow: "3px 3px 0px #1E293B",
            animation: "subir 7s linear forwards",
            cursor: "pointer",
            outline: "none"
          }}
        >
          {balao.letra}
          <div style={{ position: "absolute", bottom: "-45px", left: "50%", transform: "translateX(-50%)", width: "5px", height: "45px", backgroundColor: "#1E293B" }} />
        </button>
      ))}

      {efeitoEstouro && <ParticulaEstouro {...efeitoEstouro} />}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subir {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(-130vh) rotate(5deg); }
        }
        
        @keyframes estilhaçar {
          0% { transform: translate(0, 0) rotate(0deg) scale(1.5); opacity: 1; }
          100% { 
            transform: translate(calc(cos(var(--angle)) * var(--distance)), calc(sin(var(--angle)) * var(--distance))) rotate(var(--rot)) scale(0); 
            opacity: 0; 
          }
        }

        @keyframes ondaChoque {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `}} />
    </div>
  );
}