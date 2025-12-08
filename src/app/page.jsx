import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>ChatEP</h1>
        </div>

        <nav className={styles.nav}>
          <a href="#">Produtos</a>
          <a href="#">Tutorial</a>
          <a href="#">Sobre</a>
        </nav>

        <div className={styles.actions}>
          <Link href="login">
            <button className={styles.login}>Login</button>
          </Link>
          <Link href="signup">
            <button className={styles.signup}>Signup</button>
          </Link>
        </div>
      </header>

      {/* MAIN - Introdução (invertido) */}
      <main className={styles.main}>
        <div className={styles.textLeft}>
          <h2>Conheça o ChatEP</h2>
          <p>
            Uma plataforma interativa para treinar inglês com foco em speaking e
            listening, usando transcrição automática e feedback simples para
            acelerar o aprendizado.
          </p>
          <Link href="practice">
            <button className={styles.practiceBtn}>
              Praticar <span>→</span>
            </button>
          </Link>
        </div>
        <div className={styles.imageRight}>
          <img src="/images/main_image.png" alt="Imagem explicativa" />
        </div>
      </main>

      {/* SECTION 1 - Listening */}
      <section className={styles.section}>
        <div className={styles.textLeft}>
          <h2>
            Prátique seu <br />
            <span className={styles.greenText}>Listening</span>
          </h2>
          <p>
            Pratique sua compreensão auditiva com exercícios variados e áudios
            reais, acompanhados de perguntas para fixar o conteúdo.
          </p>
          <Link href="listening">
            <button className={styles.practiceBtn}>
              Praticar <span>→</span>
            </button>
          </Link>
        </div>
        <div className={`${styles.imageRight} ${styles.circle}`}>
          <img src="/images/Listening_image.png" alt="Imagem Listening" />
        </div>
      </section>

      {/* SECTION 2 - Speaking */}
      <section className={styles.section}>
        <div className={styles.imageLeft}>
          <img src="/images/Speaking_image.png" alt="Imagem Speaking" />
        </div>
        <div className={styles.textRight}>
          <h2>
            Melhore seu <br />
            <span className={styles.greenText}>Speaking</span>
          </h2>
          <p>
            Fale em inglês e receba transcrição automática e dicas de melhoria,
            ajudando você a ganhar confiança e fluência.
          </p>
          <Link href="speaking">
            <button className={styles.practiceBtn}>
              Praticar <span>→</span>
            </button>
          </Link>
        </div>
      </section>

      {/* SECTION 3 - Reading */}
      <section className={styles.section}>
        <div className={styles.textLeft}>
          <h2>
            Aprimore seu <br />
            <span className={styles.greenText}>Reading</span>
          </h2>
          <p>
            Leia textos adaptados ao seu nível e aprimore seu vocabulário e
            interpretação de forma prática e guiada.
          </p>
          <Link href="reading">
            <button className={styles.practiceBtn}>
              Praticar <span>→</span>
            </button>
          </Link>
        </div>
        <div className={`${styles.imageRight} ${styles.circle}`}>
          <img src="/images/Reading_image2.png" alt="Imagem Reading" />
        </div>
      </section>

      {/* SECTION 4 - Writing */}
      <section className={styles.section}>
        <div className={`${styles.imageLeft} ${styles.circle}`}>
          <img src="/images/Writing_image.png" alt="Imagem Writing" />
        </div>
        <div className={styles.textRight}>
          <h2>
            Desenvolva seu <br />
            <span className={styles.greenText}>Writing</span>
          </h2>
          <p>
            Produza textos curtos e receba sugestões de correção para evoluir
            sua gramática e clareza na escrita
          </p>
          <Link href="writing">
            <button className={styles.practiceBtn}>
              Praticar <span>→</span>
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h2>ChatEP</h2>

          <div className={styles.footerSections}>
            {/* Esquerda */}
            <div className={styles.footerLeft}>
              <p>Home</p>
              <p>Sobre</p>
            </div>

            {/* Centro */}
            <div className={styles.footerCenter}>
              <p>Email: codebyromulo@gmail.com</p>
              <p>Contato: +55 94 99207-6332</p>
            </div>

            {/* Direita */}
            <div className={styles.footerRight}>
              <p>GitHub</p>
              <p>LinkedIn</p>
            </div>
          </div>

          <p className={styles.footerCopy}>
            © 2025 ChatEP. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
