import React from "react";
import GlassButton from "@/components/ui/glass-button/glass-button";
import { RefreshCw } from "lucide-react";
import { UserFilterToolbar } from "@/pages/(protected)/user/_shared/user-filter-toolbar";

type Props = {
  handleRefresh: () => void;
  refreshing: boolean;
  currentView: "active" | "deleted";
  setFilters: (filters: Record<string, unknown>) => void;
};

const UserSidebar: React.FC<Props> = ({ handleRefresh, refreshing, currentView, setFilters }) => (
  <div className="flex bg-white/50 flex-col border border-white/20 shadow-glass backdrop-blur-sm w-[20rem] p-2">
    <div className="flex items-center justify-between mb-3">
      <div className="flex text-xs items-center text-gray-500 font-medium gap-2 pl-2">
        <span>Search and Filter</span>
      </div>
      <GlassButton onClick={handleRefresh} size="xs">
        <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
        <p className="pl-1">Refresh Data</p>
      </GlassButton>
    </div>
    <UserFilterToolbar key={currentView} onChange={setFilters} />
  </div>
);

export default UserSidebar; 