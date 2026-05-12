"use client";
import { useState } from "react";
import styles from "./chat.module.css";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SpeakingTutor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("")

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);

      setInput("");

      // 🔊 Falar resposta
      speak(data.reply);
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
      <h1 className={styles.title}>Talk with the Tutor</h1>

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
