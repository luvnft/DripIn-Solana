import clsx from "clsx";
import { FC } from "react";

interface GridContainerProps {
    children: React.ReactNode;
    className?: string;
}

const GridContainer: FC<GridContainerProps> = ({ children, className }) => {
    return (
        <div
            className={clsx(
                "bg-slate-300 dark:bg-slate-800 relative w-[48%] aspect-video rounded-lg flex flex-col items-center justify-center",
                className
            )}
        >
            {children}
        </div>
    );
};

export default GridContainer;
