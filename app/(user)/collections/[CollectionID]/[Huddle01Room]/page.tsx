"use client";

import clsx from "clsx";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Role } from "@huddle01/server-sdk/auth";
import { PeerMetadata } from "@/types/huddle01Type";
import { useEffect, useRef, useState } from "react";
import RemotePeer from "@/components/huddle01/remotePeer";
import PersonVideo from "@/components/huddle01/media/Video";
import ChangeDevice from "@/components/huddle01/changeDevice";
import GridContainer from "@/components/huddle01/GridContainer";
import { useStudioState } from "@/lib/huddle01/studio/studioState";
import RemoteScreenShare from "@/components/huddle01/remoteScreenShare";
import PeerData from "@/components/huddle01/Sidebar/PersonData/peerData";
import ChatsData from "@/components/huddle01/Sidebar/ChatData/ChatsData";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, Volume2, Monitor, MonitorStop, Users, MessageSquareText, PhoneOff, SendHorizontal } from "lucide-react";
import { useDataMessage, useDevices, useLocalAudio, useLocalMedia, useLocalPeer, useLocalScreenShare, useLocalVideo, usePeerIds, useRoom } from "@huddle01/react/hooks";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Huddle01RoomPage({ params }: { params: { Huddle01Room: string }; }) {
    const router = useRouter();
    const { peerId } = useLocalPeer();
    const { leaveRoom } = useRoom();
    const { sendData } = useDataMessage();
    const { fetchStream } = useLocalMedia();
    const [message, setMessage] = useState("");
    const { videoTrack } = useLocalScreenShare();
    const videoRef = useRef<HTMLVideoElement>(null);
    const { role, metadata } = useLocalPeer<PeerMetadata>();
    const { isVideoOn, enableVideo, disableVideo, stream } = useLocalVideo();
    const { setPreferredDevice: setCamPrefferedDevice } = useDevices({ type: "cam" });
    const { setPreferredDevice: setAudioPrefferedDevice } = useDevices({ type: "mic" });
    const { isAudioOn, enableAudio, disableAudio, stream: audioStream } = useLocalAudio();
    const { name, addChatMessage, videoDevice, audioInputDevice, isScreenShared, setIsScreenShared } = useStudioState();
    const { peerIds } = usePeerIds({ roles: [Role.HOST, Role.GUEST] });
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


    const sendMessage = () => {
        sendData({
            to: "*",
            payload: JSON.stringify({
                message,
                name: metadata?.displayName,
            }),
            label: "chat",
        });
        setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <>
            <Card className="mt-6 mb-3">
                <CardHeader className="w-full border-b-[1px] rounded-md mb-6">
                    <CardTitle className="font-normal text-lg">Username: {name}</CardTitle>
                    <CardDescription>DripIN Room: {params.Huddle01Room}</CardDescription>
                </CardHeader>

                <div className="w-full max-w-[90%] mx-auto py-6">
                    {shareStream && (
                        <GridContainer className="w-full h-full">
                            <>
                                <PersonVideo
                                    stream={videoTrack && new MediaStream([videoTrack])}
                                    name={metadata?.displayName ?? "guest"}
                                />
                            </>
                        </GridContainer>
                    )}
                    {peerIds.map((peerId) => (
                        <RemoteScreenShare key={peerId} peerId={peerId} />
                    ))}
                    <section
                        className={clsx(
                            "justify-center px-4",
                            isScreenShared
                                ? "flex flex-col w-1/4"
                                : "flex flex-wrap gap-4 w-full"
                        )}
                    >
                        {role !== Role.BOT && (
                            <GridContainer
                                className={clsx(
                                    isScreenShared ? "w-full h-full my-3 mx-1" : ""
                                )}
                            >
                                {stream ? (
                                    <>
                                        <PersonVideo
                                            stream={stream}
                                            name={metadata?.displayName ?? "guest"}
                                        />
                                    </>
                                ) : (
                                    <div className="flex text-3xl font-semibold items-center justify-center w-24 h-24 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-full">
                                        {name[0]?.toUpperCase()}
                                    </div>
                                )}
                                <span className="absolute bottom-4 left-4 text-slate-800 dark:text-slate-100 font-medium">
                                    {`${metadata?.displayName} (You)`}
                                </span>
                            </GridContainer>
                        )}
                        {peerIds.map((peerId) => (
                            <RemotePeer key={peerId} peerId={peerId} />
                        ))}
                    </section>
                </div>

                <CardFooter className="w-full flex justify-between pt-6 border-t-[1px] gap-4 rounded-md mt-6 max-sm:flex-col-reverse">
                    <CardContent className="flex gap-4 pb-0">
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Button variant="destructive">
                                    <PhoneOff />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Do you want to leave?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <Button variant="destructive" onClick={leaveRoom}>
                                        Yes
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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

                                if (shareStream !== null) {
                                    stopScreenShare();
                                }
                                else {
                                    if (isScreenShared) {
                                        toast.error('Only one screen share is allowed at a time');
                                        return;
                                    }
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
                                <div className="mb-6">
                                    <div className="flex flex-col gap-2 mt-2 px-4 py-2">
                                        {peerIds.map((peerId) => (
                                            <PeerData peerId={peerId} key={peerId} />
                                        ))}
                                    </div>
                                </div>
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
                                <div className="flex flex-col h-full py-4">
                                    <div className="flex-1 p-2 overflow-y-auto">
                                        <ChatsData />
                                    </div>
                                    <div className="p-2 rounded-b-lg">
                                        <div className="flex gap-2">
                                            <Input
                                                className="flex-1"
                                                placeholder="Type your message"
                                                onChange={(e) => setMessage(e.target.value)}
                                                value={message}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <Button onClick={sendMessage} variant="secondary">
                                                <SendHorizontal />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </CardContent>
                </CardFooter>
            </Card>
        </>
    );
}
