import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css"
import Swal from "sweetalert2";
import "../App.css";
export default function Navbar({ removeCookie, navigate }) {
  const handleLogout = async () => {
    const result = await Swal.fire({
          title: "Logout?",
          text: "Are you Sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Logout",
          cancelButtonText: "Cancel",
          background: "#334155",
          color: "#f8fafc",
          confirmButtonColor: "#ef4444",
          cancelButtonColor: "#64748b",
        });
    
        if (!result.isConfirmed) return;

    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        { withCredentials: true }
      );

      removeCookie("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar sticky-top shadow-sm py-3">
      <div className="container">
        <Link
          to="/"
          className="navbar-brand fw-bold fs-2 text-decoration-none text-light"
        >
          JobTracker
        </Link>

        <div className="d-flex align-items-center gap-3 fs-5">
          <Link
            to="/profile"
            className="text-light text-decoration-none fw-medium"
          >
            My Profile
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-outline-light btn-sm fs-5 border-0"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}