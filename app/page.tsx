"use client";

import { useEffect, useState } from "react";
import fetchTokens from "@/lib/searchAssets";
import { Label } from "@/components/ui/label";
import ItemsResponse from "@/Types/SearchAssetsTypes";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function Home() {
    const { publicKey } = useWallet();
    const [tokens, setTokens] = useState<ItemsResponse | null>(null);

    useEffect(() => {
        if (publicKey) {
            const walletAddress = publicKey.toBase58();
            fetchTokens(walletAddress).then((data) => {
                setTokens((data as unknown) as ItemsResponse);
            }).catch(console.error);
        }
        else {
            setTokens(null);
        }
    }, [publicKey])

    return (
        <>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total NFTs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label className="text-xl">{tokens?.items.total}</Label>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Wallet Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label className="text-xl">{publicKey?.toBase58()}</Label>
                    </CardContent>
                </Card>
            </div>

            <pre>{JSON.stringify(tokens, null, 2)}</pre>
        </>
    );
}
