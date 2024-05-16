import { Label } from "@/components/ui/label";
import { Discord, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <footer className="w-full mx-auto border-t rounded-t-lg mt-4">
            <div className="max-w-[95vw] mx-auto py-6 flex justify-between items-center">
                <Label className="flex items-center text-center">
                    Made with ❤️ LUV NFT
                </Label>
                <div className="flex items-center gap-4">
                <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                        window.open("https://nftv.luvnft.com", "_blank")}}
                    >
                    <Discord />
                    </Button>
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={()=>{window.open("https://x.com/luvnft", "_blank")}}
                    >
                        <Twitter />
                    </Button>
                </div>
            </div>
        </footer>
    );
}
