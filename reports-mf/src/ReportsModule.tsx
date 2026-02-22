import React, { useState, useCallback } from 'react';
import { Button, Input, Badge, Table, Pagination, Modal, tokens } from '@portal/shared-ui';
import type { Column } from '@portal/shared-ui';
import { useReports } from './useReports';
import { useDebounce } from './hooks/useDebounce';
import { formatDate, formatNumber, getStatusLabel } from './utils/formatters';
import { Report } from './types';

function getUserRole(): string {
  try {
    const stored = localStorage.getItem('portal_auth');
    if (!stored) return 'viewer';
    const parsed = JSON.parse(stored) as { user: { role: string } };
    return parsed.user.role;
  } catch {
    return 'viewer';
  }
}

const statusFilters = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'failed', label: 'Failed' },
];

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  in_progress: 'warning',
  failed: 'danger',
};

const ReportsModule: React.FC = () => {
  const {
    reports, isLoading, error, refetch,
    page, totalPages, total,
    sortBy, sortDirection, statusFilter,
    setPage, toggleSort, setSearch, setStatusFilter,
    deleteReport,
  } = useReports();

  const role = getUserRole();
  const isAdmin = role === 'admin';

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteReport(deleteTarget.id);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteReport]);

  const columns: Column<Report>[] = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (r) => (
        <span style={{ fontWeight: tokens.fontWeight.medium, color: tokens.colors.text }}>{r.title}</span>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      sortable: true,
      render: (r) => <span style={{ color: tokens.colors.textSecondary }}>{r.author}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge variant={statusBadgeVariant[r.status]}>{getStatusLabel(r.status)}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (r) => <span style={{ color: tokens.colors.textSecondary }}>{formatDate(r.createdAt)}</span>,
    },
    {
      key: 'views',
      header: 'Views',
      sortable: true,
      align: 'right',
      render: (r) => <span style={{ color: tokens.colors.textSecondary }}>{formatNumber(r.metrics.views)}</span>,
    },
    {
      key: 'downloads',
      header: 'Downloads',
      sortable: true,
      align: 'right',
      render: (r) => <span style={{ color: tokens.colors.textSecondary }}>{formatNumber(r.metrics.downloads)}</span>,
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: '',
            width: '80px',
            align: 'right' as const,
            render: (r: Report) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setDeleteTarget(r);
                }}
                style={{ color: tokens.colors.danger }}
              >
                Delete
              </Button>
            ),
          },
        ]
      : []),
  ];

  if (error) {
    return (
      <div>
        <div role="alert" style={{ color: tokens.colors.danger, fontSize: tokens.fontSize.md, marginBottom: tokens.spacing.md }}>
          {error}
        </div>
        <Button variant="secondary" size="sm" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.spacing.xl }}>
        <h2 style={{ fontSize: tokens.fontSize.xl, fontWeight: tokens.fontWeight.semibold, color: tokens.colors.text, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          Reports
          <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textTertiary, fontWeight: tokens.fontWeight.normal, marginLeft: '10px' }}>
            {total} total
          </span>
        </h2>
        {isAdmin && (
          <Button variant="secondary" size="sm" onClick={() => alert('Exported reports as CSV')}>
            Export CSV
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', gap: tokens.spacing.md, marginBottom: tokens.spacing.md, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px', maxWidth: '320px' }}>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search reports..."
            fullWidth
          />
        </div>
        <div style={{ display: 'flex', gap: tokens.spacing.xs, flexWrap: 'wrap' }}>
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              style={{
                padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                fontSize: tokens.fontSize.xs,
                fontWeight: statusFilter === f.key ? tokens.fontWeight.medium : tokens.fontWeight.normal,
                color: statusFilter === f.key ? tokens.colors.accent : tokens.colors.textSecondary,
                backgroundColor: statusFilter === f.key ? tokens.colors.accentSubtle : 'transparent',
                border: `1px solid ${statusFilter === f.key ? tokens.colors.accent : tokens.colors.border}`,
                borderRadius: tokens.borderRadius.full,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Table<Report>
        columns={columns}
        data={reports}
        keyExtractor={(r) => r.id}
        sortColumn={sortBy}
        sortDirection={sortDirection}
        onSort={toggleSort}
        isLoading={isLoading}
        emptyMessage="No reports match your search"
      />

      {totalPages > 1 && (
        <div style={{ marginTop: tokens.spacing.lg, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Report"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Delete
            </Button>
          </>
        }
      >
        <p style={{ color: tokens.colors.textSecondary, fontSize: tokens.fontSize.md, margin: 0, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ReportsModule;
