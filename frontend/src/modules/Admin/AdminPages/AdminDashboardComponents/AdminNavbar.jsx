import { useEffect } from "react";
import "./AdminNavbar.css";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  async function logout() {
    try {
      await fetch("http://localhost:3000/users/logout", {
        method: "POST",
        credentials: "include",
      });
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      console.log("Unable to get data from the API for admin logout ");
    }
  }
  useEffect(() => {
    const navbarToggle = document.getElementById("navbar-toggle");
    const profileLogin = document.getElementById("profile-login");
    const logoutBtn = document.getElementById("logout-btn");

    // Toggle sidebar
    if (navbarToggle) {
      navbarToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const sidebar = document.getElementById("adb-sidebar");
        if (sidebar) {
          sidebar.classList.toggle("adb-sidebar-collapsed");
        }
      });
    }

    // Toggle profile dropdown
    if (profileLogin) {
      profileLogin.addEventListener("click", (e) => {
        e.stopPropagation();
        profileLogin.classList.toggle("active");
      });
    }

    // Attach native listener to logout button so it fires even when other native listeners call stopPropagation
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }

    // Close dropdown when clicking outside
    const closeDropdown = (e) => {
      if (profileLogin && !profileLogin.contains(e.target)) {
        profileLogin.classList.remove("active");
      }
    };

    document.addEventListener("click", closeDropdown);

    return () => {
      document.removeEventListener("click", closeDropdown);
      if (logoutBtn) {
        logoutBtn.removeEventListener("click", logout);
      }
    };
  }, []);

  return (
    <>
      <nav className="an-header">
        <div className="an-navbar">
          <div className="an-left">
            <button
              id="navbar-toggle"
              className="an-toggle-btn"
              aria-label="Toggle sidebar"
            >
              <i className="fas fa-bars"></i>
            </button>

            <Link to="/AdminDashboard" className="an-brand">
              Flexora
            </Link>
          </div>

          <div className="an-right">
            <div className="an-search-box-div">
              <input
                id="an-search-box"
                type="search"
                placeholder="Search anything..."
              />
            </div>

            <div id="profile-login" className="an-profile-sec">
              <div className="an-profile-icon">
                <img src="https://i.pravatar.cc/40?u=admin" alt="admin" />
              </div>

              <div className="an-profile-name">Admin</div>

              <div className="an-profile-dropdown">
                <div className="an-dropdown-header">
                  <h4>Admin</h4>
                  <small className="an-text-muted">admin@flexora.com</small>
                </div>

                <div className="an-dropdown-body">
                  <p id="profile-btn">
                    <i className="fas fa-user-circle"></i> Profile
                  </p>

                  <div onClick={logout}>
                    <p id="logout-btn" className="an-logout-btn">
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
