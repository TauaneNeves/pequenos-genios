"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const CORES = ['#EF4444', '#3B82F6', '#22C55E', '#FDE047', '#A855F7', '#EC4899', '#38BDF8'];

// EFEITO DE ESTOURO REALISTA: Pedaços de borracha, fumaça de ar e queda livre
const EstouroReal = ({ x, y, cor, letra }: { x: number; y: number; cor: string; letra: string }) => {
  // Array para gerar os pedaços de borracha rasgada
  const pedacosBorracha = Array.from({ length: 8 });

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      zIndex: 100,
      pointerEvents: 'none'
    }}>
      
      {/* 1. Sopro de Ar / Pó de Talco do Balão */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '120px',
        height: '120px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '50%',
        animation: 'soproAr 0.2s ease-out forwards'
      }} />

      {/* 2. Pedaços da Borracha do Balão Voando */}
      {pedacosBorracha.map((_, i) => {
        // Direção da explosão da borracha (360 graus)
        const angulo = (Math.random() * 360) * (Math.PI / 180);
        const forcaVoo = Math.random() * 80 + 40; // O quão longe o pedaço voa
        const destinoX = Math.cos(angulo) * forcaVoo;
        const destinoY = Math.sin(angulo) * forcaVoo;
        const rotacao = Math.random() * 360; // Gira no ar

        // Recortes imitando borracha rasgada e esticada
        const formatosRasgados = [
          'polygon(0% 0%, 100% 20%, 80% 100%, 10% 80%)',
          'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          'polygon(20% 0%, 80% 10%, 100% 100%, 0% 90%)',
          'polygon(0% 20%, 100% 0%, 80% 100%, 20% 100%)'
        ];
        const recorte = formatosRasgados[i % formatosRasgados.length];

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '35px', // Tamanho do pedaço de borracha
              height: '35px',
              backgroundColor: cor, // Mesma cor do balão estourado
              clipPath: recorte, // Aplica o formato rasgado
              animation: `borrachaVoando 0.4s cubic-bezier(0.2, 1, 0.3, 1) forwards`,
              // @ts-ignore
              '--tx': `${destinoX}px`,
              '--ty': `${destinoY}px`,
              '--rot': `${rotacao}deg`
            }}
          />
        );
      })}

      {/* 3. A Letra "caindo" no meio da explosão */}
      <span style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '52px',
        fontWeight: '900',
        color: '#FFFFFF',
        textShadow: '3px 3px 0px #1E293B',
        animation: 'letraCaindo 0.4s ease-in forwards'
      }}>
        {letra}
      </span>
      
    </div>
  );
};

export default function JogoBaloes() {
  const [baloes, setBaloes] = useState<{ id: number; letra: string; x: number; cor: string }[]>([]);
  const [pontos, setPontos] = useState(0);
  const [efeitoEstouro, setEfeitoEstouro] = useState<{ x: number; y: number; cor: string; letra: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Trava de som rigorosa para parar qualquer fala ou som imediatamente
  const pararSons = useCallback(() => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Ao sair da tela, o som é cortado na hora
  useEffect(() => {
    return () => pararSons();
  }, [pararSons]);

  const tocarSomLetra = (letra: string) => {
    pararSons();
    const caminhoAudio = `/sounds/abc/${letra.toLowerCase()}.mp3`;
    audioRef.current = new Audio(caminhoAudio);
    
    audioRef.current.play().catch(() => {
      const msg = new SpeechSynthesisUtterance(letra);
      msg.lang = 'pt-BR';
      msg.rate = 1.0;
      window.speechSynthesis.speak(msg);
    });
  };

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (baloes.length > 10) return;
      setBaloes(prev => [...prev, {
        id: Date.now(),
        letra: ALFABETO[Math.floor(Math.random() * ALFABETO.length)],
        x: Math.random() * 80 + 10,
        cor: CORES[Math.floor(Math.random() * CORES.length)]
      }]);
    }, 1500);
    return () => clearInterval(intervalo);
  }, [baloes.length]);

  const estourar = (e: React.MouseEvent<HTMLButtonElement>, id: number, letra: string, cor: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;
    
    // Dispara a animação com a posição, cor da borracha e a letra
    setEfeitoEstouro({ x: centroX, y: centroY, cor, letra });
    tocarSomLetra(letra);
    
    setBaloes(prev => prev.filter(b => b.id !== id));
    setPontos(prev => prev + 1);
    
    // Limpa o efeito após terminar a animação
    setTimeout(() => setEfeitoEstouro(null), 450);
  };

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#B9E6FF", overflow: "hidden", position: "relative", touchAction: "none" }}>
      
      {/* Placar e Botão Voltar */}
      <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", display: "flex", justifyContent: "space-between", zIndex: 110 }}>
        <Link 
          href="/playground?idade=4-5" 
          onClick={pararSons}
          style={{ textDecoration: "none", padding: "12px 24px", backgroundColor: "#FFFFFF", border: "4px solid #1E293B", borderRadius: "20px", color: "#1E293B", fontWeight: "900", boxShadow: "4px 4px 0px #1E293B" }}
        >
          ⬅ VOLTAR
        </Link>
        <div style={{ padding: "12px 30px", backgroundColor: "#FFFFFF", border: "4px solid #1E293B", borderRadius: "20px", fontSize: "28px", fontWeight: "900", color: "#1E293B", boxShadow: "4px 4px 0px #1E293B" }}>
          PONTOS: {pontos}
        </div>
      </div>

      {/* BALÕES */}
      {baloes.map((balao) => (
        <button
          key={balao.id}
          onClick={(e) => estourar(e, balao.id, balao.letra, balao.cor)}
          style={{
            position: "absolute",
            left: `${balao.x}%`,
            bottom: "-160px",
            width: "110px",
            height: "145px",
            backgroundColor: balao.cor,
            borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
            border: "5px solid #1E293B",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "52px",
            fontWeight: "900",
            color: "#FFFFFF",
            textShadow: "3px 3px 0px #1E293B",
            animation: "subirFluido 7s linear forwards",
            cursor: "pointer",
            outline: "none"
          }}
        >
          {balao.letra}
          <div style={{ position: "absolute", bottom: "-50px", left: "50%", transform: "translateX(-50%)", width: "5px", height: "50px", backgroundColor: "#1E293B" }} />
        </button>
      ))}

      {/* ANIMAÇÃO DO ESTOURO REALISTA */}
      {efeitoEstouro && <EstouroReal {...efeitoEstouro} />}

      {/* REGRAS CSS DAS ANIMAÇÕES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subirFluido {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-65vh) rotate(3deg); }
          100% { transform: translateY(-135vh) rotate(0deg); }
        }
        
        /* 1. Animação da Nuvem de Ar (Rápida e sutil) */
        @keyframes soproAr {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }

        /* 2. Animação da Borracha voando e caindo (Gravidade) */
        @keyframes borrachaVoando {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          70% { opacity: 1; } /* Mantém visível por mais tempo no ar */
          100% { 
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty) + 80px)) scale(0) rotate(var(--rot)); 
            opacity: 0; 
          }
        }

        /* 3. A letra despenca rapidamente e some */
        @keyframes letraCaindo {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, calc(-50% + 60px)) scale(0.4); opacity: 0; }
        }
      `}} />
    </div>
  );
}