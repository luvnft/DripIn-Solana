"use client";

import "./globals.css";
import "@/style/SolanaWallet.css";
import React, { useMemo } from "react";
import { Sora } from "next/font/google";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from "@/components/theme-provider";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";

const sora = Sora({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const endpoint = useMemo(() => "https://api.devnet.solana.com", []);
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <html lang="en">
            <head>
                <title>CALL.</title>
            </head>
            <body className={`${sora.className}`}>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets} autoConnect>
                        <WalletModalProvider>
                            <>
                                <Toaster position="top-center" />
                                <ThemeProvider
                                    attribute="class"
                                    defaultTheme="dark"
                                    enableSystem
                                    disableTransitionOnChange
                                >
                                    <main className="flex flex-col min-h-screen">
                                        <NextTopLoader color="#8752F3" showSpinner={false} />
                                        <Header />
                                        <div className="w-full max-w-[95vw] mx-auto ">
                                            {children}
                                            <Analytics />
                                            <SpeedInsights />
                                        </div>
                                        <Footer />
                                    </main>
                                </ThemeProvider>
                            </>
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </body>
        </html>
    );
}
