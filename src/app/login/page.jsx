"use client";

import styles from "./login.module.css";
import { LoginBtn } from "../LoginBtn";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ ADICIONADO
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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

    if (rememberMe) {
      localStorage.setItem("savedEmail", email);
    } else {
      localStorage.removeItem("savedEmail");
    }

    router.push("/home");
  }

  return (
    <div className={styles.container}>
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

      <div className={styles.right}>
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

          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="**********************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              👁
            </button>
          </div>

          <div style={{ marginTop: "10px" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label style={{ marginLeft: "8px" }}>Salvar login</label>
          </div>

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
