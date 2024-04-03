"use client";

import React from "react";
import "@/app/globals.css";
import "@/style/SolanaWallet.css";
import { Sora } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

const sora = Sora({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const { publicKey } = useWallet();

    useEffect(() => {
        if (!publicKey) {
            router.push("/");
        }
    }, [publicKey, router]);

    return (
        <div className={`${sora.className} flex flex-col min-h-screen`}>
            <div className="w-full max-w-[95vw] mx-auto ">
                {children}
            </div>
        </div>
    );
}
