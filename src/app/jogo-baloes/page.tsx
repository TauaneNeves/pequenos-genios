"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const COLORS = ['#FF7B9C', '#40C9FF', '#FFD166', '#06D6A0', '#9D4EDD'];

type BalloonType = {
  id: number;
  letter: string;
  color: string;
  x: number; 
  y: number; 
  popped: boolean;
  speed: number;
};

type GameState = 'menu' | 'playing';

export default function FestaDosBaloes() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState<number>(0);
  const [balloons, setBalloons] = useState<BalloonType[]>([]);

  const playPopSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (error) {
      console.log("Áudio não suportado");
    }
  };

  const playRealVoice = (letter: string) => {
    try {
      const audio = new Audio(`/sounds/${letter}.mp3`);
      audio.play().catch(() => {});
    } catch (error) {}
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.filter(b => !b.popped).length >= 8) return prev;

        const newBalloon: BalloonType = {
          id: Date.now() + Math.random(),
          letter: ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          x: 10 + Math.random() * 70,
          y: -20, 
          popped: false,
          speed: 0.4 + Math.random() * 0.6, 
        };

        return [...prev, newBalloon];
      });
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveInterval = setInterval(() => {
      setBalloons((prev) => 
        prev
          .map((b) => ({ ...b, y: !b.popped ? b.y + b.speed : b.y }))
          .filter((b) => b.y < 120)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameState]);

  const handlePop = (id: number, letter: string) => {
    playPopSound();
    playRealVoice(letter);
    setScore((prev) => prev + 1);
    setBalloons((prev) => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setTimeout(() => {
      setBalloons((prev) => prev.filter(b => b.id !== id));
    }, 400);
  };

  const startGame = () => {
    try {
        const audio = new Audio();
        audio.play().catch(() => {});
    } catch(e) {}
    
    setScore(0);
    setBalloons([]);
    setGameState('playing');
  };

  return (
    <div className="w-full flex flex-col items-center animate-pop">
      
      {/* Cabeçalho do Jogo */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <Link href="/" className="px-6 py-3 bg-white text-kids-text text-xl font-bold rounded-2xl border-4 border-kids-text shadow-[0_6px_0_#1D3557] hover:translate-y-1 hover:shadow-[0_2px_0_#1D3557] active:translate-y-2 active:shadow-none transition-all">
          ⬅ Voltar
        </Link>
        
        {gameState === 'playing' && (
          <div className="bg-kids-yellow px-8 py-3 rounded-2xl border-4 border-kids-text shadow-[0_6px_0_#1D3557]">
            <h2 className="text-2xl font-bold text-kids-text flex items-center gap-2">
              Pontos: <span className="text-4xl text-white ml-2" style={{ WebkitTextStroke: '2px #1D3557' }}>{score}</span>
            </h2>
          </div>
        )}
      </div>

      {/* Área do Jogo */}
      <div className="relative w-full max-w-3xl h-[650px] bg-[#BCE6FC] rounded-[3rem] border-8 border-white shadow-[0_15px_30px_rgba(29,53,87,0.2)] overflow-hidden cursor-crosshair">
        
        {/* Nuvens Mais Fofinhas ao Fundo */}
        <div className="absolute top-12 left-10 opacity-70 animate-float">
          <svg width="150" height="90" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 40C30 23.4315 43.4315 10 60 10C76.5685 10 90 23.4315 90 40C106.569 40 120 53.4315 120 70H0C0 53.4315 13.4315 40 30 40Z" fill="#FFFFFF"/>
          </svg>
        </div>
        <div className="absolute top-40 right-12 opacity-70 animate-float" style={{ animationDelay: '1s' }}>
          <svg width="120" height="70" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 40C30 23.4315 43.4315 10 60 10C76.5685 10 90 23.4315 90 40C106.569 40 120 53.4315 120 70H0C0 53.4315 13.4315 40 30 40Z" fill="#FFFFFF"/>
          </svg>
        </div>

        {/* MENU INICIAL DO JOGO */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#BCE6FC]/50 backdrop-blur-sm z-20">
            <div className="bg-white w-96 rounded-[3rem] p-10 border-8 border-kids-text shadow-[0_15px_0_#1D3557] flex flex-col items-center text-center animate-bounce-slow">
              
              <div className="bg-kids-pink w-32 h-32 rounded-full flex justify-center items-center mb-6 border-4 border-kids-text animate-wiggle">
                <svg width="70" height="90" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 90C50 90 45 105 40 115" stroke="#1D3557" strokeWidth="6" strokeLinecap="round"/>
                  <path d="M50 15C30.67 15 15 30.67 15 50C15 75 40 90 50 90C60 90 85 75 85 50C85 30.67 69.33 15 50 15Z" fill="#FFD166" stroke="#1D3557" strokeWidth="8" strokeLinejoin="round"/>
                  <path d="M35 35C40 30 48 30 48 30" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" opacity="0.8"/>
                </svg>
              </div>

              <h2 className="text-4xl font-bold text-kids-text mb-4">Festa dos Balões!</h2>
              <p className="text-kids-text text-xl font-medium mb-8">
                Estoure os balões e ouça as letras mágicas!
              </p>

              <button 
                onClick={startGame}
                className="w-full py-5 bg-kids-green text-white text-3xl font-bold rounded-[2rem] border-4 border-kids-text shadow-[0_8px_0_#1D3557] hover:translate-y-1 hover:shadow-[0_4px_0_#1D3557] active:translate-y-2 active:shadow-none transition-all"
                style={{ WebkitTextStroke: '1px #1D3557' }}
              >
                ▶ JOGAR
              </button>
            </div>
          </div>
        )}

        {/* RENDERIZAÇÃO DOS BALÕES */}
        {gameState === 'playing' && balloons.map((balloon) => (
          <div
            key={balloon.id}
            className="absolute transition-transform"
            style={{ left: `${balloon.x}%`, bottom: `${balloon.y}%` }}
          >
            {balloon.popped ? (
              <div className="relative flex justify-center items-center scale-150 transition-all duration-300">
                 <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 10 L55 35 L85 20 L65 45 L95 60 L65 65 L75 90 L50 75 L25 90 L35 65 L5 60 L35 45 L15 20 L45 35 Z" fill="#FFFFFF" stroke={balloon.color} strokeWidth="6" strokeLinejoin="round"/>
                 </svg>
                 <span className="absolute text-6xl font-bold text-kids-text" style={{ WebkitTextStroke: `2px ${balloon.color}` }}>
                  {balloon.letter}
                 </span>
              </div>
            ) : (
              <div 
                onClick={() => handlePop(balloon.id, balloon.letter)}
                className="relative flex justify-center items-center cursor-pointer hover:scale-110 active:scale-90 transition-transform"
              >
                <svg width="100" height="130" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 90C50 90 45 105 40 115" stroke="#1D3557" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M50 15C30.67 15 15 30.67 15 50C15 75 40 90 50 90C60 90 85 75 85 50C85 30.67 69.33 15 50 15Z" fill={balloon.color} stroke="#1D3557" strokeWidth="6" strokeLinejoin="round"/>
                  <path d="M35 35C40 30 48 30 48 30" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" opacity="0.6"/>
                  <path d="M45 90L55 90L52 95H48L45 90Z" fill={balloon.color} stroke="#1D3557" strokeWidth="5" strokeLinejoin="round"/>
                </svg>
                <span className="absolute top-[40px] text-5xl font-bold text-white pointer-events-none" style={{ WebkitTextStroke: '2px #1D3557' }}>
                  {balloon.letter}
                </span>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}