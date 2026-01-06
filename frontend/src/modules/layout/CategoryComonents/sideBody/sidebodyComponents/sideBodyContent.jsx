import "./sideBodyContent.css";
import SideBodyContentCards from "./sideBodyContentCards/sideBodyContentCards";

export default function SideBodyContent() {
  return (
    <>
      <div className="side-body-content">
        <div className="container-for-side-body">
          <ul
            id="product-list"
            className="side-body-content-cards products grid"
          >
            <SideBodyContentCards />
          </ul>
        </div>
      </div>
    </>
  );
}
