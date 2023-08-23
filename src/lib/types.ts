import { z } from "zod";

import { signinSchema } from "@/lib/schema";

export type SignInData = z.infer<typeof signinSchema>;
