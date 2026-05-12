"use client";
import Link from "next/link";
import styles from "./speakingLayout.module.css";

export default function SpeakingLayout({ children }) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2>Speaking</h2>

        <nav>
          <Link href="/speaking/exercises">Exercises</Link>
          <Link href="/speaking/tutor">Talk with Tutor</Link>
          <Link href="/home">Voltar para a home</Link>
        </nav>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
