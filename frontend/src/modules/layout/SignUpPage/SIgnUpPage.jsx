import "./SignUpPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { saveUserFromResponse } from "../../../utils/userStorage.js";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Simple email validation regex
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // --- 1. Validation ---
    if (!email || !password || !confirmPassword) {
      setMessage("All fields are required.");
      setMessageColor("red");
      return;
    }
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      setMessageColor("red");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setMessageColor("red");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageColor("red");
      return;
    }

    // --- 2. Send to backend ---
    try {
      const newUser = {
        userEmail: email,
        password: password,
      };

      const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        data = { message: text };
      }

      if (!res.ok) {
        setMessage(data?.message || "Failed to create user.");
        setMessageColor("red");
        return;
      }
      saveUserFromResponse(data || null);

      setMessage("Sign up successful! Redirecting to User data...");
      setMessageColor("green");
      setTimeout(() => navigate("/UserData"), 1200);
    } catch (err) {
      console.log("Server Error", err.message);
    }
  };

  return (
    <>
      <div className="signup-body">
        <div className="signup-container">
          <div className="signup-branding">
            <div className="branding-content">
              <h2>Create Account</h2>
              <p>
                Join our community! Sign up to get started and unlock all the
                features.
              </p>
            </div>
          </div>

          <div className="signup-form">
            <Link to="/" className="signup-close-btn" title="Close">
              <img src="src/assets/icons/close.png" alt="Close Button" />
            </Link>

            <h1>Sign Up</h1>

            <div className="signup-input-group">
              <img
                className="signup-input-icon"
                src="src/assets/icons/user.png"
                alt="user-icon"
              />
              <input
                id="user-email"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="signup-input-group">
              <img
                className="signup-input-icon"
                src="src/assets/icons/padlock.png"
                alt="password-icon"
              />
              <input
                id="user-password"
                type={showPassword ? "text" : "password"} // Controlled by state
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="signup-password-toggle">
                {/* Correct toggle logic */}
                {showPassword ? (
                  <img
                    className="signup-password-icon-hide"
                    src="src/assets/icons/hide.png"
                    alt="hide icon"
                    title="Hide Password"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <img
                    className="signup-password-icon-view"
                    src="src/assets/icons/view.png"
                    alt="View icon"
                    title="Show Password"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            </div>

            <div className="signup-input-group">
              <img
                className="signup-input-icon"
                src="src/assets/icons/padlock.png"
                alt="password-icon"
              />
              <input
                id="user-password-verify"
                type={showPassword ? "text" : "password"} // Controlled by state
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Correct message display */}
            <p
              id="message"
              className="signup-error-message"
              style={{ color: messageColor }}
            >
              {message}
            </p>

            <button
              onClick={handleSubmitForm}
              id="sign-up-btn"
              className="signup-submit-btn"
            >
              <h4>Sign Up</h4>
            </button>

            <div className="signup-divider">
              <span>Or sign up with</span>
            </div>

            <div className="signup-social-login">
              <Link to="#">
                <img
                  className="signup-social-icon"
                  src="src/assets/icons/gmail.png"
                  alt="Gmail Icon"
                />
              </Link>
              <Link to="#">
                <img
                  className="signup-social-icon"
                  src="src/assets/icons/facebook.png"
                  alt="Facebook icon"
                />
              </Link>
              <Link to="#">
                <img
                  className="signup-social-icon"
                  src="src/assets/icons/twitter.png"
                  alt="Twitter icon"
                />
              </Link>
            </div>

            <div className="signup-login-prompt">
              <p>Already have an account?</p>
              <Link to="/LogIn" className="signup-login-btn">
                LOG IN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
