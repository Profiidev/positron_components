<script lang="ts" generics="T, CD">
  import { createTable } from '$lib/components/table/helpers.svelte';
  import type { ColumnDef } from '@tanstack/table-core';
  import BaseTable from './base-table.svelte';

  type Props = {
    data?: T[] | Promise<T[] | undefined>;
    class?: string;
  } & (
    | {
        columns: (columnData: CD) => ColumnDef<T>[];
        columnData: CD;
      }
    | {
        columns: () => ColumnDef<T>[];
        columnData?: undefined;
      }
  );

  let { class: className, data, columns, columnData }: Props = $props();

  let rows = $state<T[]>([]);
  let isLoading = $state(true);

  $effect(() => {
    if (data instanceof Promise) {
      isLoading = true;
      data.then((d) => {
        rows = d || [];
        isLoading = false;
      });
    } else if (data) {
      rows = data;
      isLoading = false;
    }
  });

  let table = $derived(
    createTable(rows, columns(columnData as any), () => true)
  );
</script>

<BaseTable {table} filterColumn="" hideFilter {isLoading} class={className} />
