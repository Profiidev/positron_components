<script lang="ts" module>
  export interface Group<T> {
    label: string;
    items: Item<T>[];
  }

  export interface Item<T> {
    label: string;
    value: T;
  }
</script>

<script lang="ts">
  import * as Popover from '../ui/popover/index.js';
  import * as Command from '../ui/command/index.js';
  import { Button } from '../ui/button/index.js';
  import { cn } from '../../utils.js';
  import Check from 'lucide-svelte/icons/check';
  import { ScrollArea } from '../ui/scroll-area/index.js';

  type T = $$Generic;

  const isGroups = (object: any[]): object is Group<T>[] => {
    return (
      object.length > 0 &&
      typeof object[0] === 'object' &&
      object[0] !== null &&
      'items' in object[0]
    );
  };

  interface PropsBase {
    data: Group<T>[] | Item<T>[];
    filter?: (data: Item<T>) => boolean;
    label: string;
    compare?: (a: T, b: T) => boolean;
    disabled?: boolean;
  }

  let {
    data,
    filter = () => true,
    label,
    compare = (a, b) => a === b,
    disabled,
    single,
    selected = $bindable(single ? undefined : [])
  }: PropsBase &
    (
      | {
          single: true;
          selected: T | undefined;
        }
      | {
          single?: false;
          selected: T[];
        }
    ) = $props();

  let selectedInner: T[] = $state([]);

  $effect(() => {
    let newSelected;
    if (single) {
      newSelected = selected ? [selected] : [];
    } else {
      newSelected = selected;
    }

    //@ts-ignore
    if (!selectedInner.every((v, i) => compare(newSelected[i], v))) {
      //@ts-ignore
      selectedInner = newSelected;
    }
  });

  $effect(() => {
    if (single) {
      //@ts-ignore
      if (!compare(selected, selectedInner[0])) {
        selected = selectedInner[0];
      }
    } else {
      //@ts-ignore
      if (!selectedInner.every((v, i) => compare(selected[i], v))) {
        selected = selectedInner;
      }
    }
  });

  const select = (value: T) => {
    if (single) {
      selectedInner = [value];
    } else {
      let index = selectedInner.findIndex((i) => compare(i, value));
      if (index !== -1) {
        selectedInner.splice(index, 1);
      } else {
        selectedInner.push(value);
      }
    }
  };

  let filtered = $derived.by(() => {
    if (isGroups(data)) {
      return data
        .map((g) => {
          g.items = g.items.filter(filter);
          return g;
        })
        .filter((g) => g.items.length > 0);
    } else {
      return [
        {
          label: '',
          items: data.filter(filter)
        }
      ];
    }
  });

  const find_element = (value: T): Item<T> | undefined => {
    return filtered
      .map(
        (g) =>
          g.items
            .map((i) => (compare(i.value, value) ? i : undefined))
            .filter((i) => i !== undefined)[0]
      )
      .filter((i) => i !== undefined)[0];
  };
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        variant="outline"
        {...props}
        role="combobox"
        class="h-10 text-wrap opacity-100!"
        {disabled}
      >
        {#if selectedInner.length === 0}
          No {label}
        {:else}
          {selectedInner.map((s) => find_element(s)?.label).join(', ')}
        {/if}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content>
    <Command.Root>
      <Command.Input placeholder={`Search ${label.toLowerCase()}...`} />
      <ScrollArea orientation="vertical" class="h-full w-full">
        <Command.List class="overflow-visible">
          <Command.Empty>No {label} found</Command.Empty>
          {#each filtered as group}
            <Command.Group heading={group.label}>
              {#each group.items as item}
                <Command.Item
                  value={item.label}
                  onSelect={() => select(item.value)}
                >
                  <Check
                    class={cn(
                      'mr-2 size-4',
                      !selectedInner.some((i) => compare(i, item.value)) &&
                        'text-transparent'
                    )}
                  />
                  {item.label}
                </Command.Item>
              {/each}
            </Command.Group>
          {/each}
        </Command.List>
      </ScrollArea>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
