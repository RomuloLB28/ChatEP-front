"use client";
import { useState } from "react";
import styles from "./writing.module.css";

export default function WritingPage() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (text.trim().length > 0) setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      {/* Caixa de instrução */}
      <div className={styles.textBox}>
        <h2>Write an email in English</h2>
        <p>
          Requirements: slisoihqdouqshoduhasoudbasbdosbdososbosoubdsobdosbosbos
          bosbsososboosbsbs.  
        </p>
      </div>

      {/* Caixa de texto */}
      <textarea
        className={styles.textArea}
        placeholder="Digite aqui seu texto..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={submitted}
      />

      {/* Botão */}
      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={text.trim().length === 0 || submitted}
      >
        {submitted ? "ENVIADO" : "ENVIAR"}
      </button>

      {/* Feedback */}
      {submitted && (
        <p className={styles.feedback}>
          ✨ Texto enviado com sucesso!
        </p>
      )}
    </div>
  );
}
