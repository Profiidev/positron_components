<script lang="ts" generics="V extends ZodValidationSchema">
  import type { Snippet } from 'svelte';
  import { get } from 'svelte/store';
  import {
    defaults,
    setError,
    superForm,
    type SuperForm
  } from 'sveltekit-superforms';
  import {
    zod4,
    type ValidationAdapter,
    type ZodValidationSchema
  } from 'sveltekit-superforms/adapters';
  import { FormButton } from '../ui/form/index.js';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import type { ButtonVariant } from '../ui/button/index.js';
  import { cn } from '../../utils.js';
  import type { Error, FormValue } from './types.js';

  interface Props {
    schema: V;
    onsubmit: (
      form: FormValue<V>
    ) => Error | undefined | void | Promise<Error | undefined | void>;
    children?: Snippet<
      [{ props: { formData: SuperForm<FormValue<V>>; disabled: boolean } }]
    >;
    footer?: Snippet<
      [
        {
          defaultBtn: Snippet<
            [{ className?: string; variant?: ButtonVariant; content: string }?]
          >;
          isLoading: boolean;
        }
      ]
    >;
    isLoading?: boolean;
    error?: string;
    class?: string;
  }

  let {
    schema,
    onsubmit,
    children,
    footer = defaultFooter,
    isLoading = $bindable(false),
    error = $bindable(''),
    class: className
  }: Props = $props();

  let form = superForm(
    defaults(zod4(schema) as ValidationAdapter<FormValue<V>, FormValue<V>>),
    {
      validators: zod4(schema),
      SPA: true,
      onUpdate: async ({ form, cancel }) => {
        if (!form.valid) return;

        error = '';
        isLoading = true;

        let ret = await onsubmit(form.data);

        isLoading = false;
        if (ret) {
          if (ret.field) {
            setError(form, ret.field as '', ret.error, undefined);
          } else {
            if (ret.error !== '') error = ret.error;
            cancel();
          }
        }
      }
    }
  );

  let { enhance } = form;

  export const setValue = (value: FormValue<V>) => {
    let old = get(form.form);

    //@ts-ignore
    let newValue: FormValue<V> = {};
    for (const key in old) {
      newValue[key] = value[key] ?? old[key];
    }

    form.form.set(newValue);
  };

  export const getValue = () => {
    return get(form.form);
  };
</script>

<form method="POST" class={cn('grid gap-3', className)} use:enhance>
  {@render children?.({ props: { formData: form, disabled: isLoading } })}
  {#if error}
    <span class="text-destructive truncate text-sm">{error}</span>
  {/if}
  {@render footer({ defaultBtn: formButton, isLoading })}
</form>

{#snippet defaultFooter({ defaultBtn }: { defaultBtn: Snippet })}
  {@render defaultBtn()}
{/snippet}

{#snippet formButton(
  props:
    | { className?: string; variant?: ButtonVariant; content: string }
    | undefined
)}
  {@const prop = { ...props }}
  <FormButton
    class={prop.className}
    type="submit"
    disabled={isLoading}
    variant={prop.variant}
  >
    {#if isLoading}
      <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
    {/if}
    {prop.content}
  </FormButton>
{/snippet}
