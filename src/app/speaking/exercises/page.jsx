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
  
  // Controle do exercício atual
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

  // Pega o exercício baseado no índice dinâmico
  const exercise = exercises[currentExerciseIndex];
  const { prompt } = exercise;

  function calculateSimilarity(promptText, userText) {
    const p = promptText.toLowerCase().split(" ");
    const u = userText.toLowerCase().split(" ");

    let matches = 0;

    p.forEach(word => {
      if (u.includes(word)) matches++;
    });

    return ((matches / p.length) * 100).toFixed(2);
  }

  async function sendAudioToBackend(blob) {
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");

    const response = await fetch(`${API_URL}/speaking/transcribe`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    const text = data.text; // backend precisa retornar { text: "..." }
    setTranscription(text);

    const percent = calculateSimilarity(prompt, text);
    setSimilarity(percent);
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
      console.error("Erro ao acessar o microfone:", err);
      alert("Erro ao acessar o microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // Avançar para o próximo exercício
  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTranscription("");
      setSimilarity(null);
    } else {
      alert("Você concluiu todos os exercícios desta seção!");
    }
  };

  // Resetar o exercício atual para tentar de novo
  const handleRetryExercise = () => {
    setTranscription("");
    setSimilarity(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.textBox}>
        <p><strong>Prompt:</strong> {prompt}</p>
      </div>

      {/* Esconde o microfone se já houver transcrição para forçar o uso dos botões de ação */}
      {!transcription && (
        <button
          className={`${styles.micButton} ${recording ? styles.recording : ""}`}
          onClick={recording ? stopRecording : startRecording}
        >
          <span className={styles.micIcon}>🎙️</span>
        </button>
      )}

      {transcription && (
        <div className={styles.resultBox}>
          <p><strong>Your transcription:</strong></p>
          <p>{transcription}</p>

          <p><strong>Similarity:</strong> {similarity}%</p>

          {/* Botões para avançar ou refazer */}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button onClick={handleRetryExercise} className={styles.retryButton}>
              Refazer
            </button>
            <button onClick={handleNextExercise} className={styles.nextButton}>
              Próximo Exercício
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
