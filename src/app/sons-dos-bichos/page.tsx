"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LISTA_ANIMAIS = [
  { 
    id: 1, 
    nome: 'Cachorro', 
    silabas: [
      { texto: 'Ca', som: 'cá', audioFile: '/sounds/professora/silabas/ca.mp3' }, 
      { texto: 'chor', som: 'xô', audioFile: '/sounds/professora/silabas/cho.mp3' }, 
      { texto: 'ro', som: 'rro', audioFile: '/sounds/professora/silabas/rro.mp3' }
    ],
    foto: '/images/animais/cachorro.png', 
    cor: '#FFD166', 
    somReal: '/sounds/animais/cachorro-latido.mp3',
    audioResposta: '/sounds/professora/nomesanimais/cachorro.mp3'
  },
  { 
    id: 2, 
    nome: 'Gato', 
    silabas: [
      { texto: 'Ga', som: 'gá', audioFile: '/sounds/professora/silabas/ga.mp3' }, 
      { texto: 'to', som: 'tô', audioFile: '/sounds/professora/silabas/to.mp3' }
    ],
    foto: '/images/animais/gato.png', 
    cor: '#40C9FF', 
    somReal: '/sounds/animais/gato-miado.mp3',
    audioResposta: '/sounds/professora/nomesanimais/gato.mp3' 
  },
  { 
    id: 3, 
    nome: 'Cavalo', 
    silabas: [
      { texto: 'Ca', som: 'cá', audioFile: '/sounds/professora/silabas/ca.mp3' }, 
      { texto: 'va', som: 'vá', audioFile: '/sounds/professora/silabas/va.mp3' }, 
      { texto: 'lo', som: 'lô', audioFile: '/sounds/professora/silabas/lo.mp3' }
    ],
    foto: '/images/animais/cavalo.png', 
    cor: '#A855F7', 
    somReal: '/sounds/animais/cavalo-relincho.mp3',
    audioResposta: '/sounds/professora/nomesanimais/cavalo.mp3'
  }
];

