import React, { useState, useEffect } from "react";
import { ReactNode } from "react";
import InputSelect from "@/components/ui/input-select";
import InputText from "@/components/ui/input-text";
import {
  ArrowUpDown,
  Dot,
  FilterIcon,
  RefreshCcwDotIcon,
  RefreshCwIcon,
  Search,
} from "lucide-react";
import GlassButton from "@/components/ui/glass-button/glass-button";

type Props = {
  defaultValues?: {
    q?: string;
    role?: string;
    placement?: string;
    locationId?: number | string;
    sort?: string;
    order?: string;
  };
  onChange: (filters: Record<string, string>) => void;
  children?: ReactNode;
};

export function UserFilterToolbar({ defaultValues = {}, onChange }: Props) {
  const [q, setQ] = useState(defaultValues.q || "");
  const [role, setRole] = useState(defaultValues.role || "");
  // const [locationId, setLocationId] = useState<string | number>(defaultValues.locationId || 1);
  const [sort, setSort] = useState(defaultValues.sort || "createdAt");
  const [order, setOrder] = useState(defaultValues.order || "desc");

  // Trigger onChange whenever any filter state changes
  useEffect(() => {
    onChange({
      q,
      role,
      // locationId: String(locationId), // Convert to string
      sort,
      order,
    });
  }, [q, role, sort, order, onChange]);

  const handleReset = () => {
    setQ("");
    setRole("");
    // setLocationId("");
    setSort("createdAt");
    setOrder("desc");
    onChange({});
  };

  return (
    <div className="flex flex-col gap-2">
      
      <div className="col-span-2">
        <InputText
          placeholder="Search Name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          icon={<Search />}
        />
      </div>

      <div className="flex text-xs w-full text-gray-500 items-center gap-1 px-2">
        <p className="flex-grow text-left">Filter options</p>
        <GlassButton onClick={handleReset} size="xs">
          Reset Filter
        </GlassButton>
      </div>

      <div className="border border-black/5 bg-white/15 rounded-xl px-2 divide-y divide-black/5 gap-0 flex flex-col">
        <InputSelect
          value={role}
          icon={<FilterIcon size={12} className="text-gray-600" />}
          onChange={(e) => {
            const value = typeof e === "string" ? e : e.target.value;
            setRole(value);
          }}
          options={[
            { value: "admin", label: "Admin" },
            { value: "pic", label: "PIC" },
            { value: "read_only", label: "Read only" },
          ]}
          label="By role"
        />

        <InputSelect
          value={sort}
          icon={<ArrowUpDown size={12} className="text-gray-600" />}
          onChange={(e) => {
            const value = typeof e === "string" ? e : e.target.value;
            setSort(value);
          }}
          options={[
            { value: "createdAt", label: "Created Date" },
            { value: "name", label: "Name" },
            { value: "email", label: "Email" },
          ]}
          label="Sort by"
        />

        <InputSelect
          icon={<Dot size={12} className="text-transparent" />}
          value={order}
          onChange={(e) => {
            const value = typeof e === "string" ? e : e.target.value;
            setOrder(value);
          }}
          options={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
          label="Order by"
        />
      </div>

    
    </div>
  );
}
