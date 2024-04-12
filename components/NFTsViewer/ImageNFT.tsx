import Image from "next/image";
import { ImageNFTProps } from "@/types/NFTsType";


export default function ImageNFT({ ImageSRC, ImageALT }: ImageNFTProps) {
    return (
        <Image
            width={512}
            height={512}
            src={ImageSRC}
            alt={ImageALT}
            className="aspect-square border-2 object-contain w-full h-full rounded-md"
        />
    );
}
