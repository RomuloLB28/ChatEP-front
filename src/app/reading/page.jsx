"use client";
import { useEffect, useState } from "react";
import styles from "./reading.module.css";

export default function ReadingPage() {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [exercises, setExercises] = useState([]);

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

  const exercise = exercises[0];
  const { text, options, correctAnswer } = exercise;

  const handleSelect = (index) => {
    if (!submitted) setSelected(index);
  };

  const handleSubmit = () => {
    if (selected !== null) setSubmitted(true);
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
              ${
                submitted && index === correctAnswer ? styles.correct : ""
              }
              ${
                submitted &&
                selected === index &&
                index !== correctAnswer
                  ? styles.wrong
                  : ""
              }`}
            disabled={submitted}
          >
            <strong>{String.fromCharCode(65 + index)})</strong> {option}
          </button>
        ))}
      </div>

      {/* BOTÃO ENVIAR */}
      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={selected === null || submitted}
      >
        {submitted ? "ENVIADO" : "ENVIAR"}
      </button>

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
