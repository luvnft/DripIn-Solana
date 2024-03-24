"use client";

import { useEffect, useState } from "react";
import fetchTokens from "@/lib/searchAssets";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home(req: any, res: any) {
    const [tokens, setTokens] = useState<any>(null);
    const { publicKey } = useWallet();

    useEffect(() => {
        if (publicKey){
            const walletAddress = publicKey.toBase58(); // Convert the public key to a base58 string
            fetchTokens(walletAddress)
                .then(setTokens)
                .catch(console.error); 
        }
    }, [publicKey])

    return (
        <div>
            <h1>Search Assets</h1>
            <pre>{JSON.stringify(tokens, null, 2)}</pre>
        </div>
    );

}
