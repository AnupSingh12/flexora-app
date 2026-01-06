import LeftNavbar from "./components/leftNavbar.jsx";
import CenterNavbar from "./components/centerNavbar.jsx";
import RightNavbar from "./components/rightNavbar.jsx";
import "./navbar.css";

export default function Navbar() {
  return (
    <>
      <nav className="navbar-body">
        <LeftNavbar />
        <CenterNavbar />
        <RightNavbar />
      </nav>
    </>
  );
}
