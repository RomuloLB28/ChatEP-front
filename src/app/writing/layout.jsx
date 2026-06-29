"use client";
import Link from "next/link";
import styles from "./writingLayout.module.css";

export default function WritingLayout({ children }) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2>Writing</h2>

        <nav>
          <Link href="/writing/exercises">Exercises</Link>
          <Link href="/writing/correction">Text Correction</Link>
          <Link href="/home">Voltar para a home</Link>
        </nav>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
