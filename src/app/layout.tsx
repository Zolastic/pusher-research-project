import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import SessionProvider from "~/components/sessionProvider";
import Navbar from "~/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <SessionProvider>
          <TRPCReactProvider cookies={cookies().toString()}>
            <main>
              <div className="mr-4">
                <Navbar />
              </div>
              {children}
            </main>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
