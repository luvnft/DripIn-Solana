import Video from 'next-video';
import { AudioNFTProps } from "@/types/NFTsType";

export default function AudioNFT({ AudioSRC, ThumbnailSRC }: AudioNFTProps) {
    return (
        <Video
            audio={true}
            src={AudioSRC}
            poster={ThumbnailSRC}
            accentColor="#8752F3"
            className="border-2 object-contain w-full h-full rounded-md pb-10 pt-1"
        />
    );
}
