"use client"

import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Header() {

    return (
        <>
            <div className="w-full border-b ">
                <div className="max-w-[95vw] w-full px-3 xl:p-0 my-5 mx-auto flex justify-between items-center">
                    <Link href="../" className="cursor-pointer">
                        <Label className="text-2xl cursor-pointer">SolSync</Label>
                    </Link>

                    <div className="flex items-center gap-5">
                        <Label>Discover</Label>
                        <Label>Collection</Label>
                        <WalletMultiButton />
                    </div>
                </div>
            </div>
        </>
    )
}
