import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from "next/font/google";
import { cookies } from "next/headers";

import { Copyright } from "@/components/Copyright";
import { Hero } from "@/components/Hero";
import { Profile } from "@/components/Profile";
import { SignIn } from "@/components/SignIn";

import "./globals.css";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const baijamjuree = BaiJamjuree({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-bai-jamjuree",
});

export const metadata = {
  title: "Spacetime",
  description:
    "Uma cápsula do tempo construída com React, Next.js, TailwindCSS e TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userIsAuthenticated = cookies().has("token");

  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baijamjuree.variable} bg-gray-900 font-sans text-gray-100`}
      >
        <main className="grid grid-cols-2 min-h-screen">
          <div className="relative flex flex-col items-start justify-between overflow-hidden px-28 py-16 border-r border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover">
            <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full" />

            <div className="absolute right-2 top-0 bottom-0 w-2 bg-stripes" />

            {userIsAuthenticated ? <Profile /> : <SignIn />}

            <Hero />

            <Copyright />
          </div>

          <div className="flex flex-col overflow-y-scroll max-h-screen bg-[url(../assets/bg-stars.svg)] bg-cover">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
