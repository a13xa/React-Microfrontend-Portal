import React from 'react';
import { tokens } from '../tokens';
import { Skeleton } from './Skeleton';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;
  isLoading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

function getSortIndicator(column: string, sortColumn?: string, sortDirection?: 'asc' | 'desc'): string {
  if (column !== sortColumn) return ' \u2195';
  return sortDirection === 'asc' ? ' \u2191' : ' \u2193';
}

const thStyle = (align: string): React.CSSProperties => ({
  padding: `10px ${tokens.spacing.lg}`,
  textAlign: align as React.CSSProperties['textAlign'],
  fontSize: tokens.fontSize.xs,
  fontWeight: tokens.fontWeight.medium,
  color: tokens.colors.textTertiary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  whiteSpace: 'nowrap',
  borderBottom: `1px solid ${tokens.colors.border}`,
  backgroundColor: tokens.colors.surfaceRaised,
});

const tdStyle = (align: string): React.CSSProperties => ({
  padding: `12px ${tokens.spacing.lg}`,
  textAlign: align as React.CSSProperties['textAlign'],
  fontSize: tokens.fontSize.sm,
  color: tokens.colors.text,
  lineHeight: 1.5,
});

const TableRowMemo = React.memo(function TableRow<T>({
  item,
  columns,
  index,
  onRowClick,
}: {
  item: T;
  columns: Column<T>[];
  index: number;
  onRowClick?: (item: T) => void;
}) {
  return (
    <tr
      onClick={onRowClick ? () => onRowClick(item) : undefined}
      style={{
        backgroundColor: index % 2 === 1 ? tokens.colors.surfaceRaised : tokens.colors.surface,
        cursor: onRowClick ? 'pointer' : 'default',
        borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
      }}
    >
      {columns.map((col) => (
        <td key={col.key} style={tdStyle(col.align || 'left')}>
          {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
        </td>
      ))}
    </tr>
  );
}) as <T>(props: {
  item: T;
  columns: Column<T>[];
  index: number;
  onRowClick?: (item: T) => void;
}) => React.ReactElement;

export function Table<T>({
  columns,
  data,
  keyExtractor,
  sortColumn,
  sortDirection,
  onSort,
  isLoading = false,
  loadingRows = 5,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>): React.ReactElement {
  return (
    <div
      style={{
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: tokens.colors.surface,
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            borderSpacing: 0,
          }}
          aria-label="Data table"
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    ...thStyle(col.align || 'left'),
                    width: col.width,
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: col.sortable ? 'none' : 'auto',
                  }}
                  onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                  onKeyDown={
                    col.sortable && onSort
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSort(col.key);
                          }
                        }
                      : undefined
                  }
                  tabIndex={col.sortable ? 0 : undefined}
                  aria-sort={
                    col.sortable && col.key === sortColumn
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : col.sortable
                        ? 'none'
                        : undefined
                  }
                  role={col.sortable ? 'columnheader' : undefined}
                >
                  {col.header}
                  {col.sortable && (
                    <span style={{ color: col.key === sortColumn ? tokens.colors.accent : tokens.colors.textTertiary }}>
                      {getSortIndicator(col.key, sortColumn, sortDirection)}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: loadingRows }, (_, i) => (
                <tr key={`skeleton-${i}`} style={{ backgroundColor: i % 2 === 1 ? tokens.colors.surfaceRaised : tokens.colors.surface }}>
                  {columns.map((col) => (
                    <td key={col.key} style={tdStyle(col.align || 'left')}>
                      <Skeleton width={col.align === 'right' ? '60px' : '80%'} />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: tokens.spacing.xxl,
                    textAlign: 'center',
                    color: tokens.colors.textTertiary,
                    fontSize: tokens.fontSize.md,
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
            {!isLoading &&
              data.map((item, index) => (
                <TableRowMemo
                  key={keyExtractor(item)}
                  item={item}
                  columns={columns}
                  index={index}
                  onRowClick={onRowClick}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
