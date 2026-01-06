import BrandFilter from "./sidebarComponents/brandFilter.jsx";
import RangeBar from "./sidebarComponents/rangeBar.jsx";
import ColorFilter from "./sidebarComponents/colorFilter.jsx";
import TypeFilter from "./sidebarComponents/typeFilter.jsx";
import "./sidebar.css";

export default function Sidebar() {
  return (
    <>
      <div id="sidebar" className="sidebar">
        <BrandFilter />
        <hr style={{ width: "100%" }} />
        <RangeBar />
        <hr style={{ width: "100%" }} />
        <ColorFilter />
        <hr style={{ width: "100%" }} />
        <TypeFilter />
      </div>
    </>
  );
}
