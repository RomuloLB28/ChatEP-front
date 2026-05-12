"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./exercises/speaking.module.css";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SpeakingPage() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    async function loadSpeakingExercises() {
      const res = await fetch("/exercises?type=speaking");
      const data = await res.json();
      setExercises(data);
    }
    loadSpeakingExercises();
  }, []);

  if (exercises.length === 0) {
    return <p>Carregando...</p>;
  }

  const exercise = exercises[0];
  const { prompt } = exercise;

  async function sendAudioToBackend(blob) {
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");

    const response = await fetch(`${API_URL}/speaking/transcribe`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Resposta backend:", data);
  }

  // Iniciar gravação
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        await sendAudioToBackend(blob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Erro ao acessar o microfone:", err);
      alert("Erro ao acessar o microfone. Verifique as permissões.");
    }
  };

  // Parar gravação
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.textBox}>
        <p>{prompt}</p>
      </div>
      <button
        className={`${styles.micButton} ${recording ? styles.recording : ""}`}
        onClick={recording ? stopRecording : startRecording}
      >
        <span className={styles.micIcon}>🎙️</span>
      </button>

      {audioUrl && (
        <div className={styles.audioPlayer}>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}
