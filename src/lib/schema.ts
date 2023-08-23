import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .nonempty("Email required")
    .email("Please enter a valid email"),
  password: z.string().nonempty("Password required"),
});
