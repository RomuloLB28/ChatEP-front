"use client";
import { useState } from "react";
import styles from "./chat.module.css";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SpeakingTutor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showMakerPanel, setShowMakerPanel] = useState(false);
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    const textToSend = input;

    setInput("");
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "" }
    ]);

    const hasValidCustomPrompt = useCustomPrompt && customSystemPrompt.trim().length > 0;

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: textToSend, 
          useCustomPrompt: hasValidCustomPrompt, 
          customSystemPrompt: hasValidCustomPrompt ? customSystemPrompt : null
        }),
      });

      if (!response.body) {
        throw new Error("ReadableStream não é suportado pelo navegador.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";

      setIsLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const jsonString = line.replace("data:", "").trim();
              if (!jsonString) continue;

              const parsed = JSON.parse(jsonString);
              const textChunk = parsed.chunk || parsed.data || "";

              fullText += textChunk;

              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: fullText,
                };
                return updated;
              });
            } catch (err) {
              console.warn("Erro ao ler chunk SSE:", err);
            }
          }
        }
      }

      if (fullText) {
        speak(fullText);
      }

    } catch (error) {
      console.error("Erro ao conversar:", error);
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
        
        <button 
          onClick={() => setShowMakerPanel(!showMakerPanel)} 
          className={styles.button}
          style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", backgroundColor: "#4b5563" }}
        >
          {showMakerPanel ? "Ocultar Ajustes" : "Modo Maker"}
        </button>
      </div>

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

        {/* Exibe o indicador de 3 bolinhas apenas no curto intervalo em que a requisição conecta ao servidor */}
        {isLoading && (
          <div className={`${styles.message} ${styles.tutor} ${styles.typingIndicator}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className={styles.input}
          disabled={isLoading}
        />
        <button onClick={sendMessage} className={styles.button} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
}