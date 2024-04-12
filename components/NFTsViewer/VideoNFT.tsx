import Video from 'next-video';
import { VideoNFTProps } from "@/types/NFTsType";

export default function VideoNFT({ VideoSRC, ThumbnailSRC }: VideoNFTProps) {
    return (
        <Video
            src={VideoSRC}
            poster={ThumbnailSRC}
            accentColor="#8752F3"
            className="aspect-square border-2 object-contain w-full h-full rounded-md p-1"
        />
    );
}
