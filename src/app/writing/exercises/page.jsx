"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./writing.module.css";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function WritingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadWritingExercises() {
      const res = await fetch(`${API_URL}/exercises?type=writing`);
      const data = await res.json();
      setExercises(data);
    }

    loadWritingExercises();
  }, []);

  if (exercises.length === 0) {
    return <p>Carregando...</p>;
  }

  const exercise = exercises[currentIndex];
  const { task, translations, _id, level } = exercise;

  const normalize = (str) => str.trim().toLowerCase();

  const handleSubmit = async () => {
    if (!session?.backendToken) return;

    const correct = translations.some(
      (t) => normalize(t) === normalize(text)
    );

    const payload = {
      exerciseId: _id,
      type: "writing",
      level,
      userAnswer: text,
      isCorrect: correct,
      score: correct ? 1 : 0,
    };

    await fetch(`${API_URL}/user-exercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
      body: JSON.stringify(payload),
    });

    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setText("");
    setSubmitted(false);
    setIsCorrect(null);
  };

  const handleNextExercise = () => {
    setCurrentIndex((prev) => (prev + 1 < exercises.length ? prev + 1 : 0));
    setText("");
    setSubmitted(false);
    setIsCorrect(null);
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
        disabled={submitted}
        onChange={(e) => setText(e.target.value)}
      />

      {/* BOTÕES */}
      <div style={{ display: "flex", gap: "12px" }}>
        {!submitted && (
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={text.trim().length === 0}
          >
            ENVIAR
          </button>
        )}

        {submitted && (
          <>
            <button
              className={styles.submitButton}
              type="button"
              onClick={handleRetry}
            >
              Refazer exercício
            </button>

            <button
              className={styles.nextExercise}
              type="button"
              onClick={handleNextExercise}
            >
              Próximo exercício
            </button>
          </>
        )}
      </div>

      {/* FEEDBACK */}
      {submitted && (
        <p className={styles.feedback}>
          {isCorrect ? "✅ Resposta correta!" : "❌ Resposta incorreta."}
        </p>
      )}
    </div>
  );
}
