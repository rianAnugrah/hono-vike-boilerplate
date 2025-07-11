export type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  placement?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  password: string;
  userLocations?: Array<{ id: number; description?: string }>;
  locations?: Array<{ id: number; description?: string }>;
  location?: { id: number; description?: string };
  locationIds?: number[];
}; 