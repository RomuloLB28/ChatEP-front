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
  
  // NOVOS ESTADOS PARA O FLUXO
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [result, setResult] = useState(null); 
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

  // Pega o exercício com base no índice dinâmico
  const exercise = exercises[currentExerciseIndex];
  const { prompt } = exercise;

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
      console.log("Resposta backend:", data);
      setResult(data); // Salva o resultado (similaridade, etc) para exibir na tela
    } catch (err) {
      console.error("Erro ao enviar áudio:", err);
    } finally {
      setLoadingResponse(false);
    }
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
      setResult(null); // Limpa resultado anterior se estiver refazendo
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

  // FUNÇÕES DE NAVEGAÇÃO
  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setAudioUrl(null);
      setResult(null);
    } else {
      alert("Você concluiu todos os exercícios de speaking!");
    }
  };

  const handleRetry = () => {
    setAudioUrl(null);
    setResult(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.textBox}>
        <p>{prompt}</p>
      </div>
      
      {/* Esconde o microfone se já houver um resultado na tela */}
      {!result && !loadingResponse && (
        <button
          className={`${styles.micButton} ${recording ? styles.recording : ""}`}
          onClick={recording ? stopRecording : startRecording}
        >
          <span className={styles.micIcon}>🎙️</span>
        </button>
      )}

      {loadingResponse && <p>Avaliando sua pronúncia...</p>}

      {/* EXIBIÇÃO DO RESULTADO E BOTÕES DE FLUXO */}
      {result && (
        <div className={styles.resultBox}>
          <h3>Resultado da Avaliação</h3>
          <p>Transcrição: {result.transcription}</p>
          <p>Similaridade: {result.similarity}%</p> 
          
          <div className={styles.actionButtons}>
            <button onClick={handleRetry} className={styles.retryButton}>
              Refazer
            </button>
            <button onClick={handleNext} className={styles.nextButton}>
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
