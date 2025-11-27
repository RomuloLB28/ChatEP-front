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
    async signIn({ user }) {
      // Quando o usuário logar com Google, mande para o backend
      try {
        await fetch("http://localhost:4000/auth/google", {
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

        return true; // permite login
      } catch (err) {
        console.error("Erro ao enviar para backend:", err);
        return false; // bloqueia login se der erro
      }
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
