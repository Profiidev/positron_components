<script lang="ts">
  import { cn } from '../../../blocks/utils.js';
  import { fieldSetVariants } from '$lib/components/ui-extra/field-set';
  import type { FieldSetRootProps } from '$lib/components/ui-extra/field-set/types';

  let {
    ref = $bindable(null),
    variant = 'default',
    children,
    class: className,
    ...rest
  }: FieldSetRootProps = $props();
</script>

<div
  bind:this={ref}
  class={cn(fieldSetVariants({ variant }), className)}
  {...rest}
>
  {@render children?.()}
</div>
