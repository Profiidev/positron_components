import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type Table,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel
} from '@tanstack/table-core';
import {
  createSvelteTable,
  renderComponent,
  renderSnippet
} from '../ui/data-table/index.js';
import { createRawSnippet } from 'svelte';
import TableHead from './table-head.svelte';

export const createColumnHeader = <C>(
  key: string,
  title: string
): ColumnDef<C> => ({
  accessorKey: key,
  header: ({ column }) =>
    renderComponent(TableHead, {
      onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      title
    })
});

// oxlint-disable-next-line no-unnecessary-type-parameters
export const createColumnCell = <T, C>(
  key: string,
  formatter?: (value: T) => string
): ColumnDef<C> => ({
  accessorKey: key,
  cell: ({ row }) => {
    const value_raw: T = row.getValue(key);
    const valueSnippet = createRawSnippet<[T]>(() => {
      let value = '';
      if (formatter) {
        value = formatter(value_raw);
      } else {
        // oxlint-disable-next-line no-unsafe-type-assertion
        value = value_raw as string;
      }

      return {
        render: () =>
          `<div class="ml-4 truncate h-full w-full text-wrap">${value}</div>`
      };
    });

    return renderSnippet(valueSnippet);
  }
});

// oxlint-disable-next-line no-unnecessary-type-parameters
export const createColumn = <T, C>(
  key: string,
  title: string,
  formatter?: (value: T) => string
): ColumnDef<C> => ({
  ...createColumnHeader(key, title),
  ...createColumnCell(key, formatter)
});

let columnVisibility = $state<VisibilityState>({});
let sorting = $state<SortingState>([]);
let columnFilters = $state<ColumnFiltersState>([]);

export const createTable = <C>(
  data: C[],
  columns: ColumnDef<C>[],
  filterFn: (row: Row<C>, id: string, filterValues: any) => boolean
): Table<C> =>
  createSvelteTable({
    columns,
    data,
    defaultColumn: {
      enableSorting: true,
      filterFn
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
    },
    onColumnVisibilityChange: (updater) => {
      if (typeof updater === 'function') {
        columnVisibility = updater(columnVisibility);
      } else {
        columnVisibility = updater;
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
    state: {
      get columnFilters() {
        return columnFilters;
      },
      get columnVisibility() {
        return columnVisibility;
      },
      get sorting() {
        return sorting;
      }
    }
  });
