import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
}) => {
  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 0.25rem 0.5rem',
        borderTop: '1px solid #e2e8f0',
        marginTop: '1.25rem',
        fontSize: '0.85rem',
        color: '#64748b',
      }}
    >
      {/* Range and page size */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span>
          Showing <strong style={{ color: '#0f172a' }}>{startItem}</strong> to{' '}
          <strong style={{ color: '#0f172a' }}>{endItem}</strong> of{' '}
          <strong style={{ color: '#0f172a' }}>{totalItems}</strong> records
        </span>

        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.775rem' }}>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.8rem',
                color: '#1e293b',
                cursor: 'pointer',
              }}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {/* Prev */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous Page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: currentPage <= 1 ? '#f8fafc' : '#ffffff',
              color: currentPage <= 1 ? '#cbd5e1' : '#334155',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  style={{ padding: '0 4px', color: '#94a3b8', userSelect: 'none' }}
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => onPageChange(page)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  padding: '0 6px',
                  borderRadius: '6px',
                  border: isActive ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  background: isActive ? '#0284c7' : '#ffffff',
                  color: isActive ? '#ffffff' : '#334155',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {page}
              </button>
            );
          })}

          {/* Next */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next Page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: currentPage >= totalPages ? '#f8fafc' : '#ffffff',
              color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
