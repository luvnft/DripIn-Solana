"use client";

import { useOthers } from "@/liveblocks.config";

interface CollectionAddressProps {
    collectionAddress?: string;
}

export function CollaborativeApp({ collectionAddress }: CollectionAddressProps) {
    const others = useOthers();
    const userCount = others.length + 1;
    return (
        <>
            <div className="flex items-center gap-4">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="flex items-center gap-2">
                    <span className="text-green-400">
                        {userCount}
                    </span>
                    User Active
                </span>
            </div >
        </>
    );
}
