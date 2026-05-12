import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // LOGIN POR EMAIL/SENHA
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();

          // ISSO cria a sessão no NextAuth
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            backendToken: data.access_token,
          };
        } catch (err) {
          console.error("Erro no login credentials:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // mantém seu fluxo do Google intacto
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
            }),
          });

          if (!res.ok) return false;

          const data = await res.json();
          user.backendToken = data.access_token;
        } catch (err) {
          console.error("Erro ao enviar para backend:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user?.backendToken) {
        token.backendToken = user.backendToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
