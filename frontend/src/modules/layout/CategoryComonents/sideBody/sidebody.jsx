import Sortbar from "./sidebodyComponents/sortBar.jsx";
import SideBodyContent from "./sidebodyComponents/sideBodyContent.jsx";
import BreadCrums from "./sidebodyComponents/breadCrums.jsx";

export default function Sidebody(props) {
  return (
    <>
      <div className="side-body">
        <div className={`side-body-heading ${props.addedClass} `}></div>
        <div className="filter-bar">
          <BreadCrums />
          <Sortbar />
        </div>

        <SideBodyContent />
      </div>
    </>
  );
}
