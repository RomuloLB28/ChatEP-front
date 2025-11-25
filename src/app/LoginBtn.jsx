"use client";
import styles from "./page.module.css";
import { signIn } from "next-auth/react";

export function LoginBtn() {
  return (
    <button onClick={()=> signIn("google",{ callbackUrl: "/home" })} className={styles.googleBtn}>
      <img src="/google.svg" alt="Google" />
      Continue with Google.
    </button>
  );
}
