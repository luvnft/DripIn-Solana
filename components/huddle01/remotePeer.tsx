
import clsx from 'clsx';
import Audio from './media/Audio';
import PersonVideo from "./media/Video";
import GridContainer from './GridContainer';
import { PeerMetadata } from "@/types/huddle01Type";
import { useStudioState } from '@/lib/huddle01/studio/studioState';
import { useLocalScreenShare, useRemoteAudio, useRemotePeer, useRemoteScreenShare, useRemoteVideo } from '@huddle01/react/hooks';

interface RemotePeerProps {
    peerId: string;
}

const RemotePeer = ({ peerId }: RemotePeerProps) => {
    const { stream: videoStream } = useRemoteVideo({ peerId });
    const { stream: audioStream } = useRemoteAudio({ peerId });
    const { metadata } = useRemotePeer<PeerMetadata>({ peerId });
    const { isScreenShared } = useStudioState();

    return (
        <GridContainer
            className={clsx(isScreenShared ? 'w-full h-full my-3 mx-1' : '')}
        >
            {videoStream ? (
                <PersonVideo stream={videoStream} name={metadata?.displayName ?? 'guest'} />
            ) : (
                <div className='flex text-3xl font-semibold items-center justify-center w-24 h-24 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-full'>
                    {metadata?.displayName?.[0].toUpperCase()}
                </div>
            )}
            <span className='absolute bottom-4 left-4 text-slate-800 dark:text-slate-100 font-medium'>
                {metadata?.displayName}
            </span>
            {audioStream && (
                <Audio stream={audioStream} name={metadata?.displayName ?? 'guest'} />
            )}
        </GridContainer>
    );
};

export default RemotePeer;
