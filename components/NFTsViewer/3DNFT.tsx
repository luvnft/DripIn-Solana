import "@google/model-viewer";
import React, { useRef, useEffect } from "react";
import { ThreeDModelNFTProps } from "@/types/NFTsType";

export default function NFTsViewer3D({ ModelSRC, ModelALT }: ThreeDModelNFTProps) {
    const modelViewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const modelViewer = document.createElement("model-viewer");
        modelViewer.setAttribute("src", ModelSRC);
        modelViewer.setAttribute("alt", ModelALT);
        modelViewer.setAttribute("ar", "true");
        modelViewer.setAttribute("camera-controls", "true");
        modelViewer.setAttribute("autoplay", "true");
        modelViewer.setAttribute("shadow-intensity", "1");
        modelViewer.setAttribute("style", "width: 100%; height: 100%;");

        if (modelViewerRef.current) {
            // Remove all child nodes before appending new one
            while (modelViewerRef.current.firstChild) {
                modelViewerRef.current.firstChild.remove();
            }
            modelViewerRef.current.appendChild(modelViewer);
        }
    }, [ModelSRC, ModelALT]);

    return (
        <div ref={modelViewerRef} className="aspect-square border-2 object-contain w-full h-full rounded-md p-1" />
    );
}