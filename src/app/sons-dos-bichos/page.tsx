"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const ANIMAIS = [
  { nome: 'Cachorro', som: 'Au Au!', emoji: '🐶', cor: '#FFD166', msg: 'O cachorro é o melhor amigo!' },
  { nome: 'Gato', som: 'Miau!', emoji: '🐱', cor: '#40C9FF', msg: 'O gato adora fazer miau!' },
  { nome: 'Leão', som: 'Roar!', emoji: '🦁', cor: '#FF7B9C', msg: 'O leão é o rei da floresta!' },
  { nome: 'Vaca', som: 'Muuu!', emoji: '🐮', cor: '#06D6A0', msg: 'A vaca nos dá o leitinho!' },
  { nome: 'Pintinho', som: 'Piu Piu!', emoji: '🐥', cor: '#FDE047', msg: 'O pintinho é bem amarelinho!' },
  { nome: 'Macaco', som: 'U u á á!', emoji: '🐵', cor: '#9D4EDD', msg: 'O macaco adora pular e comer banana!' },
];

export default function SomDosBichos() {
  const [animalAtivo, setAnimalAtivo] = useState<string | null>(null);

  const falarAnimal = (animal: typeof ANIMAIS[0]) => {
    // Cancela falas anteriores
    window.speechSynthesis.cancel();

    const mensagem = new SpeechSynthesisUtterance(`${animal.nome}! ${animal.som}. ${animal.msg}`);
    mensagem.lang = 'pt-BR';
    mensagem.rate = 0.7; // Velocidade lenta para aprendizado
    mensagem.pitch = 1.3; // Tom amigável

    setAnimalAtivo(animal.nome);
    window.speechSynthesis.speak(mensagem);

    // Remove a animação de destaque após a fala (aproximadamente 4 segundos)
    setTimeout(() => {
      setAnimalAtivo(null);
    }, 4000);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F0F9FF", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", boxSizing: "border-box" }}>
      
      {/* MENU SUPERIOR */}
      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", justifyContent: "flex-start", marginBottom: "30px" }}>
        <Link href="/playground?idade=2-3" style={{ textDecoration: "none", padding: "12px 24px", backgroundColor: "#FFFFFF", border: "4px solid #1E293B", borderRadius: "20px", color: "#1E293B", fontWeight: "900", boxShadow: "4px 4px 0px #1E293B" }}>
          ⬅ VOLTAR
        </Link>
      </div>

      {/* TÍTULO */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: "900", color: "#1E293B", margin: "0 0 10px 0" }}>Som dos Bichos</h1>
        <p style={{ fontSize: "clamp(18px, 2.5vw, 22px)", color: "#64748B", fontWeight: "700" }}>Toque nos animais para ouvir seus sons mágicos!</p>
      </div>

      {/* GRADE DE ANIMAIS RESPONSIVA */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "30px", 
        width: "100%", 
        maxWidth: "1100px" 
      }}>
        {ANIMAIS.map((animal) => (
          <button
            key={animal.nome}
            onClick={() => falarAnimal(animal)}
            style={{
              backgroundColor: "#FFFFFF",
              border: "4px solid #1E293B",
              borderRadius: "40px",
              padding: "40px 20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: animalAtivo === animal.nome ? "4px 4px 0px #1E293B" : "8px 8px 0px #1E293B",
              transform: animalAtivo === animal.nome ? "scale(1.05)" : "scale(1)",
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              outline: "none",
              position: "relative"
            }}
          >
            {/* Círculo de Fundo do Animal */}
            <div style={{ 
              width: "140px", 
              height: "140px", 
              backgroundColor: animal.cor, 
              borderRadius: "50%", 
              border: "6px solid #1E293B",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
              fontSize: "80px"
            }}>
              {animal.emoji}
            </div>

            <span style={{ fontSize: "28px", fontWeight: "900", color: "#1E293B", textTransform: "uppercase" }}>
              {animal.nome}
            </span>
            
            {/* Balão de fala que aparece quando ativo */}
            {animalAtivo === animal.nome && (
              <div style={{
                position: "absolute",
                top: "-20px",
                right: "10px",
                backgroundColor: "#1E293B",
                color: "#FFFFFF",
                padding: "10px 20px",
                borderRadius: "20px",
                fontWeight: "900",
                fontSize: "20px",
                animation: "pop 0.3s forwards"
              }}>
                {animal.som}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ESTILOS DE ANIMAÇÃO */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />

      <div style={{ marginTop: "60px", padding: "20px", backgroundColor: "#E2E8F0", borderRadius: "20px", maxWidth: "600px", textAlign: "center" }}>
        <p style={{ margin: 0, color: "#475569", fontWeight: "700" }}>
          Explorar os sons ajuda a criança a desenvolver a fala e o reconhecimento do mundo ao seu redor!
        </p>
      </div>
    </div>
  );
}