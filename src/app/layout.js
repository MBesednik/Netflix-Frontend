import GlobalState from '@/context';
import './globals.css';
import { Inter } from 'next/font/google';
import NextAuthProvider from '@/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Netflix TBP',
  // icons: {
  //   icon: '/Netflix.png',
  // },
  description:
    'Netflix web app koja izgrađena u svrhu projekta iz TBP-a na prvoj godini diplomskog studija na FOI-u',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' />
      </head>

      <body className={inter.className}>
        <NextAuthProvider>
          <GlobalState>{children}</GlobalState>
        </NextAuthProvider>
      </body>
    </html>
  );
}
