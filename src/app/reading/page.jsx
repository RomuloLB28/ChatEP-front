"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./reading.module.css";

export default function ReadingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadReadingExercises() {
      const res = await fetch("/exercises?type=reading");
      const data = await res.json();
      setExercises(data);
    }

    loadReadingExercises();
  }, []);

  if (exercises.length === 0) {
    return <p>Carregando...</p>;
  }

  const exercise = exercises[currentIndex];
  const { _id, text, options, correctAnswer, level } = exercise;

  const handleSelect = (index) => {
    if (!submitted) setSelected(index);
  };

  const handleSubmit = async () => {
    if (selected === null) return;

    const isCorrect = selected === correctAnswer;
    setSubmitted(true);

    if (!session?.backendToken) {
      console.warn("Usuário não autenticado");
      return;
    }

    await fetch("http://localhost:4000/user-exercises", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
      body: JSON.stringify({
        exerciseId: _id,
        type: "reading",
        level,
        userAnswer: options[selected],
        isCorrect,
        score: isCorrect ? 1 : 0,
      }),
    });
  };

  const handleNextExercise = () => {
    setSelected(null);
    setSubmitted(false);

    setCurrentIndex((prev) => (prev + 1 < exercises.length ? prev + 1 : 0));
  };

  return (
    <div className={styles.container}>
      {/* TEXTO */}
      <div className={styles.textBox}>
        <p>{text}</p>
      </div>

      {/* OPÇÕES */}
      <div className={styles.optionsBox}>
        {options.map((option, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSelect(index)}
            className={`${styles.option}
              ${selected === index ? styles.selected : ""}
              ${submitted && index === correctAnswer ? styles.correct : ""}
              ${
                submitted && selected === index && index !== correctAnswer
                  ? styles.wrong
                  : ""
              }`}
            disabled={submitted}
          >
            <strong>{String.fromCharCode(65 + index)}</strong> {option}
          </button>
        ))}
      </div>

      {/* BOTÕES */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={selected === null || submitted}
        >
          {submitted ? "ENVIADO" : "ENVIAR"}
        </button>

        {submitted &&(<button onClick={handleNextExercise} className={styles.primaryButton }>
          Próximo exercício
        </button>
        )}
      </div>

      {/* FEEDBACK */}
      {submitted && (
        <p className={styles.feedback}>
          {selected === correctAnswer
            ? "✅ Resposta correta!"
            : "❌ Resposta incorreta."}
        </p>
      )}
    </div>
  );
}
