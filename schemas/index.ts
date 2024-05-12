import * as z from 'zod';

export const LoginSchema = z.object({
  phone: z.string().min(1),
});
