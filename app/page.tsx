"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import fetchTokens from "@/lib/searchAssets";
import { Label } from "@/components/ui/label";
import ItemsResponse from "@/Types/SearchAssetsTypes";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";


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
                        <CardTitle>Wallet Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {
                            publicKey?.toBase58() === undefined ? (
                                <Label className="text-xl">
                                    Connect Wallet to view your address
                                </Label>
                            ) : (
                                <Label className="text-xl">
                                    {publicKey?.toBase58()}
                                </Label>
                            )
                        }
                    </CardContent>
                </Card>

                {
                    publicKey?.toBase58() === undefined ? (
                        null
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Total NFTs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {
                                    tokens?.items.total === undefined ? (
                                        <Label className="flex gap-2 text-xl">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="animate-spin h-6 w-6 text-primary-500"
                                            >
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                            </svg>
                                            Loading...
                                        </Label>
                                    ) : (
                                        <>
                                            <Label className="text-xl">
                                                {tokens?.items.total}
                                            </Label>
                                        </>
                                    )
                                }
                            </CardContent>
                        </Card>
                    )
                }
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
                            <Image src={item.content.files[0].uri} width={512} height={512} alt={item.content.metadata.name} className="aspect-square w-full h-full rounded-md" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* <pre>{JSON.stringify(tokens, null, 2)}</pre> */}
        </>
    );
}
