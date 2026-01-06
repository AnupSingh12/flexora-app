import "./leftNavbar.css"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


export default function LeftNavbar() {
  return (
    <>
      <div className="nav-left">
        <h1 >
            <Link className="brand" to="/">
            Flexora
          </Link>
        </h1>
      </div>
    </>
  );
}
