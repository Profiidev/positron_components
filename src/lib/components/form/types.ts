import type { ZodValidationSchema } from 'sveltekit-superforms/adapters';
import type { z } from 'zod/v4';

export type { SuperForm, FormPath } from 'sveltekit-superforms';
export type { ZodValidationSchema };

export type FormRecord = Record<string, unknown>;

export type FormValue<V extends ZodValidationSchema> = z.infer<V>;

export interface Error {
  field?: string;
  error: string;
}
