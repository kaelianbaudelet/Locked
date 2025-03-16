import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Footer from "@/src/components/layout/Footer";
import Header from "@/src/components/layout/Header";
import MainApp from "../components/MainApp";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Locked",
    description: "Control your web browsing",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="fr">
            <body
                className={`${geistSans.variable} ${geistMono.variable} h-full antialiased font-[family-name:var(--font-geist-sans)] min-h-full px-6 py-12 lg:px-0 max-w-[35rem] flex-col justify-center flex mx-auto md:gap-8 gap-6`}
            >
                <Header />
                <Toaster position="bottom-center" />
                <MainApp>{children}</MainApp>
                <Footer />
            </body>
        </html>
    );
}
