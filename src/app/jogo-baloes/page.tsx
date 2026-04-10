"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const CORES = ['#EF4444', '#3B82F6', '#22C55E', '#FDE047', '#A855F7', '#EC4899', '#38BDF8'];

// EFEITO DE ESTOURO REALISTA: Pedaços de borracha, fumaça de ar e queda livre
const EstouroReal = ({ x, y, cor, letra }: { x: number; y: number; cor: string; letra: string }) => {
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
        const angulo = (Math.random() * 360) * (Math.PI / 180);
        const forcaVoo = Math.random() * 80 + 40;
        const destinoX = Math.cos(angulo) * forcaVoo;
        const destinoY = Math.sin(angulo) * forcaVoo;
        const rotacao = Math.random() * 360;

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
              width: '35px',
              height: '35px',
              backgroundColor: cor,
              clipPath: recorte,
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
  
  const audioLetraRef = useRef<HTMLAudioElement | null>(null);
  const audioPopRef = useRef<HTMLAudioElement | null>(null);

  // Carrega o som de Pop apontando para a sua nova pasta
  useEffect(() => {
    audioPopRef.current = new Audio('/sounds/festadosbaloes/pop-sound.mp3');
    audioPopRef.current.volume = 0.5; // O som do estouro fica um pouco mais baixo
  }, []);

  const pararSons = useCallback(() => {
    window.speechSynthesis.cancel();
    if (audioLetraRef.current) {
      audioLetraRef.current.pause();
      audioLetraRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    return () => pararSons();
  }, [pararSons]);

  const tocarFeedbackCompleto = (letra: string) => {
    pararSons();
    
    // 1. Toca o Efeito "Pop"
    if (audioPopRef.current) {
      const popClone = audioPopRef.current.cloneNode() as HTMLAudioElement;
      popClone.volume = 0.4; // Ajuste do volume do pop
      popClone.play().catch(() => {});
    }

    // 2. Toca a Voz com a Letra
    const caminhoAudio = `/sounds/abc/${letra.toLowerCase()}.mp3`;
    audioLetraRef.current = new Audio(caminhoAudio);
    
    audioLetraRef.current.play().catch(() => {
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
    
    setEfeitoEstouro({ x: centroX, y: centroY, cor, letra });
    
    // Dispara o som duplo (Estouro + Letra)
    tocarFeedbackCompleto(letra);
    
    setBaloes(prev => prev.filter(b => b.id !== id));
    setPontos(prev => prev + 1);
    
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
        
        @keyframes soproAr {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }

        @keyframes borrachaVoando {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          70% { opacity: 1; } 
          100% { 
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty) + 80px)) scale(0) rotate(var(--rot)); 
            opacity: 0; 
          }
        }

        @keyframes letraCaindo {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, calc(-50% + 60px)) scale(0.4); opacity: 0; }
        }
      `}} />
    </div>
  );
}