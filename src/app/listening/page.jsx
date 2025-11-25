"use client";
import { useState } from "react";
import styles from "./listening.module.css";

export default function ListeningPage() {
  const [answer, setAnswer] = useState("");

  // Exemplo de link de vídeo do YouTube (pode trocar por props ou query param)
  const videoId = "qN4ooNx77u0"; // <- só o ID do vídeo do YouTube
  const videoUrl = `https://www.youtube.com/embed/${videoId}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Resposta enviada:", answer);
    // Aqui depois você pode comparar, salvar ou enviar para o backend
  };

  return (
    <div className={styles.listeningContainer}>
      <h1 className={styles.title}>Exercício de Listening</h1>

      <div className={styles.videoWrapper}>
        <iframe
          src={videoUrl}
          title="Listening Exercise"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

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
