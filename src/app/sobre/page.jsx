'use client'

import styles from './sobre.module.css'

export default function SobrePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sobre o Projeto</h1>

        <section className={styles.section}>
          <h2>Autor</h2>
          <p>
            Meu nome é Romulo, desenvolvedor full stack em formação, com foco em
            desenvolvimento web moderno utilizando Next.js, TypeScript e
            integração com Inteligência Artificial. Este projeto foi
            desenvolvido como Trabalho de Conclusão de Curso (TCC) e representa
            um marco importante na minha transição para o mercado profissional
            de tecnologia.
          </p>
          <p>
            O sistema reflete minha evolução técnica, especialmente após o
            momento que considero o “turn point” da minha carreira — quando
            decidi valorizar meu tempo, cobrar pelo meu conhecimento e assumir
            postura profissional como desenvolvedor.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Objetivo do Projeto</h2>
          <p>
            Esta plataforma foi criada para auxiliar estudantes no
            desenvolvimento das habilidades de <strong>Listening</strong>,
            <strong> Reading</strong>, <strong>Writing</strong> e
            <strong> Speaking</strong> em inglês, utilizando exercícios práticos
            e integração com modelos de Inteligência Artificial.
          </p>
          <p>
            O foco principal é oferecer prática ativa com feedback automático,
            permitindo que o usuário acompanhe sua evolução de forma clara e
            objetiva.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Arquitetura e Tecnologias</h2>
          <ul className={styles.list}>
            <li><strong>Frontend:</strong> Next.js 15 + React + CSS Modules</li>
            <li><strong>Autenticação:</strong> NextAuth (OAuth + JWT)</li>
            <li><strong>Backend:</strong> API REST em Node.js</li>
            <li><strong>Banco de Dados:</strong> MongoDB</li>
            <li><strong>IA de Texto:</strong> Modelo para correção gramatical</li>
            <li><strong>IA de Áudio:</strong> Whisper para transcrição</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Funcionalidades Implementadas</h2>
          <ul className={styles.list}>
            <li>Autenticação segura com controle de sessão</li>
            <li>Registro de exercícios realizados pelo usuário</li>
            <li>Histórico completo com tipo, nível, score e data</li>
            <li>Dashboard de perfil com estatísticas por habilidade</li>
            <li>Integração com IA para análise de respostas</li>
            <li>Estrutura preparada para sistema de níveis e XP</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Impacto Acadêmico</h2>
          <p>
            Este projeto demonstra a aplicação prática de conceitos de
            Engenharia de Software, Sistemas Web, Integração de APIs e
            Inteligência Artificial aplicada à educação.
          </p>
          <p>
            Além do desenvolvimento técnico, o sistema valida a proposta de
            utilizar IA como ferramenta complementar no processo de aprendizagem
            de idiomas.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Visão Futura</h2>
          <p>
            A plataforma pode evoluir para um produto SaaS completo, incluindo:
          </p>
          <ul className={styles.list}>
            <li>Sistema de gamificação completo (XP e níveis)</li>
            <li>Análise detalhada de desempenho por nível CEFR</li>
            <li>Feedback inteligente personalizado</li>
            <li>Dashboard analítico avançado</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
