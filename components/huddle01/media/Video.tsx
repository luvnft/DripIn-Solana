import React, { useEffect, useRef } from 'react';
import { useStudioState } from '@/lib/huddle01/studio/studioState';

interface VideoProps {
    stream: MediaStream | null;
    name: string;
}

const PersonVideo = ({ stream, name }: VideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { isRecordVideo } = useStudioState();

    useEffect(() => {
        const videoObj = videoRef.current;

        if (videoObj && stream) {
            videoObj.srcObject = stream;
            videoObj.onloadedmetadata = async () => {
                try {
                    videoObj.muted = true;
                    await videoObj.play();
                } catch (error) {
                    console.error(error);
                }
            };
        }
    }, [stream]);

    return (
        <>
            <video
                className='rounded-lg object-cover aspect-video'
                ref={videoRef}
                autoPlay
                muted
            />
        </>
    );
};

export default PersonVideo;
