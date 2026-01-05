import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // 1️⃣ Quando logar com Google
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch("http://localhost:4000/auth/google", {
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

          const data = await res.json();

          // 🔥 Guarda temporariamente o JWT do backend
          (user as any).backendToken = data.access_token;
        } catch (err) {
          console.error("Erro ao enviar para backend:", err);
          return false;
        }
      }

      return true;
    },

    // 2️⃣ Salva o token do backend no JWT do NextAuth
    async jwt({ token, user }) {
      if (user && (user as any).backendToken) {
        token.backendToken = (user as any).backendToken;
      }
      return token;
    },

    // 3️⃣ Expõe o token do backend na sessão
    async session({ session, token }) {
      session.backendToken = token.backendToken;
      session.user.id = token.sub!;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
