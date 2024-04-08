"use client";

import React from "react";
import "@/app/globals.css";
import "@/style/SolanaWallet.css";
import { Sora } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { HuddleClient, HuddleProvider } from "@huddle01/react";

const sora = Sora({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const { publicKey } = useWallet();

    const huddleClient = new HuddleClient({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    });


    useEffect(() => {
        if (!publicKey) {
            // router.push("/");
        }
    }, [publicKey, router]);

    return (
        <HuddleProvider client={huddleClient}>
            <div className={`${sora.className} flex flex-col min-h-screen`}>
                <div className="w-full max-w-[95vw] mx-auto ">
                    {children}
                </div>
            </div>
        </HuddleProvider>
    );
}
