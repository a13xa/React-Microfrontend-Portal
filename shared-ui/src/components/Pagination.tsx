import React, { useMemo } from 'react';
import { tokens } from '../tokens';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

function computePageRange(current: number, total: number, siblings: number): (number | 'ellipsis')[] {
  const totalPageNumbers = siblings * 2 + 5; // siblings + boundaries + current + 2 ellipses

  if (totalPageNumbers >= total) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const pages: (number | 'ellipsis')[] = [];
  pages.push(1);

  if (showLeftEllipsis) {
    pages.push('ellipsis');
  } else {
    for (let i = 2; i < leftSibling; i++) {
      pages.push(i);
    }
  }

  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== total) {
      pages.push(i);
    }
  }

  if (showRightEllipsis) {
    pages.push('ellipsis');
  } else {
    for (let i = rightSibling + 1; i < total; i++) {
      pages.push(i);
    }
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

const pageButtonStyle = (isActive: boolean): React.CSSProperties => ({
  minWidth: 32,
  height: 32,
  padding: '0 6px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: tokens.fontSize.sm,
  fontWeight: isActive ? tokens.fontWeight.medium : tokens.fontWeight.normal,
  color: isActive ? tokens.colors.accent : tokens.colors.textSecondary,
  backgroundColor: isActive ? tokens.colors.accentSubtle : 'transparent',
  border: 'none',
  borderRadius: tokens.borderRadius.md,
  cursor: isActive ? 'default' : 'pointer',
  transition: 'background-color 0.15s ease',
});

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  const pages = useMemo(
    () => computePageRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        style={{
          ...pageButtonStyle(false),
          opacity: currentPage === 1 ? 0.4 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        &#8249;
      </button>
      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            style={{
              minWidth: 32,
              height: 32,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokens.colors.textTertiary,
              fontSize: tokens.fontSize.sm,
            }}
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
            style={pageButtonStyle(page === currentPage)}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        style={{
          ...pageButtonStyle(false),
          opacity: currentPage === totalPages ? 0.4 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        &#8250;
      </button>
    </nav>
  );
};
