import React from "react";

export interface TabProps {
  tabs: React.ReactNode[];
  activeTab: number;
  onTabChange: (index: number) => void;
  className?: string;
  children?: React.ReactNode[];
}

const Tab: React.FC<TabProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  children,
}) => {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key === "ArrowRight") {
      onTabChange((idx + 1) % tabs.length);
    } else if (e.key === "ArrowLeft") {
      onTabChange((idx - 1 + tabs.length) % tabs.length);
    } else if (e.key === "Enter" || e.key === " ") {
      onTabChange(idx);
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className=" mb-2 w-full z-10 bg-white/0 backdrop-blur-sm rounded-[14px] shadow-glass p-1">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`px-4 py-2 text-xs cursor-pointer focus:outline-none focus:ring-0 focus:ring-orange-200 transition-all duration-200
              ${
                idx === activeTab
                  ? "bg-white/30 text-white rounded-[12px] shadow-lg border-0 border-orange-200 scale-105"
                  : "bg-white/0 text-white/80 "
              }
              ${idx === 0 ? "rounded-l-[12px]" : ""}
              ${idx === tabs.length - 1 ? "rounded-r-[12px]" : ""}
            `}
            aria-selected={idx === activeTab}
            aria-controls={`tabpanel-${idx}`}
            tabIndex={0}
            onClick={() => onTabChange(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            role="tab"
            id={`tab-${idx}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        className={`w-full flex flex-col p-1 bg-white/0 backdrop-blur-2xl rounded-[18px] shadow-glass relative ${
          className || ""
        }`}
        style={{ minHeight: 400 }}
      >
        {children && Array.isArray(children) && children[activeTab]}
      </div>
    </>
  );
};

export default Tab;
