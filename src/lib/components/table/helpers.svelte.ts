import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type Table,
  type VisibilityState
} from '@tanstack/table-core';
import {
  createSvelteTable,
  renderComponent,
  renderSnippet
} from '../ui/data-table/index.js';
import { createRawSnippet } from 'svelte';
import TableHead from './table-head.svelte';

export const createColumnHeader = <T, C>(
  key: string,
  title: string
): ColumnDef<C> => {
  return {
    accessorKey: key,
    header: ({ column }) =>
      renderComponent(TableHead, {
        onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        title
      })
  };
};

export const createColumnCell = <T, C>(
  key: string,
  formatter?: (value: T) => string
): ColumnDef<C> => {
  return {
    accessorKey: key,
    cell: ({ row }) => {
      let value_raw: T = row.getValue(key);
      const valueSnippet = createRawSnippet<[T]>(() => {
        let value: string;
        if (formatter) {
          value = formatter(value_raw);
        } else {
          value = value_raw as string;
        }

        return {
          render: () =>
            `<div class="ml-4 truncate h-full w-full text-wrap">${value}</div>`
        };
      });

      return renderSnippet(valueSnippet);
    }
  };
};

export const createColumn = <T, C>(
  key: string,
  title: string,
  formatter?: (value: T) => string
): ColumnDef<C> => {
  return {
    ...createColumnHeader(key, title),
    ...createColumnCell(key, formatter)
  };
};

let columnVisibility = $state<VisibilityState>({});
let sorting = $state<SortingState>([]);
let columnFilters = $state<ColumnFiltersState>([]);

export const createTable = <C>(
  data: C[],
  columns: ColumnDef<C>[],
  filterFn: (row: Row<C>, id: string, filterValues: any) => boolean
): Table<C> => {
  return createSvelteTable({
    data,
    columns,
    defaultColumn: {
      filterFn,
      enableSorting: true
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
    },
    state: {
      get columnVisibility() {
        return columnVisibility;
      },
      get sorting() {
        return sorting;
      },
      get columnFilters() {
        return columnFilters;
      }
    }
  });
};
