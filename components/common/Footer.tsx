import { Label } from "@/components/ui/label";
import { Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <footer className="w-full max-w-[95vw] mx-auto mt-auto">
            <div className="mt-4 border-t py-6 flex justify-between">
                <Label className="flex items-center text-center w-full max-w-[95vw] mx-auto">
                    Made with ❤️ DripIN
                </Label>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={()=>{window.open("https://github.com/DripIN-Community/DripIN", "_blank")}}
                    >
                        <Github />
                    </Button>
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={()=>{window.open("https://x.com/_DripIN", "_blank")}}
                    >
                        <Twitter />
                    </Button>
                </div>
            </div>
        </footer>
    );
}
