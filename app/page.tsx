"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import fetchTokens from "@/lib/searchAssets";
import { Label } from "@/components/ui/label";
import ItemsResponse from "@/Types/SearchAssetsTypes";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


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
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 py-4">
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

            <div className="grid grid-cols-4 gap-4">
                {tokens?.items.items.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{item.content.metadata.name}</CardTitle>
                            <CardDescription>{item.grouping[0].collection_metadata.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.content.files[0].uri} width={256} height={256} alt={item.content.metadata.name} className="aspect-square w-full h-full rounded-md" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* <pre>{JSON.stringify(tokens, null, 2)}</pre> */}
        </>
    );
}
