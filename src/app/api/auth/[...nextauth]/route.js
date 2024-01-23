import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
  providers: [
    GithubProvider({
      clientId: 'Iv1.f80f8ecfa9cf6532',
      clientSecret: '47fdd9005ebe3c4ab001b3e95c9808a003d2cb5f',
    }),
    GoogleProvider({
      clientId:
        '496806371238-dbkmqm60gihtmr69ktnd6d5k51jmfmin.apps.googleusercontent.com',
      clientSecret: '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',
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session?.user?.name
        .split(' ')
        .join('')
        .toLocaleLowerCase();

      session.user.uid = token.sub;

      return session;
    },
  },
  secret: 'default_secret_key',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
