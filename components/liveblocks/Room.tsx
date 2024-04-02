"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";

export function Room({ children, roomId }: { children: ReactNode, roomId: string}) {
    return (
        <RoomProvider id={roomId} initialPresence={{}}>
            <ClientSideSuspense fallback={<div className="pt-6">Loading…</div>}>
                {() => children}
            </ClientSideSuspense>
        </RoomProvider>
    );
}