import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiLogOut, FiUser } from "react-icons/fi";

import "./Navbar.css";

export default function Navbar({ removeCookie, navigate }) {
  const location = useLocation();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      color: "#0f172a",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      customClass: {
        popup: "logout-popup",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        { withCredentials: true }
      );

      removeCookie("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      Swal.fire({
        title: "Logout failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#166534",
      });
    }
  };

  const isProfileActive = location.pathname === "/profile";

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-mark">J</span>

          <span className="brand-text">
            Job<span> Tracker</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="navbar-actions">

          <Link
            to="/profile"
            className={`navbar-profile ${
              isProfileActive ? "active" : ""
            }`}
          >
            <FiUser />
            <span>Profile</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="navbar-logout"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>

        </div>
      </div>
    </nav>
  );
}