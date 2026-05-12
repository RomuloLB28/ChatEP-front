"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import styles from "./perfil.module.css";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!session?.backendToken) return;

    async function fetchExercises() {
      try {
        const response = await fetch(
          "http://localhost:4000/user-exercises/me",
          {
            headers: {
              Authorization: `Bearer ${session.backendToken}`,
            },
          },
        );

        if (response.status === 401) {
          setError("Sessão expirada");
          setExercises([]);
          return;
        }

        const data = await response.json();
        setExercises(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar exercícios:", err);
        setExercises([]);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, [session]);

  if (status === "loading") return <p>Carregando sessão...</p>;
  if (!session) return <p>Usuário não autenticado</p>;
  if (error) return <p>{error}</p>;

  const totalExercises = exercises.length;

  const listeningCount = exercises.filter(
    (ex) => ex.type === "listening",
  ).length;

  const readingCount = exercises.filter((ex) => ex.type === "reading").length;
  const speakingCount = exercises.filter((ex) => ex.type === "speaking").length;
  const writingCount = exercises.filter((ex) => ex.type === "writing").length;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>IMG</div>

          <div>
            <h1 className={styles.name}>{session.user?.name}</h1>
            <p className={styles.level}>Perfil do Estudante</p>
          </div>
        </div>

        {/* Resumo */}
        <div className={styles.xpSection}>
          <div className={styles.xpInfo}>
            <span>Total de Exercícios</span>
            <span>{loading ? "Carregando..." : totalExercises}</span>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: totalExercises ? "100%" : "0%" }}
            />
          </div>
        </div>

        {/* Estatísticas */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <p>Listening</p>
            <strong>{listeningCount}</strong>
          </div>

          <div className={styles.statCard}>
            <p>Reading</p>
            <strong>{readingCount}</strong>
          </div>

          <div className={styles.statCard}>
            <p>Speaking</p>
            <strong>{speakingCount}</strong>
          </div>

          <div className={styles.statCard}>
            <p>Writing</p>
            <strong>{writingCount}</strong>
          </div>
        </div>

        {/* Botões */}
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Ocultar Histórico" : "Ver Histórico de Exercícios"}
          </button>

          <button className={styles.secondaryButton}>Editar Perfil</button>

          <button
            className={styles.logoutButton}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sair da conta
          </button>
        </div>

        {/* Histórico Expandido */}
        {showHistory && (
          <div className={styles.historySection}>
            <h3>Histórico Completo</h3>

            {exercises.length === 0 && <p>Nenhum exercício encontrado.</p>}

            {exercises.map((ex) => (
              <div key={ex._id} className={styles.historyCard}>
                <p>
                  <strong>Tipo:</strong> {ex.type}
                </p>
                <p>
                  <strong>Resposta:</strong> {ex.userAnswer}
                </p>
                <p>
                  <strong>Nível:</strong> {ex.level}
                </p>
                <p>
                  <strong>Score:</strong> {ex.score}
                </p>
                <p>
                  <strong>Correto:</strong> {ex.isCorrect ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(ex.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
        {/* Botão Voltar Genérico */}
        <button
          className={styles.backButton}
          onClick={() => (window.location.href = "/home")}
        >
          ← Voltar para Home
        </button>
      </div>
    </div>
  );
}
