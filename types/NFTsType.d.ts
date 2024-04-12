interface ImageNFTProps {
    ImageSRC: string;
    ImageALT: string;
}

interface AudioNFTProps {
    AudioSRC: string;
    ThumbnailSRC: string;
}

interface VideoNFTProps {
    VideoSRC: string;
    ThumbnailSRC: string;
}

interface ThreeDModelNFTProps {
    ModelSRC: string;
    ModelALT: string;
}

export { ImageNFTProps, AudioNFTProps, VideoNFTProps, type ThreeDModelNFTProps };
