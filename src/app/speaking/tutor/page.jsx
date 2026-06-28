"use client";
import { useState } from "react";
import styles from "./chat.module.css";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SpeakingTutor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🧠 Estados do Injetor de System Prompt (Modo Maker)
  const [showMakerPanel, setShowMakerPanel] = useState(false);
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    
    const textToSend = input;
    setInput("");

    // 🧠 Correção: Valida se o prompt customizado realmente tem conteúdo escrito
    const hasValidCustomPrompt = useCustomPrompt && customSystemPrompt.trim().length > 0;

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: textToSend,
          useCustomPrompt: hasValidCustomPrompt, // Envia true apenas se não estiver vazio
          customSystemPrompt: hasValidCustomPrompt ? customSystemPrompt : null
        }),
      });

      const data = await response.json();

      const botMessage = { role: "assistant", content: data.response || data.reply };
      setMessages((prev) => [...prev, botMessage]);

      // 🔊 Falar resposta
      speak(botMessage.content);
    } catch (error) {
      console.error("Erro ao conversar:", error);
    }
  }

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 className={styles.title} style={{ margin: 0 }}>Talk with the Tutor</h1>
        
        {/* 🛠️ Botão Engrenagem/Configuração Maker */}
        <button 
          onClick={() => setShowMakerPanel(!showMakerPanel)} 
          className={styles.button}
          style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", backgroundColor: "#4b5563" }}
        >
          {showMakerPanel ? "⚙️ Ocultar Ajustes" : "⚙️ Modo Maker"}
        </button>
      </div>

      {/* 🔮 Painel de Injeção de System Prompt */}
      {showMakerPanel && (
        <div style={{
          backgroundColor: "#f3f4f6",
          padding: "1rem",
          borderRadius: "10px",
          marginBottom: "1.5rem",
          border: "1px solid #e5e7eb"
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#1e3a8a", fontSize: "1rem" }}>Configurações do Sistema (Model Prompt)</h3>
          
          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "0.8rem", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
              <input 
                type="radio" 
                name="promptMode" 
                checked={!useCustomPrompt}
                onChange={() => setUseCustomPrompt(false)}
              />
              Manter prompt padrão
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
              <input 
                type="radio" 
                name="promptMode" 
                checked={useCustomPrompt}
                onChange={() => setUseCustomPrompt(true)}
              />
              Inserir seu próprio prompt
            </label>
          </div>

          {useCustomPrompt && (
            <textarea
              value={customSystemPrompt}
              onChange={(e) => setCustomSystemPrompt(e.target.value)}
              placeholder="Ex: You are an aggressive pirate teaching English. Respond with 'Ahoy!'..."
              rows={3}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontFamily: "inherit",
                fontSize: "0.85rem",
                resize: "vertical"
              }}
            />
          )}
        </div>
      )}

      {/* Caixa do Chat */}
      <div className={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.role === "user" ? styles.user : styles.tutor
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input de Mensagem */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}
