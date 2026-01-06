import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../AdminLoginPage/AdminLogin.css";
import ClosePng from "../../../assets/icons/close.png";
import UserPng from "../../../assets/icons/user.png";
import PadlockPng from "../../../assets/icons/padlock.png";
import EyeOpen from "../../../assets/icons/view.png";
import EyeClose from "../../../assets/icons/hide.png";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const res = await fetch("http://localhost:3000/users/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, userName: name }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Status ${res.status}`);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setTimeout(() => navigate("/AdminDashboard"), 1000);
    } catch (err) {
      console.log(err);
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-body">
      <div className="login-container">
        <div className="login-branding">
          <div className="branding-content">
            <h2>Create Admin Account</h2>
            <p>Create an administrator account to manage the site.</p>
          </div>
        </div>

        <div className="login-form">
          <Link to="/" className="close-btn" title="Close">
            <img src={ClosePng} alt="Close Button" />
          </Link>

          <h1>Admin Sign Up</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <img className="input-icon" src={UserPng} alt="user-icon" />
              <input
                id="admin-name"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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

            <div className="input-group">
              <img
                className="input-icon"
                src={PadlockPng}
                alt="password-icon"
              />
              <input
                id="admin-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <img
                src={showConfirmPassword ? EyeClose : EyeOpen}
                className="password-toggle-icon"
                alt={showConfirmPassword ? "Hide" : "Show"}
                onClick={() => setShowConfirmPassword((s) => !s)}
              />
            </div>

            <div className="form-options"></div>

            {error && <p className="error-message">{error}</p>}
            {success && (
              <p className="adb-modal-message adb-modal-message-success">
                Admin account created
              </p>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              <h4>{loading ? "Creating..." : "Create Admin"}</h4>
            </button>
          </form>

          <div className="Admin-login">
            <Link to="/AdminLogin">Back to Admin Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
