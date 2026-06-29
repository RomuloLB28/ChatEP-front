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
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [similarity, setSimilarity] = useState(null);
  const [loadingResponse, setLoadingResponse] = useState(false);

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
    setLoadingResponse(true);
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
    } catch (err) {
      console.error("Erro ao enviar áudio:", err);
    } finally {
      setLoadingResponse(false);
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
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
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

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setAudioUrl(null);
      setTranscription("");
      setSimilarity(null);
    } else {
      alert("Você concluiu todos os exercícios de speaking!");
    }
  };

  const handleRetry = () => {
    setAudioUrl(null);
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
      
      {similarity === null && !recording && !loadingResponse && (
        <button className={styles.micButton} onClick={startRecording}>
          <span className={styles.micIcon}>🎙️</span>
        </button>
      )}

      {recording && (
        <button className={`${styles.micButton} ${styles.recording}`} onClick={stopRecording}>
          <span className={styles.micIcon}>🛑</span>
        </button>
      )}

      {loadingResponse && <p style={{ color: "#1e3a8a", fontWeight: "600" }}>Avaliando sua pronúncia...</p>}

      {similarity !== null && (
        <div className={styles.resultBox} style={{ color: "#ffffff" }}>
          <h3 style={{ color: "#ffffff", margin: "0 0 0.5rem 0" }}>Resultado da Avaliação</h3>
          <p style={{ color: "#ffffff" }}><strong>Transcrição:</strong></p>
          <p className={styles.transcriptionText} style={{ color: "#ffffff" }}>{transcription}</p>

          <div className={styles.similarityWrapper} style={{ color: "#ffffff" }}>
            <p className={styles.similarityLabel} style={{ color: "#ffffff" }}>Similaridade: {similarity}%</p>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${getProgressColorClass(similarity)}`} 
                style={{ width: `${similarity}%` }}
              />
            </div>
          </div>
          
          <div style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
            <button onClick={handleRetry} style={{ padding: "0.6rem 1.2rem", backgroundColor: "#4b5563", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
              Refazer
            </button>
            <button onClick={handleNext} style={{ padding: "0.6rem 1.2rem", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
              Próximo Exercício
            </button>
          </div>
        </div>
      )}

      {audioUrl && (
        <div className={styles.audioPlayer}>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}
