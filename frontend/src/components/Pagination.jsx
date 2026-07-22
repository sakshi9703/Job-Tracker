export default function Pagination({ totalPages, currentPage, setCurrentPage }) {
  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, i) => (
          <li
            key={i}
            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </button>
          </li>
        ))}

        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
        >
          <button
            className="page-link"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
