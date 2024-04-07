"use client";

import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Role } from "@huddle01/server-sdk/auth";
import { PeerMetadata } from "@/types/huddle01Type";
import { useEffect, useRef, useState } from "react";
import RemotePeer from '@/components/huddle01/remotePeer';
import PersonVideo from "@/components/huddle01/media/Video";
import ChangeDevice from "@/components/huddle01/changeDevice";
import GridContainer from "@/components/huddle01/GridContainer";
import { useStudioState } from "@/lib/huddle01/studio/studioState";
import RemoteScreenShare from '@/components/huddle01/remoteScreenShare';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, Volume2, Monitor, MonitorStop, Users, MessageSquareText, PhoneOff } from "lucide-react";
import { useDataMessage, useDevices, useLocalAudio, useLocalMedia, useLocalPeer, useLocalScreenShare, useLocalVideo, usePeerIds, useRoom } from "@huddle01/react/hooks";

export default function Huddle01RoomPage({ params }: { params: { Huddle01Room: string }; }) {
    const { isVideoOn, enableVideo, disableVideo, stream } = useLocalVideo();
    const { isAudioOn, enableAudio, disableAudio, stream: audioStream } = useLocalAudio();
    const { fetchStream } = useLocalMedia();
    const { setPreferredDevice: setCamPrefferedDevice } = useDevices({ type: "cam" });
    const { setPreferredDevice: setAudioPrefferedDevice } = useDevices({ type: "mic" });
    const { name, addChatMessage, activeBg, videoDevice, audioInputDevice, layout, isScreenShared, setIsScreenShared } = useStudioState();
    const videoRef = useRef<HTMLVideoElement>(null);
    const { peerIds } = usePeerIds({ roles: [Role.HOST, Role.GUEST] });
    const [isCopied, setIsCopied] = useState(false);
    const router = useRouter();
    const { peerId } = useLocalPeer();
    const { videoTrack } = useLocalScreenShare();
    const { leaveRoom, room } = useRoom();
    const { role, metadata, updateMetadata } = useLocalPeer<PeerMetadata>();
    const { state } = useRoom({
        onLeave: async () => {
            router.push(`./`);
        },
    });

    useDataMessage({
        async onMessage(payload, from, label) {
            if (label === "chat") {
                const { message, name } = JSON.parse(payload);
                addChatMessage({
                    name: name,
                    text: message,
                    isUser: from === peerId,
                });
            }
            if (label === "file") {
                const { message, fileName, name } = JSON.parse(payload);
                // fetch file from message and display it
                addChatMessage({
                    name: name,
                    text: message,
                    isUser: from === peerId,
                    fileName,
                });
            }
            if (label === "server-message") {
                const { s3URL } = JSON.parse(payload);
                alert(`Your recording: ${s3URL}`);
            }
        },
    });

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        if (state === "idle") {
            router.push(`${params.Huddle01Room}/lobby`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        setCamPrefferedDevice(videoDevice.deviceId);
        if (isVideoOn) {
            disableVideo();
            const changeVideo = async () => {
                const { stream } = await fetchStream({
                    mediaDeviceKind: "cam",
                });
                if (stream) {
                    await enableVideo(stream);
                }
            };
            changeVideo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoDevice]);

    useEffect(() => {
        setAudioPrefferedDevice(audioInputDevice.deviceId);
        if (isAudioOn) {
            disableAudio();
            const changeAudio = async () => {
                const { stream } = await fetchStream({
                    mediaDeviceKind: "mic",
                });
                if (stream) {
                    enableAudio(stream);
                }
            };
            changeAudio();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioInputDevice]);

    const { startScreenShare, stopScreenShare, shareStream } =
        useLocalScreenShare({
            onProduceStart(data) {
                if (data) {
                    setIsScreenShared(true);
                }
            },
            onProduceClose(label) {
                if (label) {
                    setIsScreenShared(false);
                }
            },
        });

    return (
        <>
            <Card className="mt-6 mb-3">
                <CardHeader className="w-full border-b-[1px] rounded-md mb-6">
                    <CardTitle className="font-normal text-lg">Username: {name}</CardTitle>
                    <CardDescription>SolSync Room: {params.Huddle01Room}</CardDescription>
                </CardHeader>

                <div className="w-full max-w-[90%] mx-auto py-6">
                    {shareStream && (
                        <GridContainer className='w-full h-full'>
                            <>
                                <PersonVideo
                                    stream={videoTrack && new MediaStream([videoTrack])}
                                    name={metadata?.displayName ?? 'guest'}
                                />
                            </>
                        </GridContainer>
                    )}
                    {peerIds.map((peerId) => (
                        <RemoteScreenShare key={peerId} peerId={peerId} />
                    ))}
                    <section
                        className={clsx(
                            'justify-center px-4',
                            isScreenShared
                                ? 'flex flex-col w-1/4'
                                : 'flex flex-wrap gap-4 w-full'
                        )}
                    >
                        {role !== Role.BOT && (
                            <GridContainer
                                className={clsx(
                                    isScreenShared ? 'w-full h-full my-3 mx-1' : ''
                                )}
                            >
                                {stream ? (
                                    <>
                                        <PersonVideo
                                            stream={stream}
                                            name={metadata?.displayName ?? 'guest'}
                                        />
                                    </>
                                ) : (
                                    <div className='flex text-3xl font-semibold items-center justify-center w-24 h-24 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-full'>
                                        {name[0]?.toUpperCase()}
                                    </div>
                                )}
                                <span className='absolute bottom-4 left-4 text-slate-800 dark:text-slate-100 font-medium'>
                                    {`${metadata?.displayName} (You)`}
                                </span>
                            </GridContainer>
                        )}
                        {peerIds.map((peerId) => (
                            <RemotePeer key={peerId} peerId={peerId} />
                        ))}
                    </section>
                </div>

                <CardFooter className="w-full flex justify-between pt-6 border-t-[1px] rounded-md mt-6">
                    <CardContent className="flex gap-4 pb-0">
                        <Button variant="destructive" onClick={leaveRoom}><PhoneOff /></Button>
                    </CardContent>
                    <CardContent className="flex gap-4 pb-0">
                        <ChangeDevice deviceType="cam">
                            <Button
                                variant={isVideoOn ? "outline" : "destructive"}
                                onClick={() => {
                                    if (isVideoOn) {
                                        disableVideo();
                                    } else {
                                        enableVideo();
                                    }
                                }}
                            >
                                {isVideoOn ? (<Video />) : (<VideoOff />)}
                            </Button>
                        </ChangeDevice>
                        <ChangeDevice deviceType="mic">
                            <Button
                                variant={isAudioOn ? "outline" : "destructive"}
                                onClick={() => {
                                    if (isAudioOn) {
                                        disableAudio();
                                    } else {
                                        enableAudio();
                                    }
                                }}
                            >
                                {isAudioOn ? (<Mic />) : (<MicOff />)}
                            </Button>
                        </ChangeDevice>
                        <ChangeDevice deviceType="speaker">
                            <Button variant="outline" >
                                <Volume2 />
                            </Button>
                        </ChangeDevice>
                        <Button
                            variant={isScreenShared ? "destructive" : "outline"}
                            onClick={() => {
                                if (isScreenShared) {
                                    // if (shareStream !== null) {
                                    //     toast.error('Only one screen share is allowed at a time');
                                    //     return;
                                    // }
                                    stopScreenShare();
                                }
                                else {
                                    startScreenShare();
                                }
                            }}
                        >
                            {isScreenShared ? (<MonitorStop />) : (<Monitor />)}
                        </Button>
                    </CardContent>
                    <CardContent className="flex gap-4 pb-0">
                        <Sheet>
                            <SheetTrigger>
                                <Button variant="outline"><Users /></Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Users</SheetTitle>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                        <Sheet>
                            <SheetTrigger>
                                <Button variant="outline"><MessageSquareText /></Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Messages</SheetTitle>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </CardContent>
                </CardFooter>
            </Card>
        </>
    );
}
