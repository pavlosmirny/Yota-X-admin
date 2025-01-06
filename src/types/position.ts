// src/types/position.ts
export interface Position {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  description: string;
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}

export type CreatePositionDto = Omit<
  Position,
  "id" | "createdAt" | "updatedAt"
>;

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
] as const;

export const DEPARTMENTS = [
  "Development",
  "Design",
  "Marketing",
  "Sales",
  "Support",
  "HR",
  "Management",
] as const;

export const LOCATIONS = ["Remote", "Hybrid", "Office", "Flexible"] as const;
