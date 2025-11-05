<script lang="ts" generics="S extends FormRecord = FormRecord">
  import type { FormRecord, SuperForm, FormPath } from '$lib/components/form';
  import { Input, Label } from '$lib/components/ui';
  import type { Snippet } from 'svelte';

  interface Props {
    formData: SuperForm<S>;
    key: FormPath<S>;
    id: string;
    value: any;
    children: Snippet;
  }

  const { formData: form, key, id, value, children }: Props = $props();

  let formData = $derived(form.form);
</script>

{#if $formData[key]}
  <Label for={id} class="flex">
    {@render children()}
  </Label>
  <Input {id} {value} readonly />
{/if}
