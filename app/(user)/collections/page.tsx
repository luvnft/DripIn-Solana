"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import fetchTokens from "@/lib/searchAssets";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Grouping } from "@/types/SearchAssetsType";
import { useWallet } from "@solana/wallet-adapter-react";
import { ItemsResponse } from "@/types/SearchAssetsType";
import dripCollectionAddress from "@/lib/drip/dripCollectionAddress";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import SpinnerLoadingAnimation from "@/components/ui/spinnerLoadingAnimation";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export default function CollectionPage() {
    const { publicKey } = useWallet();
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [collections, setCollections] = useState<Grouping[]>([]);
    const [tokens, setTokens] = useState<ItemsResponse | null>(null);

    const perPage = 8;

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, []);

    useEffect(() => {
        if (publicKey) {
            const walletAddress = publicKey.toBase58();
            fetchTokens(walletAddress).then((data) => {
                const dripNFTs = data.items.items.filter(dripData => dripCollectionAddress.includes(dripData.grouping[0].group_value));
                setTokens({ items: { total: dripNFTs.length, limit: 0, cursor: "", items: dripNFTs } });
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
            <title>{`DripIN - Collections`}</title>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Collections">
                            {collections.map((collection, index) => (
                                <CommandItem
                                    key={index}
                                    onSelect={() => {
                                        setOpen(false)
                                        window.location.href = `./collections/${collection.group_value}`
                                    }}
                                >
                                    {collection.collection_metadata.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>

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
                                    {publicKey?.toBase58().slice(0, 4) + ".." + publicKey.toBase58().slice(20,24) + ".." + publicKey?.toBase58().slice(-4)}
                                </Label>
                            )
                        }
                    </CardContent>
                </Card>

                {publicKey === null ? (
                    null
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Total Collections</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {tokens === null ? (
                                        <Label className="flex gap-2 text-xl">
                                            <SpinnerLoadingAnimation size={24} />
                                        </Label>
                                    ) : (
                                        <>
                                            <Label className="text-xl">
                                                {TotalCollections}
                                            </Label>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Total NFTs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {tokens === null ? (
                                        <Label className="flex gap-2 text-xl">
                                            <SpinnerLoadingAnimation size={24} />
                                        </Label>
                                    ) : (
                                        <Label className="text-xl">
                                            {TotalNFTs}
                                        </Label>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>

            {publicKey === null ? (
                null
            ) : (
                <>
                    {tokens === null ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                                {new Array(perPage).fill(null).map(() => (
                                    <>
                                        <Card>
                                            <CardContent className="pt-6">
                                                <Skeleton className="aspect-square border-2 object-contain w-full h-full rounded-md" />
                                            </CardContent>
                                            <CardHeader className="pt-0">
                                                <CardTitle>
                                                    <Skeleton className="h-8" />
                                                </CardTitle>
                                            </CardHeader>
                                            <CardFooter>
                                                <Skeleton className="h-10 w-44" />
                                            </CardFooter>
                                        </Card>
                                    </>
                                ))}
                            </div>

                            <div className="col-span-full flex justify-center items-center mt-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 0}
                                >
                                    <ChevronLeftIcon className="mr-2 h-4 w-4" />
                                    Previous
                                </Button>
                                <Skeleton className="h-5 w-7" />
                                <Label className="mx-4">/</Label>
                                <Skeleton className="h-5 w-7" />
                                <Button
                                    variant="ghost"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === Math.floor(TotalCollections! / perPage)}
                                >
                                    Next
                                    <ChevronRightIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                                {pageNavigation(page)?.map((item, index) => (
                                    <Card key={index}>
                                        <CardContent className="pt-6">
                                            <Image
                                                width={512}
                                                height={512}
                                                src={item.collection_metadata.image}
                                                alt={item.collection_metadata.name}
                                                className="aspect-square border-2 object-contain w-full h-full rounded-md"
                                            />
                                        </CardContent>
                                        <CardHeader className="pt-0">
                                            <CardTitle>{item.collection_metadata.name}</CardTitle>
                                        </CardHeader>
                                        <CardFooter>
                                            <Link href={`./collections/${item.group_value}`}>
                                                <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                                                    View Collection
                                                    <ArrowRight size={18} className="max-sm:w-4 cursor-pointer" />
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                            {tokens?.items.items.length! > 0 && (
                                <div className="col-span-full flex justify-center items-center mt-4">
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

                            {tokens?.items.items.length === 0 && (
                                <div className="col-span-full h-[60vh] flex justify-center items-center">
                                    <Label className="text-xl text-red-400">
                                        No NFTs found
                                    </Label>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* <pre>{JSON.stringify(collections, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(tokens?.items.items.slice(0, 1), null, 2)}</pre> */}
        </>
    );
}
