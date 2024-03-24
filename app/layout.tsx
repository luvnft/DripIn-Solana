"use client";

import "./globals.css";
import React, { useMemo } from "react";
import { Sora } from "next/font/google";
import Header from "@/components/common/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";

require("@solana/wallet-adapter-react-ui/styles.css");

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
            <body className={`${sora.className} bg-[#040507]`}>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets} autoConnect>
                        <WalletModalProvider>
                            <>
                                <ThemeProvider
                                    attribute="class"
                                    defaultTheme="dark"
                                >
                                    <Header />
                                    <div className="w-full max-w-[90%] mx-auto">
                                        {children}
                                    </div>
                                </ThemeProvider>
                            </>
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </body>
        </html>
    );
}
