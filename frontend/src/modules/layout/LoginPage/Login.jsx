import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userInfo = { email: email, password: password };
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userInfo),
      });
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        data = { message: text };
      }

      if (res.ok) {
        setMessage("LogIn successfully ⭐");
        setMessageColor("green");
        setTimeout(() => navigate("/"), 1200);
      } else {
        if (res.status === 403) {
          setMessage("This account is on hold");
          setMessageColor("red");
        } else if (res.status === 404) {
          setMessage("Invalid user ID");
          setMessageColor("red");
        } else if (res.status === 406) {
          setMessage("This page is for users ⭐");
          setMessageColor("red");
        } else if (res.status === 401) {
          setMessage("Wrong Password");
          setMessageColor("red");
        }
      }
    } catch (err) {
      console.log("Server Error", err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="login-body">
        <div className="login-container">
          <div className="login-branding">
            <div className="branding-content">
              <h2>Welcome Back!</h2>
              <p>
                Login to access your personalized dashboard and continue your
                journey with us.
              </p>
            </div>
          </div>

          <div className="login-form">
            <Link to="/" className="close-btn" title="Close">
              <img src="src/assets/icons/close.png" alt="Close Button" />
            </Link>

            <h1>Login</h1>

            <div className="input-group">
              <img
                className="input-icon"
                src="src/assets/icons/user.png"
                alt="user-icon"
              />
              <input
                id="user-email"
                type="text"
                placeholder="UserEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <img
                className="input-icon"
                src="src/assets/icons/padlock.png"
                alt="password-icon"
              />
              {/* Bind password input to state:
              - type is dynamic based on 'showPassword' state
            */}
              <input
                id="user-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="password-toggle">
                {/* Use a single onClick to toggle state */}
                {showPassword ? (
                  <img
                    className="password-icon-hide" /* <-- Class name changed */
                    src="src/assets/icons/hide.png"
                    alt="hide icon"
                    title="Hide Password"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <img
                    className="password-icon-view" /* <-- Class name changed */
                    src="src/assets/icons/view.png"
                    alt="View icon"
                    title="Show Password"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            </div>

            <div className="form-options">
              <Link to="#" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            {/* Display message from state */}
            <p
              id="message"
              className="error-message"
              style={{ color: messageColor }}
            >
              {message}
            </p>

            {/* Use onClick to call your event handler */}
            <button
              id="loginButton"
              className="login-btn"
              onClick={handleLogin}
            >
              <h4>Login</h4>
            </button>

            <div className="Admin-login">
              <Link to="/AdminLogin">Login As Admin</Link>
            </div>

            {/* ... (rest of your JSX is fine) ... */}
            <div className="divider">
              <span>Or continue with</span>
            </div>
            <div className="social-login">
              <Link to="#">
                <img
                  className="social-icon"
                  src="src/assets/icons/gmail.png"
                  alt="Gmail Icon"
                />
              </Link>
              <Link to="#">
                <img
                  className="social-icon"
                  src="src/assets/icons/facebook.png"
                  alt="Facebook icon"
                />
              </Link>
              <Link to="#">
                <img
                  className="social-icon"
                  src="src/assets/icons/twitter.png"
                  alt="Twitter icon"
                />
              </Link>
            </div>

            <div className="signup-prompt">
              <p>Don't have an account?</p>
              <Link to="/SignUp" className="signup-btn">
                SIGN UP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
