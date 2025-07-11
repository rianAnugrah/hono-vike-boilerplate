import { Link } from "@/renderer/Link";
import Badge from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import type { User } from "@/types/user";
import React from "react";

interface UserListProps {
  users: User[];
  loading: boolean;
  refreshing: boolean;
  handleEdit: (user: User) => void;
  handleDelete: (id: string) => void;
  setForm: (form: Partial<User>) => void;
  setIsModalOpen: (open: boolean) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  loading,
  refreshing,
  handleEdit,
  handleDelete,
  setForm,
  setIsModalOpen,
}) => {
  return (
    <div className="bg-white/10 shadow-sm rounded-xl overflow-hidden border border-white/10">
      {/* Loading State */}
      {loading && !refreshing && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-500">Loading users...</span>
        </div>
      )}
      {/* Empty State */}
      {!loading && users?.length === 0 && (
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
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No users found
          </h3>
          <p className="text-gray-500 max-w-md mb-6">
            There are no users matching your current filters. Try adjusting your
            search or create a new user.
          </p>
          <button
            onClick={() => {
              setForm({ email: "", password: "" });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add First User</span>
          </button>
        </div>
      )}
      {/* User List */}
      {!loading && users?.length > 0 && (
        <div className="divide-y divide-gray-100 overflow-y-auto max-h-[calc(100vh-320px)]">
          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-1 md:grid-cols-6 px-6 py-4 hover:bg-gray-50 transition-all gap-y-2 md:gap-y-0"
            >
              {/* Name */}
              <div className="flex items-center col-span-6">
                <span className="md:hidden text-xs font-medium text-gray-500 w-20">
                  Name:
                </span>
                <span className="text-gray-800 text-sm font-medium">
                  {user.name || "—"}
                </span>
                  {user.role ? (
                    <span
                      className={`px-2.5 py-1 ml-2 text-xs font-medium rounded-full ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-800"
                          : user.role === "pic"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "read_only"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
              </div>
              {/* Email */}
              <div className="flex items-center col-span-2">
                <span className="md:hidden text-xs font-medium text-gray-500 w-20">
                  Email:
                </span>
                <Link
                  href={`/user/${user.id}`}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                >
                  {user.email}
                </Link>
              </div>

              {/* Role */}
              <div className="flex items-center">
                <span className="md:hidden text-xs font-medium text-gray-500 w-20">
                  Role:
                </span>
                
              </div>
              {/* Placement */}
              <div className="flex items-center">
                <span className="md:hidden text-xs font-medium text-gray-500 w-20">
                  Placement:
                </span>
                <span className="text-gray-700 text-sm flex flex-wrap gap-1">
                  {user?.locations?.map(
                    (loc: { id: number; description?: string }) => (
                      <Badge
                        key={loc.id}
                        text={loc.description || ""}
                        color="blue"
                        variant="light"
                      />
                    )
                  )}
                </span>
              </div>
              {/* Date Column */}
              <div className="flex items-center">
                <span className="md:hidden text-xs font-medium text-gray-500 w-20">
                  Created:
                </span>
                <span className="text-gray-600 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              {/* Actions */}
              <div className="flex space-x-2 md:justify-start justify-end items-center">
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit user"
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete user"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

export default UserList;
