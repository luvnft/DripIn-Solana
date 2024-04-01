"use client";

import { useOthers } from "@/liveblocks.config";

interface CollectionAddressProps {
    collectionAddress?: string;
}

export function CollaborativeApp({ collectionAddress }: CollectionAddressProps) {
    const others = useOthers();
    const userCount = others.length;
    return (
        <>
            <div className="pt-6">
                There are <span className="text-green-400">{userCount}</span> other user(s) online from <span className="text-red-400">{collectionAddress}</span>
            </div>
        </>
    );
}