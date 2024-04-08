import Link from "next/link";
import Image from "next/image";
import { MoveRight } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[90vh]">
                <Label className="text-6xl">DripIn Revolutionizes Social</Label>
                <Label className="text-xl">Where community syncs, creators thrive, and tokens unlock the future of social connectivity.</Label>
                <div className="my-20 p-8 flex flex-col gap-4 items-center justify-center bg-slate-300 dark:bg-slate-800 rounded-lg">
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
                <Link href="./collections">
                    <Button variant="outline" className="flex items-center text-md gap-2">
                        Explore Collections
                        <MoveRight />
                    </Button>
                </Link>
            </div>
        </>
    );
}
