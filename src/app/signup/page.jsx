"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginBtn } from "../LoginBtn";
import styles from "./signup.module.css";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://chat-ep-front.vercel.app/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao criar conta");
      }

      // sucesso → manda para login
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.logo}>ChatEP</h1>
        <h2 className={styles.title}>
          HELLO, <br /> WELCOME!
        </h2>
        <p className={styles.subtitle}>
          Faça seu cadastro para ficar por dentro de todas as atualizações e
          novos recursos
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.mobileHeader}>
          <h1 className={styles.logo}>ChatEP</h1>
        </div>

        <form className={styles.form} onSubmit={handleSignup}>
          <label className={styles.font}>EMAIL</label>
          <input
            type="email"
            placeholder="Ex: name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.font}>SENHA</label>
          <input
            type="password"
            placeholder="**********************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "CRIANDO..." : "SIGNUP"}
          </button>

          <Link href="/home">
            <button type="button" className={styles.voltar}>
              voltar para a tela inicial
            </button>
          </Link>
        </form>

        <div className={styles.divider}>OU</div>
        <LoginBtn />
      </div>
    </div>
  );
}
