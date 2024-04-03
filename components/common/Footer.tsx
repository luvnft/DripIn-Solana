import { Label } from "@/components/ui/label";

export default function Footer() {
    return (
        <footer className="w-full mt-auto">
            <div className="mt-4 border-t py-6 text-black dark:text-white">
                <Label className="flex items-center text-center justify-center w-full max-w-[95vw] mx-auto">
                    Made with ❤️ SolSync
                </Label>
            </div>
        </footer>
    );
}
