"use client";
import { useState } from "react";
import styles from "./reading.module.css";

export default function ReadingPage() {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const correctAnswer = "C";

  const handleSelect = (option) => {
    if (!submitted) setSelected(option);
  };

  const handleSubmit = () => {
    if (selected) setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.textBox}>
        <p>
          We would like to welcome you on website dedicated to all pupils,
          students, parents, teachers and to all lovers of mathematics. You can
          find here math exercises in the range of middle schools, high school
          math problems and the most frequent university & college math
          problems.
        </p>
      </div>

      <div className={styles.optionsBox}>
        {["A", "B", "C", "D"].map((option) => (
          <div
            key={option}
            className={`${styles.option} ${
              selected === option ? styles.selected : ""
            } ${
              submitted && option === correctAnswer ? styles.correct : ""
            } ${
              submitted && selected === option && option !== correctAnswer
                ? styles.wrong
                : ""
            }`}
            onClick={() => handleSelect(option)}
          >
            <strong>{option})</strong>{" "}
            {option === "A" && "suohsiuhiusgdisidsiv"}
            {option === "B" && "iusdisdbsiudsuisissvus"}
            {option === "C" && "ouwsudgowidgoiwgdouwg"}
            {option === "D" && "isdhowhdouwdoubwdkjbwbd"}
          </div>
        ))}
      </div>

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={!selected || submitted}
      >
        {submitted ? "ENVIADO" : "ENVIAR"}
      </button>

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
