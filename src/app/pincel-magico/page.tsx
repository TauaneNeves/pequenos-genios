"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

// BANCO DE DADOS - Agora com o caminho para os seus ficheiros mp3
const CORES_LAPIS = [
  { nome: 'Vermelho', valor: '#EF4444', audio: '/sounds/professora/cores/vermelho.mp3' },
  { nome: 'Azul', valor: '#3B82F6', audio: '/sounds/professora/cores/azul.mp3' },
  { nome: 'Verde', valor: '#22C55E', audio: '/sounds/professora/cores/verde.mp3' },
  { nome: 'Amarelo', valor: '#FDE047', audio: '/sounds/professora/cores/amarelo.mp3' },
  { nome: 'Rosa', valor: '#EC4899', audio: '/sounds/professora/cores/rosa.mp3' },
  { nome: 'Roxo', valor: '#A855F7', audio: '/sounds/professora/cores/roxo.mp3' },
];

export default function PincelMagico() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Referência para controlar o áudio
  const [corSelecionada, setCorSelecionada] = useState(CORES_LAPIS[1]); // Começa com Azul por exemplo
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const limparDesenho = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx?.drawImage(canvas, 0, 0);

    canvas.width = container.offsetWidth - 16; 
    canvas.height = Math.min(window.innerHeight * 0.5, 450); 

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 15;
      ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (audioRef.current) {
        audioRef.current.pause(); // Para o som se sair da página
      }
    };
  }, [resizeCanvas]);

  // FUNÇÃO ATUALIZADA: Agora toca o seu ficheiro MP3
  const selecionarCor = (cor: typeof CORES_LAPIS[0]) => {
    // Para qualquer áudio ou voz que esteja a tocar
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Toca o seu ficheiro de áudio
    const novoAudio = new Audio(cor.audio);
    audioRef.current = novoAudio;
    novoAudio.play().catch(err => {
      console.log("Erro ao tocar áudio, usando voz de reserva:", err);
      // Fallback: Se o ficheiro não for encontrado, usa o robô para não ficar sem som
      const mensagem = new SpeechSynthesisUtterance(cor.nome);
      mensagem.lang = 'pt-BR';
      window.speechSynthesis.speak(mensagem);
    });

    setCorSelecionada(cor);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCoordinates(e);
    setLastPos(pos);
    setIsDrawing(true);
    if ('touches' in e && e.cancelable) e.preventDefault();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentPos = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.strokeStyle = corSelecionada.valor;
    ctx.stroke();

    setLastPos(currentPos);
    if ('touches' in e && e.cancelable) e.preventDefault();
  };

  const stopDrawing = () => setIsDrawing(false);

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F0F9FF", display: "flex", flexDirection: "column", alignItems: "center", padding: "15px", boxSizing: "border-box" }}>
      
      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <Link href="/playground?idade=2-3" style={{ textDecoration: "none", padding: "10px 20px", backgroundColor: "#FFFFFF", border: "4px solid #1E293B", borderRadius: "15px", color: "#1E293B", fontWeight: "900", boxShadow: "4px 4px 0px #1E293B" }}>
          ⬅ VOLTAR
        </Link>
        <button onClick={limparDesenho} style={{ padding: "10px 20px", backgroundColor: "#FF7B9C", border: "4px solid #1E293B", borderRadius: "15px", color: "#FFFFFF", fontWeight: "900", boxShadow: "4px 4px 0px #1E293B", cursor: "pointer" }}>
          LIMPAR TELA
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "900", color: "#1E293B", margin: "0" }}>Pincel Mágico</h1>
        <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "#64748B", fontWeight: "700" }}>Escolha uma cor e pinte o que você imaginar!</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: "1100px" }}>
        
        <div ref={containerRef} style={{ flex: "1 1 300px", width: "100%", maxWidth: "650px", backgroundColor: "#FFFFFF", border: "8px solid #1E293B", borderRadius: "40px", boxShadow: "10px 10px 0px #1E293B", overflow: "hidden", touchAction: "none", position: "relative" }}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ display: "block", cursor: "crosshair", width: "100%" }}
          />
        </div>

        <div style={{ flex: "0 1 auto", width: "100%", maxWidth: "450px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
          {CORES_LAPIS.map((lapis) => (
            <button
              key={lapis.nome}
              onClick={() => selecionarCor(lapis)}
              style={{
                backgroundColor: "#FFFFFF",
                border: corSelecionada.nome === lapis.nome ? "6px solid #1E293B" : "4px solid #E2E8F0",
                borderRadius: "25px",
                padding: "15px 5px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: corSelecionada.nome === lapis.nome ? "4px 4px 0px #1E293B" : "none",
                transform: corSelecionada.nome === lapis.nome ? "scale(1.05)" : "scale(1)",
                transition: "0.2s"
              }}
            >
              <svg width="35" height="55" viewBox="0 0 40 100">
                <path d="M0 20 L20 0 L40 20 V100 H0 Z" fill={lapis.valor} stroke="#1E293B" strokeWidth="4"/>
                <path d="M0 20 L20 40 L40 20" fill="none" stroke="#1E293B" strokeWidth="4"/>
              </svg>
              <span style={{ fontSize: "14px", fontWeight: "900", color: "#1E293B", marginTop: "10px" }}>{lapis.nome.toUpperCase()}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}