"use client";

import styles from "./em-progresso.module.css";

export default function EmProgressoPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <p>🚧 Esta funcionalidade está em desenvolvimento</p>
      </div>
    </div>
  );
}
