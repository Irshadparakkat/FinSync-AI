import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { PaginationMeta } from '@/types/api.types';
import { APP } from '@/constants/app.constants';

interface DataTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  /** Backend pagination meta - drives the pager. Omit for client-side data. */
  meta?: PaginationMeta;
  onPageChange?: (page: number, pageSize: number) => void;
}

/**
 * Reusable table wrapper: wires the backend's PaginationMeta into antd's
 * pager and keeps wide tables scrollable inside their card (responsive).
 */
export function DataTable<T extends object>({ meta, onPageChange, ...rest }: DataTableProps<T>) {
  return (
    <Table<T>
      scroll={{ x: 'max-content' }}
      pagination={
        meta
          ? {
              current: meta.page,
              pageSize: meta.limit,
              total: meta.totalItems,
              showSizeChanger: true,
              pageSizeOptions: [10, APP.DEFAULT_PAGE_SIZE, 50, APP.MAX_PAGE_SIZE],
              showTotal: (total) => `${total} total`,
              onChange: onPageChange,
            }
          : false
      }
      {...rest}
    />
  );
}
