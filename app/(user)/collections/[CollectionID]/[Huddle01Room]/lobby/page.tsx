"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PeerMetadata } from "@/types/huddle01Type";
import { useEffect, useRef, useState } from "react";
import PersonVideo from "@/components/huddle01/media/Video";
import ChangeDevice from "@/components/huddle01/changeDevice";
import { useStudioState } from "@/lib/huddle01/studio/studioState";
import { useLocalAudio, useLocalVideo } from "@huddle01/react/hooks";
import SpinnerLoadingAnimation from "@/components/ui/spinnerLoadingAnimation";
import { useDevices, useLocalMedia, useLocalPeer, useRoom } from "@huddle01/react/hooks";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, Volume2, Presentation, Users, MessageSquareText, PhoneOff } from "lucide-react";

export default function HuddleLobbyPage({ params }: { params: { Huddle01Room: string } }) {
    const router = useRouter();
    const { fetchStream } = useLocalMedia();

    const { name, setName } = useStudioState();
    const { updateMetadata, metadata } = useLocalPeer<PeerMetadata>();

    const videoRef = useRef<HTMLVideoElement>(null);
    const { audioInputDevice, videoDevice } = useStudioState();
    const { isAudioOn, enableAudio, disableAudio } = useLocalAudio();
    const { stream, isVideoOn, enableVideo, disableVideo } = useLocalVideo();

    const { setPreferredDevice: setCamPrefferedDevice } = useDevices({ type: "cam" });
    const { setPreferredDevice: setAudioPrefferedDevice } = useDevices({ type: "mic" });

    const [isJoining, setIsJoining] = useState(false);
    const { joinRoom } = useRoom({
        onJoin: () => {
            setIsJoining(false);
            router.push(`./`);
        },
    });

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        setCamPrefferedDevice(videoDevice.deviceId);
        if (isVideoOn) {
            disableVideo();
            const changeVideo = async () => {
                const { stream } = await fetchStream({
                    mediaDeviceKind: "cam",
                });
                if (stream) {
                    enableVideo(stream);
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

    return (
        <>
            <Card className="w-full my-6">
                <CardContent className="w-full max-w-6xl p-0 mt-6 mx-auto aspect-video rounded-md border-[1px] bg-slate-100 dark:bg-slate-900">
                    {stream && (
                        <PersonVideo
                            stream={stream}
                            name={metadata?.displayName ?? "guest"}
                        />
                    )}
                </CardContent>
                <Card className="w-full max-w-4xl m-6 mx-auto">
                    <CardHeader>
                        <CardTitle className="flex justify-center">
                            Ready to Join?
                        </CardTitle>
                        <CardDescription className="flex justify-center">
                            Join the huddle01 and start the conversation
                        </CardDescription>
                        <CardContent className="pt-6">
                            <div className="flex gap-4 justify-center">
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
                                    <Button variant="outline">
                                        <Volume2 />
                                    </Button>
                                </ChangeDevice>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center pb-0">
                            <div className="flex flex-col gap-6">
                                <Input
                                    type="text"
                                    value={name}
                                    className="w-96"
                                    placeholder="Username"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Button
                                    onClick={async () => {
                                        if (!name) {
                                            toast.error("Please enter your name");
                                            return;
                                        }
                                        setIsJoining(true);
                                        const response = await fetch(
                                            `/api/token?roomId=${params.Huddle01Room}&displayName=${name}`
                                        );
                                        const token = await response.text();
                                        await joinRoom({
                                            roomId: params.Huddle01Room,
                                            token,
                                        });
                                    }}
                                    disabled={isJoining}
                                >
                                    {isJoining ? (
                                        <div className="flex gap-2 items-center">
                                            <SpinnerLoadingAnimation size={24} />
                                            <span>Entering Room...</span>
                                        </div>
                                    ) : (
                                        "Enter Room"
                                    )}
                                </Button>
                            </div>
                        </CardFooter>
                    </CardHeader>
                </Card>
            </Card >
        </>
    )
}
