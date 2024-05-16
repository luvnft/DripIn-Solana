"use client"

import Link from "next/link";
import Image from "next/image";
import { MoveRight } from 'lucide-react';
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
    const { publicKey, disconnect } = useWallet()
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        if (publicKey) {
            setIsConnected(true);
        }
        else {
            setIsConnected(false);
        }
    }, [publicKey])

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[90vh]">
                <Label className="text-6xl max-sm:text-4xl max-sm:pb-4">A New Social CTA (Call To Action)</Label>
                <Label className="text-xl">Call is the Zoom you own as a Solana LUV NFT. Sell someone your LUV NFT to book a video call. Subscribe to <a href="https://nftv.luvnft.com"><b>NFTV</b></a> 🎮 Discord to sell video calls today.</Label>
                <div className="my-20 p-6 flex flex-col gap-4 items-center justify-center bg-slate-300 dark:bg-slate-800 rounded-lg">
                    <Label className="text-4xl">Built on</Label>
                    <div className="flex gap-8 items-center">
                        <Link href="https://drip.haus/" target="_blank">
                            <Image src="/Drip.webp" width={256} height={256} alt="Drip Logo" />
                        </Link>
                        <Link href="https://solana.com/" target="_blank">
                            <Image src="/Solana.webp" width={256} height={256} alt="Solana Logo" />
                        </Link>
                        <Link href="https://huddle01.com/" target="_blank">
                            <Image src="/huddle01.webp" width={256} height={256} alt="huddle01 Logo" />
                        </Link>
                    </div>
                </div>

                {isConnected ? (
                    <>
                        <Link href="./collections">
                            <Button variant="outline" className="flex items-center text-md gap-2">
                                Explore Collections
                                <MoveRight />
                            </Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Button variant="outline" className="md:hidden lg:hidden xl:hidden 2xl:hidden">
                            <WalletMultiButton />
                        </Button>
                    </>
                )}

            </div>
        </>
    );
}
