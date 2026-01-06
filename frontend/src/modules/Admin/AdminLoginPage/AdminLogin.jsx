import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AdminLogin.css";
import ClosePng from "../../../assets/icons/close.png";
import UserPng from "../../../assets/icons/user.png";
import PadlockPng from "../../../assets/icons/padlock.png";
import EyeOpen from "../../../assets/icons/view.png";
import EyeClose from "../../../assets/icons/hide.png";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/users/login/admin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Status ${res.status}`);
      }

      navigate("/AdminDashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-body">
      <div className="login-container">
        <div className="login-branding">
          <div className="branding-content">
            <h2>Welcome Back, Admin!</h2>
            <p>
              Login to manage customers, inventory, deliveries, and more from
              your admin dashboard.
            </p>
          </div>
        </div>

        <div className="login-form">
          <Link to="/" className="close-btn" title="Close">
            <img src={ClosePng} alt="Close Button" />
          </Link>

          <h1>Admin Login</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <img className="input-icon" src={UserPng} alt="user-icon" />
              <input
                id="admin-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <img
                className="input-icon"
                src={PadlockPng}
                alt="password-icon"
              />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={showPassword ? EyeClose : EyeOpen}
                className="password-toggle-icon"
                alt={showPassword ? "Hide" : "Show"}
                onClick={() => setShowPassword((s) => !s)}
              />
            </div>

            <div className="form-options">
              <Link to="#" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              <h4>{loading ? "Signing in..." : "Login"}</h4>
            </button>
          </form>

          <div className="Admin-login">
            <Link to="/LogIn">Login As User</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
