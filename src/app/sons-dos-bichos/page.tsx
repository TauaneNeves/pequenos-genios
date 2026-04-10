"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LISTA_ANIMAIS = [
  { id: 1, nome: 'Cachorro', foto: '/images/animais/cachorro.png', cor: '#FFD166', frase: 'O cachorro é o melhor amigo e faz au au!', somReal: '/sounds/animais/cachorro-latido.mp3' },
  { id: 2, nome: 'Gato', foto: '/images/animais/gato.png', cor: '#40C9FF', frase: 'O gatinho adora um carinho e faz miau!', somReal: '/sounds/animais/gato-miado.mp3' },
  // ... outros animais seguindo o mesmo padrão
];

export default function SomDosBichos() {
  const [animalSelecionado, setAnimalSelecionado] = useState<typeof LISTA_ANIMAIS[0] | null>(null);
  const audioRealRef = useRef<HTMLAudioElement | null>(null);

  // FUNÇÃO PARA PARAR TUDO IMEDIATAMENTE (Som real e Voz)
  const pararTudo = useCallback(() => {
    // Para a síntese de voz da professora
    window.speechSynthesis.cancel();
    
    // Para o áudio real do animal
    if (audioRealRef.current) {
      audioRealRef.current.pause();
      audioRealRef.current.currentTime = 0; // Reseta para o início
      audioRealRef.current = null; // Limpa a referência
    }
  }, []);

  // GARANTE QUE O SOM PARE AO SAIR DA PÁGINA
  useEffect(() => {
    return () => pararTudo(); 
  }, [pararTudo]);

  const tocarAtividade = (animal: typeof LISTA_ANIMAIS[0]) => {
    pararTudo(); // Para o som anterior antes de começar o novo

    // Toca o som real do bicho
    const audio = new Audio(animal.somReal);
    audioRealRef.current = audio;
    audio.play().catch(e => console.log("Erro ao tocar áudio:", e));

    // Fala a frase educativa de forma amigável
    const mensagem = new SpeechSynthesisUtterance(animal.frase);
    mensagem.lang = 'pt-BR';
    mensagem.rate = 0.8; 
    mensagem.pitch = 1.3; 
    window.speechSynthesis.speak(mensagem);

    // Abre o Modal com a foto grande
    setAnimalSelecionado(animal);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F0F9FF", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", boxSizing: "border-box" }}>
      
      {/* BOTÃO VOLTAR */}
      <div style={{ width: "100%", maxWidth: "1000px", marginBottom: "30px" }}>
        <Link href="/playground?idade=2-3" onClick={pararTudo} style={{ textDecoration: "none", padding: "12px 24px", backgroundColor: "#FFFFFF", border: "4px solid #1E293B", borderRadius: "20px", color: "#1E293B", fontWeight: "900", boxShadow: "4px 4px 0px #1E293B" }}>
          ⬅ VOLTAR
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 42px)", fontWeight: "900", color: "#1E293B", margin: "0" }}>Quem sou eu?</h1>
        <p style={{ fontSize: "18px", color: "#64748B", fontWeight: "700" }}>Toque no animal para ver a foto e ouvir o som!</p>
      </div>

      {/* GRADE DE ANIMAIS RESPONSIVA */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "25px", width: "100%", maxWidth: "1000px" }}>
        {LISTA_ANIMAIS.map((animal) => (
          <button
            key={animal.id}
            onClick={() => tocarAtividade(animal)}
            style={{
              backgroundColor: "#FFFFFF",
              border: "4px solid #1E293B",
              borderRadius: "40px",
              padding: "30px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "6px 6px 0px #1E293B",
              transition: "transform 0.2s"
            }}
          >
            <div style={{ 
              marginBottom: "15px", 
              backgroundColor: animal.cor, 
              width: "140px", 
              height: "140px", 
              borderRadius: "50%", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              border: "4px solid #1E293B",
              overflow: "hidden",
              position: "relative"
            }}>
              {/* Foto miniatura no botão */}
              <Image 
                src={animal.foto} 
                alt={animal.nome} 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </div>
            <span style={{ fontSize: "22px", fontWeight: "900", color: "#1E293B" }}>{animal.nome.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* JANELA DA FOTO (POP-UP) COM TRAVA DE SOM */}
      {animalSelecionado && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(30, 41, 59, 0.95)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100, padding: "15px" }}>
          <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "40px", border: "6px solid #1E293B", position: "relative", width: "100%", maxWidth: "550px", textAlign: "center" }}>
            
            {/* Botão X para fechar e PARA TUDO O SOM */}
            <button 
              onClick={() => { setAnimalSelecionado(null); pararTudo(); }}
              style={{ position: "absolute", top: "-15px", right: "-15px", width: "50px", height: "50px", backgroundColor: "#FB7185", border: "4px solid #1E293B", borderRadius: "50%", color: "white", fontSize: "24px", fontWeight: "900", cursor: "pointer", boxShadow: "4px 4px 0px #1E293B", zIndex: 101 }}
            >
              X
            </button>

            {/* Foto grande do animal */}
            <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "#F1F5F9", borderRadius: "25px", border: "4px solid #E2E8F0", position: "relative", overflow: "hidden", marginBottom: "20px" }}>
              <Image 
                src={animalSelecionado.foto} 
                alt={animalSelecionado.nome} 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </div>

            <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#1E293B", margin: "0 0 10px 0" }}>{animalSelecionado.nome}!</h2>
            <p style={{ fontSize: "20px", fontWeight: "700", color: "#64748B", margin: 0 }}>{animalSelecionado.frase}</p>
          </div>
        </div>
      )}

    </div>
  );
}