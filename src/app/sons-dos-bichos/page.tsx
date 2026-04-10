"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// BANCO DE DADOS - Organizado com seus novos caminhos de pastas
const LISTA_ANIMAIS = [
  { 
    id: 1,
    nome: 'Cachorro', 
    foto: '/images/animais/cachorro.png', // Caminho da foto que você subiu
    cor: '#FFD166',
    frase: 'O cachorro é o melhor amigo e faz au au!',
    somReal: '/sounds/animais/cachorro-latido.mp3', // Caminho do som que você subiu
  },
  { 
    id: 2,
    nome: 'Gato', 
    foto: '/images/animais/gato.png', 
    cor: '#40C9FF',
    frase: 'O gatinho adora um carinho e faz miau!',
    somReal: '/sounds/animais/gato-miado.mp3', 
  },
  { 
    id: 3,
    nome: 'Leão', 
    foto: '/images/animais/leao.png', 
    cor: '#FF7B9C',
    frase: 'O leão é o rei da floresta e tem um rugido forte!',
    somReal: '/sounds/animais/leao-rugido.mp3', 
  },
  { 
    id: 4,
    nome: 'Vaca', 
    foto: '/images/animais/vaca.png', 
    cor: '#06D6A0',
    frase: 'A vaca nos dá o leitinho e faz muuu!',
    somReal: '/sounds/animais/vaca-mu.mp3', 
  },
  { 
    id: 5,
    nome: 'Cavalo', 
    foto: '/images/animais/cavalo.png', 
    cor: '#A855F7',
    frase: 'O cavalo corre rápido e come capim!',
    somReal: '/sounds/animais/cavalo-relincho.mp3', 
  },
  { 
    id: 6,
    nome: 'Pintinho', 
    foto: '/images/animais/pintinho.png', 
    cor: '#FDE047',
    frase: 'O pintinho é amarelinho e faz piu piu!',
    somReal: '/sounds/animais/pintinho-piu.mp3', 
  }
];

export default function SomDosBichos() {
  const [animalSelecionado, setAnimalSelecionado] = useState<typeof LISTA_ANIMAIS[0] | null>(null);

  const tocarAtividade = (animal: typeof LISTA_ANIMAIS[0]) => {
    // 1. Limpa qualquer fala anterior
    window.speechSynthesis.cancel();
    
    // 2. Abre o Pop-up com a foto
    setAnimalSelecionado(animal);

    // 3. Toca o Som Real (Cachorro latindo, etc)
    if (animal.somReal) {
      const audio = new Audio(animal.somReal);
      audio.play().catch(e => console.log("Erro ao tocar áudio:", e));
    }

    // 4. Voz da "professora" explicando sobre o animal
    const mensagem = new SpeechSynthesisUtterance(animal.frase);
    mensagem.lang = 'pt-BR';
    mensagem.rate = 0.7; 
    mensagem.pitch = 1.4; 
    window.speechSynthesis.speak(mensagem);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F0F9FF", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", boxSizing: "border-box" }}>
      
      {/* BOTÃO VOLTAR */}
      <div style={{ width: "100%", maxWidth: "1000px", marginBottom: "30px" }}>
        <Link href="/playground?idade=2-3" style={{ textDecoration: "none", padding: "12px 24px", backgroundColor: "#FFFFFF", border: "4px solid #1E293B", borderRadius: "20px", color: "#1E293B", fontWeight: "900", boxShadow: "4px 4px 0px #1E293B" }}>
          ⬅ VOLTAR
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 42px)", fontWeight: "900", color: "#1E293B", margin: "0" }}>Quem sou eu?</h1>
        <p style={{ fontSize: "18px", color: "#64748B", fontWeight: "700" }}>Toque no animal para ver a foto e ouvir o som!</p>
      </div>

      {/* GRADE DE ANIMAIS (Botões principais) */}
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
              {/* Mostra a foto miniatura no botão */}
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

      {/* JANELA DA FOTO (POP-UP) */}
      {animalSelecionado && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(30, 41, 59, 0.95)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100, padding: "15px" }}>
          <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "40px", border: "6px solid #1E293B", position: "relative", width: "100%", maxWidth: "550px", textAlign: "center" }}>
            
            <button 
              onClick={() => { setAnimalSelecionado(null); window.speechSynthesis.cancel(); }}
              style={{ position: "absolute", top: "-15px", right: "-15px", width: "50px", height: "50px", backgroundColor: "#FB7185", border: "4px solid #1E293B", borderRadius: "50%", color: "white", fontSize: "24px", fontWeight: "900", cursor: "pointer", boxShadow: "4px 4px 0px #1E293B", zIndex: 101 }}
            >
              X
            </button>

            {/* FOTO GRANDE DO ANIMAL NO POP-UP */}
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