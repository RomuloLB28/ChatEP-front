"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MeusExerciciosPage() {
  const { data: session, status } = useSession();
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.backendToken) return;

    async function loadExercises() {
      const res = await fetch(
        `${NEXT_PUBLIC_API_URL}/user-exercises/me`,
        {
          headers: {
            Authorization: `Bearer ${session.backendToken}`,
          },
        }
      );

      if (res.status === 401) {
        setError("Sessão expirada");
        return;
      }

      const data = await res.json();
      setExercises(data);
    }

    loadExercises();
  }, [session]);

  if (status === "loading") return <p>Carregando sessão...</p>;
  if (!session) return <p>Usuário não autenticado</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Meus Exercícios</h2>

      {exercises.length === 0 && <p>Nenhum exercício encontrado.</p>}

      <ul>
        {exercises.map((ex) => (
          <li key={ex._id}>
            <strong>{ex.type}</strong> – {ex.userAnswer} - {ex.level}

          </li>
        ))}
      </ul>
    </div>
  );
}
