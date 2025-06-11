import type { SuperValidated } from 'sveltekit-superforms';
import type { ZodValidation } from 'sveltekit-superforms/adapters';
import type { ZodType } from 'zod';

export type FormRecord = Record<string, unknown>;

export interface FormSchema<
  Z extends ZodValidation | ZodType,
  T extends FormRecord = FormRecord,
  In extends FormRecord = T
> {
  schema: Z;
  form: SuperValidated<T, any, In> | T;
}

export interface Error {
  field?: string;
  error: string;
}