export default function SomDosBichos() {
  const [rodando, setRodando] = useState(false);
  const [animalAtual, setAnimalAtual] = useState<typeof LISTA_ANIMAIS[0] | null>(null);
  const [etapa, setEtapa] = useState<'pergunta' | 'resposta'>('pergunta');
  const [silabaAtiva, setSilabaAtiva] = useState<number>(-1);
  
  const audioRealRef = useRef<HTMLAudioElement | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isCancelledRef = useRef(false);

  const pararTudo = useCallback(() => {
    isCancelledRef.current = true;
    window.speechSynthesis.cancel();
    if (audioRealRef.current) {
      audioRealRef.current.pause();
      audioRealRef.current.currentTime = 0;
    }
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => pararTudo();
  }, [pararTudo]);

  const avancarParaProximo = (idxAtual: number) => {
    if (isCancelledRef.current) return;
    const proxIndex = idxAtual + 1;
    
    if (proxIndex < LISTA_ANIMAIS.length) {
      tocarFluxo(proxIndex);
    } else {
      // ===== FIM DO JOGO: Toca a sua frase de comemoração =====
      setRodando(false);
      setAnimalAtual(null);
      
      const audioFim = new Audio('/sounds/professora/fim-do-jogo.mp3');
      audioRealRef.current = audioFim;

      audioFim.play().catch(() => {
        // Fallback usando exatamente a sua frase se o arquivo não for encontrado
        const msgFim = new SpeechSynthesisUtterance("Uau, parabéns! Você adivinhou todos os bichinhos! Que tal a gente brincar de novo?");
        msgFim.lang = 'pt-BR';
        window.speechSynthesis.speak(msgFim);
      });
    }
  };

  const falarSilabas = (animal: typeof LISTA_ANIMAIS[0], idxSorteio: number) => {
    let index = 0;

    const falarProxima = () => {
      if (isCancelledRef.current) return;

      if (index < animal.silabas.length) {
        setSilabaAtiva(index);
        const silaba = animal.silabas[index];

        const proximoPasso = () => {
          if (isCancelledRef.current) return;
          index++;
          const t = setTimeout(falarProxima, 600);
          timeoutsRef.current.push(t);
        };

        if (silaba.audioFile !== '') {
          const audio = new Audio(silaba.audioFile);
          audioRealRef.current = audio;
          
          audio.play().then(() => {
            audio.onended = proximoPasso;
          }).catch((err) => {
            const msg = new SpeechSynthesisUtterance(silaba.som);
            msg.lang = 'pt-BR';
            msg.rate = 0.5;
            msg.onend = proximoPasso;
            window.speechSynthesis.speak(msg);
          });

        } else {
          const msg = new SpeechSynthesisUtterance(silaba.som);
          msg.lang = 'pt-BR';
          msg.rate = 0.5;
          msg.onend = proximoPasso;
          window.speechSynthesis.speak(msg);
        }

      } else {
        const t1 = setTimeout(() => { if (!isCancelledRef.current) setSilabaAtiva(-1); }, 500);
        const t2 = setTimeout(() => { if (!isCancelledRef.current) avancarParaProximo(idxSorteio); }, 2500);
        timeoutsRef.current.push(t1, t2);
      }
    };

    falarProxima();
  };

  const tocarFluxo = (idx: number) => {
    pararTudo();
    
    setTimeout(() => {
      isCancelledRef.current = false;
      const animal = LISTA_ANIMAIS[idx];
      setAnimalAtual(animal);
      setEtapa('pergunta');
      setSilabaAtiva(-1);

      const iniciarSilabas = () => {
        if (isCancelledRef.current) return;
        falarSilabas(animal, idx);
      };

      const continuarParaNomeCompleto = () => {
        if (isCancelledRef.current) return;
        setEtapa('resposta');
        
        if (animal.audioResposta !== '') {
          const audioResposta = new Audio(animal.audioResposta);
          audioRealRef.current = audioResposta;

          audioResposta.play().then(() => {
            audioResposta.onended = iniciarSilabas;
          }).catch(() => {
            const msgRobo = new SpeechSynthesisUtterance(animal.nome);
            msgRobo.lang = 'pt-BR';
            msgRobo.onend = iniciarSilabas;
            window.speechSynthesis.speak(msgRobo);
          });
        } else {
          const msgRobo = new SpeechSynthesisUtterance(animal.nome);
          msgRobo.lang = 'pt-BR';
          msgRobo.onend = iniciarSilabas;
          window.speechSynthesis.speak(msgRobo);
        }
      };

      const continuarParaSomDoBicho = () => {
        if (isCancelledRef.current) return;
        const audioBicho = new Audio(animal.somReal);
        audioRealRef.current = audioBicho;
        
        audioBicho.play().then(() => {
           audioBicho.onended = continuarParaNomeCompleto;
        }).catch(() => continuarParaNomeCompleto());
      };

      const audioPergunta = new Audio('/sounds/professora/qual-animal.mp3');
      audioRealRef.current = audioPergunta;

      audioPergunta.play().then(() => {
        audioPergunta.onended = continuarParaSomDoBicho;
      }).catch(() => {
        const msgPergunta = new SpeechSynthesisUtterance("Você sabe que bicho é esse?");
        msgPergunta.lang = 'pt-BR';
        msgPergunta.rate = 0.9;
        msgPergunta.onend = continuarParaSomDoBicho;
        window.speechSynthesis.speak(msgPergunta);
      });

    }, 100);
  };

  const iniciarJogo = () => {
    setRodando(true);
    tocarFluxo(0); 
  };

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#F0F9FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "15px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
      
      <Link 
        href="/playground?idade=2-3" 
        onClick={pararTudo} 
        style={{ position: "absolute", top: "15px", left: "15px", textDecoration: "none", padding: "10px 20px", backgroundColor: "#FFFFFF", border: "4px solid #1E293B", borderRadius: "15px", color: "#1E293B", fontWeight: "900", boxShadow: "4px 4px 0px #1E293B", zIndex: 100 }}
      >
        ⬅ VOLTAR
      </Link>

      {!rodando ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "aparecer 0.5s ease-out" }}>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: "900", color: "#1E293B", marginBottom: "30px", textAlign: "center" }}>Adivinhe o Animal!</h1>
          
          <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
            {LISTA_ANIMAIS.map(animal => (
              <div key={animal.id} style={{ width: "70px", height: "70px", borderRadius: "50%", border: "4px solid #1E293B", overflow: "hidden", position: "relative", backgroundColor: animal.cor }}>
                <Image src={animal.foto} alt={animal.nome} fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          <button onClick={iniciarJogo} style={{ backgroundColor: "#06D6A0", border: "6px solid #1E293B", borderRadius: "30px", padding: "20px 40px", cursor: "pointer", boxShadow: "6px 6px 0px #1E293B", display: "flex", flexDirection: "column", alignItems: "center", animation: "pulsar 1.5s infinite" }}>
            <span style={{ fontSize: "60px", lineHeight: "1" }}>▶️</span>
            <span style={{ fontSize: "28px", fontWeight: "900", color: "#1E293B", marginTop: "10px" }}>COMEÇAR</span>
          </button>
        </div>
      ) : (
        animalAtual && (
          <div key={animalAtual.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", maxWidth: "800px", animation: "surgirLateral 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards" }}>
            
            <h1 style={{ 
              fontSize: "clamp(28px, 6vw, 56px)", 
              fontWeight: "900", 
              color: "#1E293B", 
              textAlign: "center", 
              margin: "0 0 3vh 0", 
              lineHeight: "1.1" 
            }}>
              Você sabe que bicho é esse?
            </h1>

            <div style={{ 
              width: "min(35vh, 60vw, 350px)", 
              aspectRatio: "1/1", 
              backgroundColor: animalAtual.cor, 
              borderRadius: "15%", 
              border: "6px solid #1E293B", 
              overflow: "hidden", 
              position: "relative", 
              boxShadow: "6px 6px 0px #1E293B" 
            }}>
              <Image src={animalAtual.foto} alt="Animal Oculto" fill style={{ objectFit: 'cover' }} />
            </div>

            <div style={{ 
              minHeight: "10vh", 
              marginTop: "4vh", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              width: "100%" 
            }}>
              {etapa === 'resposta' && (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                  {animalAtual.silabas.map((silaba, index) => (
                    <span 
                      key={index}
                      style={{ 
                        fontSize: "clamp(24px, 5vw, 48px)", 
                        fontWeight: "900", 
                        padding: "10px 20px",
                        backgroundColor: silabaAtiva === index ? "#EF4444" : "#FFFFFF",
                        color: silabaAtiva === index ? "#FFFFFF" : "#1E293B",
                        borderRadius: "15px", 
                        border: "5px solid #1E293B",
                        boxShadow: silabaAtiva === index ? "0px 0px 15px rgba(239, 68, 68, 0.8)" : "4px 4px 0px #1E293B",
                        textTransform: "uppercase", 
                        transition: "all 0.15s ease-out",
                        transform: silabaAtiva === index ? "scale(1.1)" : "scale(1)"
                      }}
                    >
                      {silaba.texto}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        )
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulsar { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes aparecer { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes surgirLateral { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
      `}} />
    </div>
  );
}