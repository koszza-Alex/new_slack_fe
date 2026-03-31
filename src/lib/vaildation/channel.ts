import { z } from "zod";

export const createChannelSchema = (existingNames: string[]) =>
  z.object({
    name: z
      .string()
      .min(1, "Channel name is required")
      .max(80)
      .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed")
      .refine(
        (val) => !existingNames.includes(val),
        "Channel name already exists"
      ),
    visibility: z.enum(["public", "private"]),
  });