import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Pagination.css";

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-button pagination-prev"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <FiChevronLeft />
          <span>Previous</span>
        </button>

        <div className="pagination-pages">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`pagination-number ${
                currentPage === i + 1 ? "active" : ""
              }`}
              onClick={() => onPageChange(i + 1)}
              aria-current={currentPage === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="pagination-button pagination-next"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <span>Next</span>
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}