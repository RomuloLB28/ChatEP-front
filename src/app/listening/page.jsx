"use client";
import { useState, useEffect } from "react";
import styles from "./listening.module.css";

export default function ListeningPage() {
  const [answer, setAnswer] = useState("");
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    async function loadListeningExercises() {
      const res = await fetch("/exercises?type=listening");
      const data = await res.json();
      setExercises(data);
    }

    loadListeningExercises();
  }, []);

  const videoUrl =
    exercises.length > 0
      ? exercises[0].audioUrl.replace("watch?v=", "embed/")
      : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Resposta:", answer);
  };

  return (
    <div className={styles.listeningContainer}>
      <h1 className={styles.title}>Exercício de Listening</h1>

      {videoUrl && (
        <div className={styles.videoWrapper}>
          <iframe
            src={videoUrl}
            title="Listening Exercise"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          className={styles.input}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Digite o que você ouviu..."
        />
        <button type="submit" className={styles.sendButton}>
          ENVIAR
        </button>
      </form>
    </div>
  );
}
