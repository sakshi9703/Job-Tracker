import { z } from "zod";

export const jobSchema = z.object({
  company: z.string().min(1, "Company name is required"),

  role: z.string().min(1, "Role is required"),

  status: z.enum([
    "Interested",
    "Applied",
    "Interview",
    "Accepted",
    "Rejected",
  ]),

  description: z.string()
    .trim()
    .optional()
    .default(""),

  date: z.string().min(1, "Date is required"),

  location: z.string().min(1, "Location is required"),

  notes: z
    .string()
    .trim()
    .optional()
    .default(""),
});