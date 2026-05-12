"use client";
import { useState } from "react";
import styles from "../correction/correction.module.css";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function WritingCorrection() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/checker/correct-text`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        },
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Text Correction</h1>

      <textarea
        className={styles.textarea}
        placeholder="Write your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className={styles.button}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Correcting..." : "Correct Text"}
      </button>

      {result && (
        <div className={styles.resultContainer}>
          <div className={styles.resultBlock}>
            <div className={styles.resultTitle}>Original</div>
            <div className={styles.resultText}>{result.originalText}</div>
          </div>

          <div className={styles.resultBlock}>
            <div className={styles.resultTitle}>Corrected</div>
            <div className={styles.resultText}>{result.correctedText}</div>
          </div>
          {/* Para o futuro feedback com IA
          <div className={styles.resultBlock}>
            <div className={styles.resultTitle}>Feedback</div>
            <div className={styles.resultText}>{result.feedback}</div>
          </div>*/}
        </div>
      )}
    </div>
  );
}
