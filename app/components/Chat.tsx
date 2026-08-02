"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGESTOES = [
  "Como faço um Pix?",
  "Quero aprender a usar o WhatsApp",
  "Meu Wi-Fi não conecta",
  "Como abro um documento no Word?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function enviar(texto: string) {
    const conteudo = texto.trim();
    if (!conteudo || loading) return;

    const novasMensagens: Message[] = [...messages, { role: "user", content: conteudo }];
    setMessages(novasMensagens);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: novasMensagens }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages([
          ...novasMensagens,
          { role: "assistant", content: data.error ?? "Algo deu errado. Vamos tentar de novo?" },
        ]);
      } else {
        setMessages([...novasMensagens, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages([
        ...novasMensagens,
        { role: "assistant", content: "Não consegui me conectar agora. Verifique sua internet e tente de novo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-guia-sand bg-guia-panel px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-full bg-guia-blue text-xl font-bold text-white"
          >
            G
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight text-guia-ink">
              Guia Fácil
            </h1>
            <p className="text-sm text-guia-ink/60">Sempre com calma, passo a passo</p>
          </div>
        </div>

        <div className="flex items-center gap-1" role="group" aria-label="Tamanho do texto">
          <button
            onClick={() => setFontScale((s) => Math.max(0.85, +(s - 0.15).toFixed(2)))}
            className="h-10 w-10 rounded-xl2 border border-guia-sand bg-white text-lg font-bold text-guia-blueDark hover:bg-guia-sand"
            aria-label="Diminuir tamanho do texto"
          >
            A−
          </button>
          <button
            onClick={() => setFontScale((s) => Math.min(1.6, +(s + 0.15).toFixed(2)))}
            className="h-10 w-10 rounded-xl2 border border-guia-sand bg-white text-lg font-bold text-guia-blueDark hover:bg-guia-sand"
            aria-label="Aumentar tamanho do texto"
          >
            A+
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-5 py-6">
        {messages.length === 0 && (
          <div className="rounded-xl2 border border-guia-sand bg-guia-panel p-6">
            <p className="mb-4 text-guia-ink">
              Olá! Eu sou o Guia Fácil. Pode me contar o que você quer aprender a fazer —
              vamos em etapas simples, no seu ritmo.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="rounded-full border border-guia-blue/30 bg-guia-sand px-4 py-2 text-sm text-guia-blueDark hover:bg-guia-blue hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl2 px-5 py-3 leading-relaxed ${
              m.role === "user"
                ? "self-end bg-guia-blue text-white"
                : "self-start border border-guia-sand bg-guia-panel text-guia-ink"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="self-start rounded-xl2 border border-guia-sand bg-guia-panel px-5 py-3 text-guia-ink/60">
            Pensando na melhor forma de explicar...
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(input);
        }}
        className="border-t border-guia-sand bg-guia-panel px-5 py-4"
      >
        <div className="mx-auto flex max-w-2xl gap-2">
          <label htmlFor="mensagem" className="sr-only">
            Escreva sua pergunta
          </label>
          <input
            id="mensagem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva aqui o que você precisa..."
            className="flex-1 rounded-xl2 border border-guia-sand bg-guia-bg px-4 py-3 text-guia-ink outline-none focus-visible:border-guia-blue"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl2 bg-guia-green px-6 py-3 font-bold text-white disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
