// src/constants/positions.ts

export const DEPARTMENTS = [
  "Development",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Human Resources",
  "Finance",
  "Legal",
  "Product Management",
  "Customer Support",
  "Research & Development",
] as const;

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Freelance",
] as const;

export const LOCATIONS = ["Remote", "Hybrid", "On-site", "Flexible"] as const;

export const EXPERIENCE_LEVELS = [
  "Entry Level (0-2 years)",
  "Junior (2-4 years)",
  "Mid-Level (4-6 years)",
  "Senior (6-8 years)",
  "Lead (8-10 years)",
  "Principal (10+ years)",
] as const;

// Типы для TypeScript
export type Department = (typeof DEPARTMENTS)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type Location = (typeof LOCATIONS)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
