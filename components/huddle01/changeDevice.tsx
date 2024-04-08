"use client";

import { FC, use } from "react";
import { Check } from 'lucide-react';
import { useDevices } from "@huddle01/react/hooks";
import { useStudioState } from "@/lib/huddle01/studio/studioState";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChangeDeviceProps {
    deviceType: "mic" | "cam" | "speaker";
    children: React.ReactNode;
}

const ChangeDevice: FC<ChangeDeviceProps> = ({ children, deviceType }) => {
    const {
        audioInputDevice,
        videoDevice,
        audioOutputDevice,
        setAudioInputDevice,
        setVideoDevice,
        setAudioOutputDevice,
    } = useStudioState();
    const { devices } = useDevices({
        type: deviceType,
    });

    return (
        <>
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>{children}</TooltipTrigger>
                    <TooltipContent>
                        {devices.map((device) => (
                            <button
                                key={device.deviceId}
                                onClick={() => {
                                    switch (deviceType) {
                                        case "mic":
                                            setAudioInputDevice(device);
                                            break;
                                        case "cam":
                                            setVideoDevice(device);
                                            break;
                                        case "speaker":
                                            setAudioOutputDevice(device);
                                            break;
                                    }
                                }}
                                className="flex gap-2 p-2 gray-800 w-full"
                            >
                                <span>
                                    {deviceType === "mic" &&
                                        audioInputDevice?.label === device.label &&
                                        (<Check />)}
                                    {deviceType === "cam" &&
                                        videoDevice?.label === device.label &&
                                        (<Check />)}
                                    {deviceType === "speaker" &&
                                        audioOutputDevice?.label === device.label &&
                                        (<Check />)}
                                </span>
                                {device.label}
                            </button>
                        ))}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    );
};

export default ChangeDevice;
