"use client";
import { useEffect, useState } from "react";
import styles from "./writing.module.css";

export default function WritingPage() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    async function loadWritingExercises() {
      const res = await fetch("/exercises?type=writing");
      const data = await res.json();
      setExercises(data);
    }

    loadWritingExercises();
  }, []);

  if (exercises.length === 0) {
    return <p>Carregando...</p>;
  }

  const exercise = exercises[0];
  const { task, translations } = exercise;

  const normalize = (str) => str.trim().toLowerCase();

  const handleSubmit = () => {
    const correct = translations.some(
      (t) => normalize(t) === normalize(text)
    );

    setIsCorrect(correct);
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      {/* INSTRUÇÃO */}
      <div className={styles.textBox}>
        <p>{task}</p>
      </div>

      {/* TEXTO */}
      <textarea
        className={styles.textArea}
        placeholder="Digite aqui seu texto..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={submitted}
      />

      {/* BOTÃO */}
      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={text.trim().length === 0 || submitted}
      >
        {submitted ? "ENVIADO" : "ENVIAR"}
      </button>

      {/* FEEDBACK */}
      {submitted && (
        <p className={styles.feedback}>
          {isCorrect
            ? "✅ Resposta correta!"
            : "❌ Resposta incorreta."}
        </p>
      )}
    </div>
  );
}
