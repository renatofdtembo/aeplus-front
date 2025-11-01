import { useState, ReactNode } from "react";
import clsx from "clsx";

type Tab = {
    label: string;
    content: ReactNode;
};

type TabBarProps = {
    tabs: Tab[];
    layout?: "top" | "left"; // padrão "top"
};

export default function TabBar({ tabs, layout = "top" }: TabBarProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const isHorizontal = layout === "top";

    return (
        <div
            className={clsx(
                "flex w-full rounded overflow-hidden bg-white",
                {
                    "flex-col": isHorizontal,
                    "flex-col md:flex-row": !isHorizontal,
                }
            )}
        >
            {/* Tab headers */}
            <div
                className={clsx("bg-gray-100", {
                    "flex border-b": isHorizontal,
                    "flex md:flex-col w-full md:w-48 border-r": !isHorizontal,
                })}
            >
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={clsx(
                            "px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-all min-w-[120px] w-auto text-center",
                            {
                                "bg-white border-b-2 border-blue-500 text-blue-600":
                                    isHorizontal && activeIndex === index,
                                "bg-white md:border-l-4 border-blue-500 text-blue-600":
                                    !isHorizontal && activeIndex === index,
                            }
                        )}
                        onClick={() => setActiveIndex(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="p-4 w-full">{tabs[activeIndex].content}</div>
        </div>
    );
}
