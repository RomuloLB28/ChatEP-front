"use client";
import Link from "next/link";
import styles from "./practice.module.css";

export default function PracticePage() {
  const skills = [
    {
      name: "Listening",
      description: "Melhore sua compreensão auditiva com exercícios e áudios interativos.",
      icon: "🎧",
      href: "/listening",
      className: styles.listening,
    },
    {
      name: "Speaking",
      description: "Treine sua fala com feedback em tempo real e transcrição automática.",
      icon: "🎤",
      href: "/em-progresso",
      className: styles.speaking,
    },
    {
      name: "Reading",
      description: "Aprimore sua leitura com textos adaptados ao seu nível.",
      icon: "📖",
      href: "/reading",
      className: styles.reading,
    },
    {
      name: "Writing",
      description: "Desenvolva sua escrita com correção automática e sugestões.",
      icon: "✍️",
      href: "/writing",
      className: styles.writing,
    },
  ];

  return (
    <div className={styles.practiceContainer}>
      <div className={styles.practiceHeader}>
        <h1>Pratique seu Inglês</h1>
        <p>Escolha uma das competências abaixo e comece a praticar agora.</p>
      </div>

      <div className={styles.skillsGrid}>
        {skills.map((skill) => (
          <div key={skill.name} className={`${styles.skillCard} ${skill.className}`}>
            <div className={styles.icon}>{skill.icon}</div>
            <h2>{skill.name}</h2>
            <p>{skill.description}</p>

            {/* Botão que leva para a rota correspondente */}
            <Link href={skill.href} className={styles.practiceButton}>
              Praticar →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
