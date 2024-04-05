"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import SpinnerLoadingAnimation from "@/components/ui/spinnerLoadingAnimation";

export function Room({ children, roomId }: { children: ReactNode, roomId: string }) {
    return (
        <RoomProvider id={roomId} initialPresence={{}}>
            <ClientSideSuspense fallback={
                <div className="flex items-center gap-2">
                    <SpinnerLoadingAnimation size={24} />
                    Loading…
                </div>
            }>
                {() => children}
            </ClientSideSuspense>
        </RoomProvider>
    );
}