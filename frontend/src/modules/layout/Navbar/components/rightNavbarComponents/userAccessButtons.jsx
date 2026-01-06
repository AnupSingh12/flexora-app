import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function UserAccessButtons() {
  return (
    <>
      <Link id="login-link" to="/LogIn">
        Login
      </Link>
      <Link id="signup-link" to="/SignUp">
        Sign Up
      </Link>
    </>
  );
}
