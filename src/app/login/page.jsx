"use client";

import styles from "./login.module.css";
import { LoginBtn } from "../LoginBtn";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email ou senha inválidos");
      return;
    }

    // login OK → vai pra home
    router.push("/home");
  }

  return (
    <div className={styles.container}>
      {/* Lado esquerdo - DESKTOP */}
      <div className={styles.left}>
        <h1 className={styles.logo}>ChatEP</h1>
        <h2 className={styles.title}>
          HELLO, <br /> WELCOME!
        </h2>
        <p className={styles.subtitle}>
          Entre na sua conta para ficar por dentro de todas as atualizações e
          novos recursos
        </p>
      </div>

      {/* Lado direito */}
      <div className={styles.right}>
        {/* TÍTULO MOBILE */}
        <div className={styles.mobileHeader}>
          <h1 className={styles.logo}>ChatEP</h1>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
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

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "ENTRANDO..." : "LOGIN"}
          </button>

          <Link href="/home">
            <button type="button" className={styles.voltar}>
              Voltar para a tela inicial?
            </button>
          </Link>
        </form>

        <div className={styles.divider}>OU</div>
        <LoginBtn />
      </div>
    </div>
  );
}
