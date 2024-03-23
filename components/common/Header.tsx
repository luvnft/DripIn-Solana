"use client"

import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
    const { setTheme } = useTheme()

    return (
        <>
            <div className="w-full rounded-lg">
                <div className="max-w-[90%] w-full px-3 xl:p-0 my-5 mx-auto flex justify-between items-center">
                    <Label className="text-2xl">Phantom NFT Sync</Label>
                    <div className="flex items-center gap-5">
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
                        <WalletMultiButton />
                    </div>
                </div>
                <Separator />
            </div>
        </>
    )
}
