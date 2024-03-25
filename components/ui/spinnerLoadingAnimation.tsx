interface SpinnerLoadingAnimationProps {
    size: number;
}

export default function SpinnerLoadingAnimation({ size }: SpinnerLoadingAnimationProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox={"0 0 " + size + " " + size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin h-6 w-6 text-primary-500"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}