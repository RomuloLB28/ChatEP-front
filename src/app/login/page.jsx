"use client";
import styles from "./login.module.css";
import { LoginBtn } from "../LoginBtn";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      {/* Lado esquerdo */}
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
        <form className={styles.form}>
          <label className={styles.font}>EMAIL</label>
          <input type="email" placeholder="Ex: name@gmail.com" />

          <label className={styles.font}>SENHA</label>
          <input type="password" placeholder="**********************" />

          <button type="submit" className={styles.loginBtn}>
            LOGIN
          </button>
          <Link href="home">
            <button className={styles.voltar}>
              Voltar para a tela inicial?
            </button>
          </Link>
        </form>

        <div className={styles.divider}>OU</div>
        <LoginBtn></LoginBtn>
      </div>
    </div>
  );
}
