"use client";

import React from 'react';
import Link from 'next/link';

const ANIMAIS = [
  { nome: 'Cachorro', som: 'Au Au!', emoji: '🐶', cor: 'bg-orange-100', borda: 'border-orange-200' },
  { nome: 'Gato', som: 'Miau!', emoji: '🐱', cor: 'bg-slate-100', borda: 'border-slate-200' },
  { nome: 'Leão', som: 'Roar!', emoji: '🦁', cor: 'bg-amber-100', borda: 'border-amber-200' },
  { nome: 'Vaca', som: 'Muuu!', emoji: '🐮', cor: 'bg-emerald-500/10', borda: 'border-emerald-200' },
  { nome: 'Pintinho', som: 'Piu Piu!', emoji: '🐥', cor: 'bg-yellow-100', borda: 'border-yellow-200' },
  { nome: 'Macaco', som: 'U u á á!', emoji: '🐵', cor: 'bg-stone-100', borda: 'border-stone-200' },
];

export default function SonsDosBichos() {
  const falar = (animal: typeof ANIMAIS[0]) => {
    const utterance = new SpeechSynthesisUtterance(`${animal.nome}! ${animal.som}`);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-5xl flex justify-start mb-10">
        <Link href="/playground?idade=2-3" className="px-6 py-3 bg-slate-100 font-bold rounded-2xl border-2 border-slate-200">
          ⬅ Voltar
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-800 mb-2">Sinfonia dos Bichos</h1>
        <p className="text-xl text-slate-500 font-bold">Toque nos animais para ouvir seus nomes e sons!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {ANIMAIS.map((animal) => (
          <button
            key={animal.nome}
            onClick={() => falar(animal)}
            className={`group ${animal.cor} border-4 ${animal.borda} rounded-[2.5rem] p-8 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-xl`}
          >
            <span className="text-8xl mb-4 group-hover:rotate-12 transition-transform">{animal.emoji}</span>
            <span className="text-2xl font-black text-slate-700 uppercase tracking-wide">{animal.nome}</span>
          </button>
        ))}
      </div>
    </div>
  );
}