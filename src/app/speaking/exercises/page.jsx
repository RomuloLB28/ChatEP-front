"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./speaking.module.css";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SpeakingPage() {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [similarity, setSimilarity] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

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

  const exercise = exercises[currentExerciseIndex];
  const { prompt } = exercise;

  function calculateSimilarity(promptText, userText) {
    if (!promptText || !userText) return "0.00";

    const cleanPrompt = promptText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/).filter(Boolean);
    const cleanUser = userText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/).filter(Boolean);

    let matches = 0;
    cleanPrompt.forEach(word => {
      if (cleanUser.includes(word)) matches++;
    });

    if (cleanPrompt.length === 0) return "0.00";
    return ((matches / cleanPrompt.length) * 100).toFixed(2);
  }

  async function sendAudioToBackend(blob) {
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");

    try {
      const response = await fetch(`${API_URL}/speaking/transcribe`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const text = data.text || data.reply || "";

      if (!text) return;

      setTranscription(text);

      const currentPrompt = prompt || "";
      const percent = calculateSimilarity(currentPrompt, text);
      setSimilarity(percent);
    } catch (error) {
      console.error(error);
    }
  }

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
        await sendAudioToBackend(blob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setTranscription("");
      setSimilarity(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao acessar o microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTranscription("");
      setSimilarity(null);
    } else {
      alert("Você concluuiu todos os exercícios desta seção!");
    }
  };

  const handleRetryExercise = () => {
    setTranscription("");
    setSimilarity(null);
  };

  const getProgressColorClass = (score) => {
    const value = parseFloat(score);
    if (value >= 75) return styles.high;
    if (value >= 50) return styles.medium;
    return styles.low;
  };

  return (
    <div className={styles.container}>
      <div className={styles.textBox}>
        <p><strong>Prompt:</strong> {prompt}</p>
      </div>

      {similarity === null && !recording && (
        <button
          className={`${styles.micButton} ${recording ? styles.recording : ""}`}
          onClick={startRecording}
        >
          <span className={styles.micIcon}>🎙️</span>
        </button>
      )}

      {recording && (
        <button
          className={`${styles.micButton} ${styles.recording}`}
          onClick={stopRecording}
        >
          <span className={styles.micIcon}>🛑</span>
        </button>
      )}

      {similarity !== null && (
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff" }}>
          <p><strong>Your transcription:</strong></p>
          <p style={{ fontStyle: "italic", color: "#cbd5e1" }}>{transcription}</p>

          <p style={{ fontSize: "1.2rem", marginTop: "10px" }}>
            <strong>Similarity:</strong> <span style={{ color: parseFloat(similarity) > 70 ? "#10b981" : "#f59e0b" }}>{similarity}%</span>
          </p>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button onClick={handleRetryExercise} style={{ padding: "8px 16px", backgroundColor: "#4b5563", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Refazer
            </button>
            <button onClick={handleNextExercise} style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Próximo Exercício
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
