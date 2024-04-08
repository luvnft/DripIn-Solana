import { PeerMetadata } from "@/types/huddle01Type";
import { useRemotePeer } from "@huddle01/react/hooks";

interface PeerDataProps {
    peerId: string;
}

export default function PeerData({ peerId }: PeerDataProps) {
    const { metadata } = useRemotePeer<PeerMetadata>({ peerId });

    return (
        <div className="flex items-center gap-2 bg-[#8852f380] p-2 rounded-lg">
            <div className="flex text-sm font-semibold items-center justify-center min-w-6 min-h-6 bg-slate-200 dark:bg-slate-800 p-0.5 text-slate-800 dark:text-slate-100 rounded-full">
                {metadata?.displayName?.[0].toUpperCase()}
            </div>
            <span className="text-ellipsis overflow-hidden min-w-20">
                {metadata?.displayName}
            </span>
        </div>
    );
};
