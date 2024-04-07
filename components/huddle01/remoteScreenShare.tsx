import Audio from './media/Audio';
import PersonVideo from "./media/Video";
import GridContainer from './GridContainer';
import { PeerMetadata } from "@/types/huddle01Type";
import { useStudioState } from '@/lib/huddle01/studio/studioState';
import { useRemotePeer, useRemoteScreenShare } from '@huddle01/react/hooks';

interface RemotePeerProps {
    peerId: string;
}

const RemoteScreenShare = ({ peerId }: RemotePeerProps) => {
    const { setIsScreenShared } = useStudioState();
    const { videoTrack, audioTrack } = useRemoteScreenShare({
        peerId,
        onPlayable(data) {
            if (data) {
                setIsScreenShared(true);
            }
        },
        onClose() {
            setIsScreenShared(false);
        },
    });
    const { metadata } = useRemotePeer<PeerMetadata>({ peerId });

    return (
        <>
            {videoTrack && (
                <div className='w-3/4'>
                    <GridContainer className='w-full h-full'>
                        <>
                            <PersonVideo
                                stream={videoTrack && new MediaStream([videoTrack])}
                                name={metadata?.displayName ?? 'guest'}
                            />
                            {audioTrack && (
                                <Audio
                                    stream={audioTrack && new MediaStream([audioTrack])}
                                    name={metadata?.displayName ?? 'guest'}
                                />
                            )}
                        </>
                    </GridContainer>
                </div>
            )}
        </>
    );
};

export default RemoteScreenShare;
