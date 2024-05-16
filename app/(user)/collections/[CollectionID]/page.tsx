"use client";

import Link from "next/link";
import Image from "next/image";
import { Video } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import fetchTokens from "@/lib/searchAssets";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/SearchAssetsType";
import { createRoom } from "@/actions/createRoom";
import { Skeleton } from "@/components/ui/skeleton";
import { Room } from "@/components/liveblocks/Room";
import dripHuddleData from "@/lib/drip/dripHuddleData";
import ImageNFT from "@/components/NFTsViewer/ImageNFT";
import AudioNFT from "@/components/NFTsViewer/AudioNFT";
import VideoNFT from "@/components/NFTsViewer/VideoNFT";
import NFTsViewer3D from "@/components/NFTsViewer/3DNFT";
import { ItemsResponse } from "@/types/SearchAssetsType";
import { useWallet } from "@solana/wallet-adapter-react";
import { CollaborativeApp } from "@/components/liveblocks/CollaborativeApp";
import SpinnerLoadingAnimation from "@/components/ui/spinnerLoadingAnimation";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";

interface dripHuddleDataInterface {
    collectionAddress: string;
    huddleRoom: string;
}

export default function SpecificCollectionPage({ params }: { params: { CollectionID: string }; }) {
    const perPage = 6;
    const router = useRouter();
    const { publicKey } = useWallet();
    const [page, setPage] = useState(0);
    const [tokens, setTokens] = useState<ItemsResponse | null>(null);
    const [collectionNFTData, setCollectionNFTData] = useState<Item[] | null>(null);
    const [huddleDripCollectionRoomId, setHuddleDripCollectionRoomId] = useState<dripHuddleDataInterface>();

    const ThreeDMimeType = ["model/gltf-binary", "model/glb"];
    const VideoMimeType = ["video/mp4", "video/webm", "video/mov"];
    const AudioMimeType = ["audio/mpeg", "audio/wav", "audio/weba", "audio/mp3"];
    const ImageMimeType = ["image/png", "image/gif", "image/jpeg", "image/jpg", "image/svg"];

    useEffect(() => {
        const findRoom = dripHuddleData.find((room) => room.collectionAddress == params.CollectionID);
        if (findRoom) {
            setHuddleDripCollectionRoomId((findRoom as unknown) as dripHuddleDataInterface);
        }
    }, [params.CollectionID]);

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
        if (tokens) {
            const collectionNFTData = tokens.items.items.filter((nft) => {
                const collection = nft.grouping.find((g) => g.group_key === "collection");
                return collection && collection.group_value === params.CollectionID;
            });
            setCollectionNFTData((collectionNFTData as unknown) as Item[]);
        }
    }, [tokens, params.CollectionID]);

    console.log(collectionNFTData);

    const pageNavigation = (page: number) => {
        return collectionNFTData?.slice(page * perPage, (page + 1) * perPage);
    }

    const TotalNFTs = tokens?.items.total;

    const TotalCollections = collectionNFTData?.length;

    return (
        <>
            {
                collectionNFTData?.slice(0, 1).map((nft, index) => (
                    <title key={index}>
                        {`${nft.grouping[0].collection_metadata.name} - Collections | CALL`}
                    </title>
                ))
            }

            <div className="flex max-sm:flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row gap-4">
                <div className="basis-1/3 pt-6">
                    {
                        collectionNFTData === null ? (
                            <>
                                <Card className="flex flex-col gap-4 p-4 rounded-2xl">
                                    <Card className="p-4 flex-none rounded-xl">
                                        <Skeleton className="aspect-square border-2 object-contain w-full h-full rounded-lg" />
                                    </Card>
                                    <Card className="flex-1 rounded-xl">
                                        <CardHeader>
                                            <CardTitle>
                                                <Skeleton className="h-8" />
                                            </CardTitle>
                                            <CardDescription>
                                                <Skeleton className="h-5" />
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-2 gap-4">
                                            <CardContent className="p-0">
                                                <CardTitle className="mb-2">
                                                    <Skeleton className="h-8" />
                                                </CardTitle>
                                                <Label className="text-xl">
                                                    <Skeleton className="h-6" />
                                                </Label>
                                            </CardContent>
                                            <CardContent className="p-0 flex items-end justify-end">
                                                <Skeleton className="h-10 w-44" />
                                            </CardContent>
                                        </CardContent>
                                    </Card>
                                </Card>
                            </>
                        ) : (
                            <>
                                {collectionNFTData?.slice(0, 1).map((nft, index) => (
                                    <Card key={index} className="flex flex-col gap-4 p-4 rounded-2xl">
                                        <Card className="p-4 flex-none rounded-xl">
                                            <Image
                                                width={512}
                                                height={512}
                                                src={nft.grouping[0].collection_metadata.image}
                                                alt={nft.grouping[0].collection_metadata.name}
                                                className="aspect-square border-2 object-contain w-full h-full rounded-lg"
                                            />
                                        </Card>
                                        <Card className="flex-1 rounded-xl">
                                            <CardHeader>
                                                <CardTitle>{nft.grouping[0].collection_metadata.name}</CardTitle>
                                                <CardDescription>{nft.grouping[0].collection_metadata.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid grid-cols-2 gap-2">
                                                <CardContent className="p-0">
                                                    <CardTitle className="mb-2">Total NFTs</CardTitle>
                                                    {
                                                        TotalNFTs === undefined ? (
                                                            <Label className="flex gap-2 text-xl">
                                                                <SpinnerLoadingAnimation size={24} />
                                                            </Label>
                                                        ) : (
                                                            <Label className="text-xl">
                                                                {collectionNFTData?.length}
                                                            </Label>
                                                        )
                                                    }
                                                </CardContent>
                                                <CardContent className="p-0 flex justify-end">
                                                    <Link href={`https://solana.fm/address/${params.CollectionID}`} target="_blank">
                                                        <Button variant="secondary">
                                                            <Image
                                                                src="/SolanaFMLogo.svg"
                                                                alt="Solana Logo Purple With Name"
                                                                className="w-5"
                                                                width={20}
                                                                height={20}
                                                            />
                                                            View on Solana FM
                                                        </Button>
                                                    </Link>
                                                </CardContent>
                                            </CardContent>
                                            <CardContent className="flex justify-end">
                                                <div className="flex flex-col gap-2 justify-end">
                                                    <div className="flex justify-end">
                                                        <Room roomId={params.CollectionID}>
                                                            <CollaborativeApp collectionAddress={params.CollectionID} />
                                                        </Room>
                                                    </div>
                                                    <Button
                                                        className="flex items-center gap-2"
                                                        onClick={async () => {
                                                            router.push(`./${params.CollectionID}/${huddleDripCollectionRoomId?.huddleRoom}/lobby`);
                                                        }}
                                                    >
                                                        Join With Huddle01
                                                        <Video />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Card>
                                ))}
                            </>
                        )
                    }
                </div>
                <div className="basis-2/3 pt-6">
                    <>
                        <div className="flex p-6 max-sm:pt-0 max-sm:justify-center md:sr-only lg:sr-only xl:sr-only 2xl:sr-only">
                            <Label className="text-2xl">Collected NFTs</Label>
                        </div>
                        {collectionNFTData === null ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {pageNavigation(page)?.map((item, index) => (
                                        <Card key={index}>
                                            <CardContent className="pt-6">
                                                <Image
                                                    width={512}
                                                    height={512}
                                                    src={item.content.links.image}
                                                    alt={item.content.metadata.name}
                                                    className="aspect-square border-2 object-contain w-full h-full rounded-md"
                                                />
                                            </CardContent>
                                            <CardHeader className="pt-0">
                                                <CardTitle>{item.content.metadata.name}</CardTitle>
                                            </CardHeader>
                                            <CardFooter className="justify-between">
                                                <Badge variant="outline" className="text-lg">
                                                    {item.content.metadata.attributes[item.content.metadata.attributes.length - 1].value}
                                                </Badge>

                                                <Dialog>
                                                    <DialogTrigger>
                                                        <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                                                            View NFT
                                                            <ArrowRight size={18} className="max-sm:w-4 cursor-pointer" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <div className="w-full h-full aspect-square">
                                                            {
                                                                VideoMimeType.includes(item.content.files[1].mime) ? (
                                                                    <VideoNFT
                                                                        VideoSRC={item.content.files[1].uri}
                                                                        ThumbnailSRC={item.content.links.image}
                                                                    />
                                                                ) : ThreeDMimeType.includes(item.content.files[1].mime) ? (
                                                                    <NFTsViewer3D ModelSRC={item.content.files[1].uri} ModelALT={item.content.metadata.name} />
                                                                ) : ImageMimeType.includes(item.content.files[1].mime) ? (
                                                                    <ImageNFT
                                                                        ImageSRC={item.content.links.image}
                                                                        ImageALT={item.content.metadata.name}
                                                                    />
                                                                ) : AudioMimeType.includes(item.content.files[1].mime) ? (
                                                                    <AudioNFT
                                                                        AudioSRC={item.content.files[1].uri}
                                                                        ThumbnailSRC={item.content.links.image}
                                                                    />
                                                                ) : null
                                                            }
                                                        </div>
                                                        <DialogHeader>
                                                            <DialogTitle className="flex items-center justify-between">
                                                                {item.content.metadata.name}
                                                                <Badge variant="outline" className="text-md">
                                                                    {item.content.metadata.attributes[item.content.metadata.attributes.length - 1].value}
                                                                </Badge>
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                {item.content.metadata.description}
                                                            </DialogDescription>
                                                            <Link href={item.content.links.animation_url === "" ? item.content.links.image : item.content.links.animation_url} target="_blank" className="flex pt-4">
                                                                <Button variant="outline" className="w-full">
                                                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                                                    Download
                                                                </Button>
                                                            </Link>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
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

                    {/* {collectionNFTData?.length} */}
                    {/* <pre>{JSON.stringify(collectionNFTData, null, 2)}</pre> */}
                </div>
            </div >
        </>
    );
}