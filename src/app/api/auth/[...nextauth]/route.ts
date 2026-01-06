import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
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
          (user as any).backendToken = data.access_token;
        } catch (err) {
          console.error("Erro ao enviar para backend:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user && (user as any).backendToken) {
        token.backendToken = (user as any).backendToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string;
      session.user.id = token.sub!;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
