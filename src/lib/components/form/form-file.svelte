<script lang="ts" generics="S extends FormRecord = FormRecord">
  import * as Form from '../ui/form/index.js';
  import {
    fileProxy,
    type FormPathLeaves,
    type SuperForm
  } from 'sveltekit-superforms';
  import { Input } from '../ui/input/index.js';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';
  import type { FormRecord } from './types.js';

  type InputProps = WithElementRef<Omit<HTMLInputAttributes, 'type'>>;

  interface Props {
    formData: SuperForm<S>;
    key: FormPathLeaves<S, File>;
    label: string;
    disabled?: boolean;
  }

  let {
    formData: form,
    key,
    label,
    disabled,
    ...restProps
  }: InputProps & Props = $props();

  let file = fileProxy(form, key);
  let value = $state();
</script>

<Form.Field {form} name={key} class="gap-1/2 grid">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>{label}</Form.Label>
      <Input
        {disabled}
        {...props}
        {...restProps}
        type="file"
        bind:value
        bind:files={$file}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
