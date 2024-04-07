"use client"

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Copy, User, LogOut } from "lucide-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function Header() {
    const { setTheme } = useTheme()
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
            <div className="w-full border-b">
                <div className="max-w-[95vw] w-full px-3 xl:p-0 my-5 mx-auto flex justify-between items-center">
                    <Link href="../" className="cursor-pointer">
                        <Label className="text-2xl cursor-pointer">SolSync</Label>
                    </Link>

                    <div className="flex items-center gap-5">
                        {/* <Link href="../discover">Discover</Link> */}
                        <Link href="../collections">Collections</Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {isConnected ? (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Avatar>
                                            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                            <AvatarFallback>{publicKey?.toBase58().slice(0, 3)}</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="flex items-center gap-2 cursor-pointer"
                                            onClick={() => navigator.clipboard.writeText(publicKey?.toBase58()!)}
                                        >
                                            <Copy size={18} />
                                            <Label>{publicKey?.toBase58().slice(0, 4) + '..' + publicKey?.toBase58().slice(-4)}</Label>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {/* <Link href="../profile">
                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                <User size={18} />
                                                Profile
                                            </DropdownMenuItem>
                                        </Link> */}
                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={disconnect}>
                                            <LogOut size={18} />
                                            disconnect
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <WalletMultiButton />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
