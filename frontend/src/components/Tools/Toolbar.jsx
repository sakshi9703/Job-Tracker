import { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiArrowUp,
} from "react-icons/fi";

import "./Toolbar.css";

export default function Toolbar({
  setDebouncedSearchItem,
  sortOrder,
  setSortOrder,
  status,
  setStatus,
  setCurrentPage,
}) {
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchItem(searchItem);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchItem, setDebouncedSearchItem]);

  const handleSearchChange = (e) => {
    setSearchItem(e.target.value);
    setCurrentPage(1);
  };

  const handleSelected = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container py-4">
      <div className="toolbar-card">
        {/* Search */}

        <div className="search-wrapper">
          <FiSearch className="toolbar-icon" />

          <input
            type="text"
            className="toolbar-input"
            placeholder="Search by company or role..."
            value={searchItem}
            onChange={handleSearchChange}
          />
        </div>

        {/* Controls */}

        <div className="toolbar-controls">
          <div className="select-wrapper">
            <FiArrowUp className="toolbar-icon" />

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="toolbar-select"
            >
              <option value="recent">Recently Added</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="select-wrapper">
            <FiFilter className="toolbar-icon" />

            <select
              value={status}
              onChange={handleSelected}
              className="toolbar-select"
            >
              <option value="All">All Statuses</option>
              <option value="Interested">Interested</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
