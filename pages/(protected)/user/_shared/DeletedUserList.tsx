import Badge from "@/components/ui/badge";
import type { User } from "@/types/user";
import React from "react";

interface DeletedUserListProps {
  deletedUsers: User[];
  loading: boolean;
  refreshing: boolean;
  handleRestore: (id: string) => void;
}

const DeletedUserList: React.FC<DeletedUserListProps> = ({ deletedUsers, loading, refreshing, handleRestore }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
      {/* Table Header */}
      <div className="hidden md:grid md:grid-cols-6 border-b border-gray-200 px-6 py-3">
        <div className="text-sm font-medium text-gray-600">Email</div>
        <div className="text-sm font-medium text-gray-600">Name</div>
        <div className="text-sm font-medium text-gray-600">Role</div>
        <div className="text-sm font-medium text-gray-600">Placement</div>
        <div className="text-sm font-medium text-gray-600">Deleted At</div>
        <div className="text-sm font-medium text-gray-600">Actions</div>
      </div>
      {/* Loading State */}
      {loading && !refreshing && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-500">Loading users...</span>
        </div>
      )}
      {/* Empty State */}
      {!loading && deletedUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No deleted users found</h3>
          <p className="text-gray-500 max-w-md mb-6">
            There are no deleted users matching your current filters. Try adjusting your search.
          </p>
        </div>
      )}
      {/* Deleted User List */}
      {!loading && deletedUsers.length > 0 && (
        <div className="divide-y divide-gray-100 overflow-y-auto max-h-[calc(100vh-320px)]">
          {deletedUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-1 md:grid-cols-6 px-6 py-4 hover:bg-gray-50 transition-all gap-y-2 md:gap-y-0"
            >
              {/* Email */}
              <div className="flex items-center">
                <span className="md:hidden text-xs font-medium text-gray-500 w-20">Email:</span>
                <span className="text-gray-700 text-sm font-medium">{user.email}</span>
              </div>
              {/* Name */}
              <div className="flex items-center">
                <span className="md:hidden text-xs font-medium text-gray-500 w-20">Name:</span>
                <span className="text-gray-800 text-sm font-medium">{user.name || "—"}</span>
              </div>
              {/* Role */}
              <div className="flex items-center">
                <span className="md:hidden text-xs font-medium text-gray-500 w-20">Role:</span>
                <div className="text-gray-800">
                  {user.role ? (
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "manager"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "read_only"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </div>
              </div>
              {/* Placement */}
              <div className="flex items-center">
                <span className="md:hidden text-xs font-medium text-gray-500 w-20">Placement:</span>
                <span className="text-gray-700 text-sm flex flex-wrap gap-1">
                  {user?.locations?.map((loc: { id: number; description?: string }) => (
                    <Badge
                      key={loc.id}
                      text={loc.description || ""}
                      color="blue"
                      variant="light"
                    />
                  ))}
                </span>
              </div>
              {/* Date Column */}
              <div className="flex items-center">
                <span className="md:hidden text-xs font-medium text-gray-500 w-20">Deleted:</span>
                <span className="text-gray-600 text-sm">
                  {user.deletedAt ? new Date(user.deletedAt).toLocaleDateString() : "—"}
                </span>
              </div>
              {/* Actions */}
              <div className="flex space-x-2 md:justify-start justify-end items-center">
                <button
                  onClick={() => handleRestore(user.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  title="Restore user"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeletedUserList; 