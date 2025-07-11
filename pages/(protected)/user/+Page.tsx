import { Link } from "@/renderer/Link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserFilterToolbar } from "@/pages/(protected)/user/_shared/user-filter-toolbar";
import { UserPlus, Filter, RefreshCw } from "lucide-react";
import UserFormModal from "./_shared/user-form-modal";
import Badge from "@/components/ui/badge";
import GlassButton from "@/components/ui/glass-button/glass-button";
import { Tab } from "@/components/ui/tab";
import UserList from "./_shared/UserList";
import DeletedUserList from "./_shared/DeletedUserList";
import UserManagementHeader from "./_shared/UserManagementHeader";
import UserSidebar from "./_shared/UserSidebar";
import type { User } from "../../../types/user";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Partial<User>>({ email: "", password: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentView, setCurrentView] = useState<"active" | "deleted">(
    "active"
  );

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/users?${query}`);
      const data = await res.json();
      setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDeletedUsers = async () => {
    setLoading(true);
    try {
      // No filters applied for deleted users - fetch all deleted users
      const res = await fetch(`/api/users/deleted`);
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Deleted users response data:", data);
      setDeletedUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching deleted users:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to refresh both lists
  const refreshBothLists = async () => {
    try {
      // Fetch both active and deleted users in parallel
      const [activeRes, deletedRes] = await Promise.all([
        fetch(`/api/users?${new URLSearchParams(filters).toString()}`),
        fetch(`/api/users/deleted`),
      ]);

      const [activeData, deletedData] = await Promise.all([
        activeRes.json(),
        deletedRes.json(),
      ]);

      setUsers(activeData.data || []);
      setDeletedUsers(deletedData.data || []);
    } catch (error) {
      console.error("Error refreshing both lists:", error);
    }
  };

  useEffect(() => {
    if (currentView === "active") {
      fetchUsers();
    } else {
      fetchDeletedUsers();
    }
  }, [filters, currentView]);

  const handleRefresh = () => {
    setRefreshing(true);
    if (currentView === "active") {
      fetchUsers();
    } else {
      fetchDeletedUsers();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/users/${editingId}` : "/api/users";

    const { email, name, role, placement, password, locationIds } = form;

    const body = {
      email,
      name,
      role,
      placement,
      locationIds,
      ...(editingId ? {} : { password }), // don't send password when editing
    };

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setForm({ email: "", password: "" });
      setEditingId(null);
      setIsModalOpen(false);

      // Always refresh both lists after create/update to keep counts accurate
      await refreshBothLists();
    } catch (error) {
      console.error("Error submitting user form:", error);
    }
  };

  const handleEdit = (user: User) => {
    const locsArray = user?.locations?.map((loc: { id: number; description?: string }) => loc.id);
    setForm({ ...user, locationIds: locsArray });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`/api/users/${id}`, { method: "DELETE" });

        // After deletion, refresh both lists to update counts
        await refreshBothLists();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleRestore = async (id: string) => {
    if (window.confirm("Are you sure you want to restore this user?")) {
      try {
        await fetch(`/api/users/${id}/restore`, { method: "POST" });

        // After restoration, refresh both lists to update counts
        await refreshBothLists();
      } catch (error) {
        console.error("Error restoring user:", error);
      }
    }
  };

  const handleCancel = () => {
    setForm({ email: "", password: "" });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-0 min-h-screen flex w-full">
      <div className="w-[calc(100%_-_20rem)] p-4">
        <AnimatePresence>
          {isModalOpen && (
            <UserFormModal
              form={form}
              setForm={setForm}
              editingId={editingId}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </AnimatePresence>

        <UserManagementHeader currentView={currentView} setForm={setForm} setIsModalOpen={setIsModalOpen} />

        <Tab
          tabs={[`Active users (${users?.length})`, `Deleted Users (${deletedUsers.length})`]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {/* Active Users Tab Content */}
          <UserList
            users={users}
            loading={loading}
            refreshing={refreshing}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            setForm={setForm}
            setIsModalOpen={setIsModalOpen}
          />
          {/* Deleted Users Tab Content */}
          <DeletedUserList
            deletedUsers={deletedUsers}
            loading={loading}
            refreshing={refreshing}
            handleRestore={handleRestore}
          />
        </Tab>
      </div>

      <UserSidebar
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        currentView={currentView}
        setFilters={setFilters}
      />
    </div>
  );
}
