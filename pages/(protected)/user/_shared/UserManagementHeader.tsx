import React from "react";
import { UserPlus } from "lucide-react";
import GlassButton from "@/components/ui/glass-button/glass-button";

type Props = {
  currentView: "active" | "deleted";
  setForm: (form: { email: string; password: string }) => void;
  setIsModalOpen: (open: boolean) => void;
};

const UserManagementHeader: React.FC<Props> = ({ currentView, setForm, setIsModalOpen }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center">
      <div className="w-[calc(100%_-_8rem)]">
        <h1 className="text-sm font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 text-xs mt-1">Manage system users and their access permissions</p>
      </div>
      <div className="w-[8rem] flex items-center justify-end">
        {currentView === "active" && (
          <GlassButton
            onClick={() => {
              setForm({ email: "", password: "" });
              setIsModalOpen(true);
            }}
            size="sm"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            <span>New User</span>
          </GlassButton>
        )}
      </div>
    </div>
  </div>
);

export default UserManagementHeader; 