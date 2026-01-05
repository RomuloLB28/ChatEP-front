"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./listening.module.css";

/* =========================
   FUNÇÕES AUXILIARES
========================= */

const normalize = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[?.!,]/g, "");

const buildDiff = (user, correct) => {
  const userWords = normalize(user).split(" ");
  const correctWords = normalize(correct).split(" ");

  let correctCount = 0;

  const diffResult = correctWords.map((word, index) => {
    const userWord = userWords[index];

    if (userWord === word) {
      correctCount++;
      return { word, status: "correct" };
    }

    if (!userWord) {
      return { word, status: "missing" };
    }

    return { word, status: "wrong", userWord };
  });

  const score = Math.round((correctCount / correctWords.length) * 100);

  return { diffResult, score };
};

/* =========================
   COMPONENTE
========================= */

export default function ListeningPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [diff, setDiff] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadListeningExercises() {
      const res = await fetch("/exercises?type=listening");
      const data = await res.json();
      setExercises(data);
    }

    loadListeningExercises();
  }, []);

  if (exercises.length === 0) {
    return <p>Carregando...</p>;
  }

  const exercise = exercises[currentIndex];
  const { _id, audioUrl, transcript, level } = exercise;

  const videoUrl = audioUrl.replace("watch?v=", "embed/");

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { diffResult, score } = buildDiff(answer, transcript);

    setDiff(diffResult);
    setScore(score);
    setSubmitted(true);

    if (!session?.backendToken) return;

    await fetch("http://localhost:4000/user-exercises", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
      body: JSON.stringify({
        exerciseId: _id,
        type: "listening",
        level,
        userAnswer: answer,
        isCorrect: score === 100,
        score,
      }),
    });
  };

  const handleRetry = () => {
    setAnswer("");
    setSubmitted(false);
    setDiff([]);
    setScore(0);
  };

  const handleNextExercise = () => {
    setSubmitted(false);
    setAnswer("");
    setDiff([]);
    setScore(0);

    setCurrentIndex((prev) => (prev + 1 < exercises.length ? prev + 1 : 0));
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className={styles.listeningContainer}>
      <h1 className={styles.title}>Exercício de Listening</h1>

      {/* VÍDEO */}
      <div className={styles.videoWrapper}>
        <iframe
          src={videoUrl}
          title="Listening Exercise"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* FORM */}
      {!submitted && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            className={styles.input}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Digite o que você ouviu..."
            disabled={submitted}
          />

          <div className={styles.buttons}>
            <button
              type="submit"
              className={styles.sendButton}
              disabled={answer.trim() === "" || submitted}
            >
              {submitted ? "ENVIADO" : "ENVIAR"}
            </button>
          </div>
        </form>
      )}

      {/* FEEDBACK */}
      {submitted && (
        <div className={styles.feedbackBox}>
          <h3>
            🎯 Acerto: <strong>{score}%</strong>
          </h3>

          {/* RESPOSTA DO USUÁRIO */}
          <div className={styles.card}>
            <p className={styles.label}>Você escreveu:</p>
            <p className={styles.userAnswer}>{answer}</p>
          </div>

          {/* RESPOSTA CORRETA + DIFF */}
          <div className={styles.card}>
            <p className={styles.label}>Resposta correta:</p>

            <p className={styles.diff}>
              {diff.map((item, index) => (
                <span
                  key={index}
                  className={
                    item.status === "correct"
                      ? styles.correct
                      : item.status === "missing"
                      ? styles.missing
                      : styles.wrong
                  }
                >
                  {item.word}{" "}
                </span>
              ))}
            </p>
          </div>

          {/* AÇÕES */}
          <div className={styles.actions}>
            <button onClick={handleRetry} className={styles.secondaryButton}>
              Tentar novamente
            </button>
            <button
              onClick={handleNextExercise}
              className={styles.primaryButton}
            >
              Próximo exercício
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
