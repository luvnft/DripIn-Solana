"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import fetchTokens from "@/lib/searchAssets";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Grouping } from "@/types/SearchAssetsType";
import { useWallet } from "@solana/wallet-adapter-react";
import { ItemsResponse } from "@/types/SearchAssetsType";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import SpinnerLoadingAnimation from "@/components/ui/spinnerLoadingAnimation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
    const { publicKey } = useWallet();
    const [page, setPage] = useState(0);
    const [collections, setCollections] = useState<Grouping[]>([]);
    const [tokens, setTokens] = useState<ItemsResponse | null>(null);

    const perPage = 8;

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

    useEffect(() => {
        const collectionMap = new Map<string, Grouping>();
        tokens?.items.items.forEach((nft) => {
            const collection = nft.grouping.find((g) => g.group_key === "collection");
            if (collection && collection.collection_metadata) {
                collectionMap.set(collection.group_value, collection);
            }
        });
        setCollections(Array.from(collectionMap.values()));
    }, [tokens?.items.items]);

    const pageNavigation = (page: number) => {
        return collections.slice(page * perPage, (page + 1) * perPage);
    }

    const TotalNFTs = tokens?.items.total;
    const TotalCollections = collections.length;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 py-4">
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
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Total Collections</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {
                                        TotalNFTs === undefined ? (
                                            <Label className="flex gap-2 text-xl">
                                                <SpinnerLoadingAnimation size={24} />
                                                Loading...
                                            </Label>
                                        ) : (
                                            <>
                                                <Label className="text-xl">
                                                    {TotalCollections}
                                                </Label>
                                            </>
                                        )
                                    }
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Total NFTs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {
                                        TotalNFTs === undefined ? (
                                            <Label className="flex gap-2 text-xl">
                                                <SpinnerLoadingAnimation size={24} />
                                                Loading...
                                            </Label>
                                        ) : (
                                            <>
                                                <Label className="text-xl">
                                                    {TotalNFTs}
                                                </Label>
                                            </>
                                        )
                                    }
                                </CardContent>
                            </Card>
                        </div>
                    )
                }
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {pageNavigation(page)?.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{item.collection_metadata.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Image
                                width={512}
                                height={512}
                                src={item.collection_metadata.image}
                                alt={item.collection_metadata.name}
                                className="aspect-square border-2 object-contain w-full h-full rounded-md"
                            />
                        </CardContent>
                    </Card>
                ))}

                {tokens?.items.items.length === 0 && (
                    <div className="col-span-full flex justify-center items-center">
                        <Label className="text-xl text-red-400">
                            No NFTs found
                        </Label>
                    </div>
                )}

                {tokens?.items.items.length! > 0 && (
                    <div className="col-span-full flex justify-center items-center">
                        <Button
                            variant="ghost"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                        >
                            <ChevronLeftIcon className="mr-2 h-4 w-4" />
                            Previous
                        </Button>
                        <Label className="ml-8">{page + 1}</Label>
                        <Label className="mx-4">/</Label>
                        <Label className="mr-8">{Math.floor(TotalCollections! / perPage) + 1}</Label>
                        <Button
                            variant="ghost"
                            onClick={() => setPage(page + 1)}
                            disabled={page === Math.floor(TotalCollections! / perPage)}
                        >
                            Next
                            <ChevronRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* <pre>{JSON.stringify(collections, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(tokens?.items.items.slice(0, 1), null, 2)}</pre> */}
        </>
    );
}
