import "./collectionsSection.css";
import { Link } from "react-router-dom";

export default function CollectionsSection() {
  return (
    <>
      <div>
        <div className="upper-section container-for-body">
          <div className="upper-body-part">
            <div className="fashion-text">
              <div>
                <h1>Awosome Collections!</h1>
                <p>
                  Discover the latest trends, bold styles, and timeless pieces —
                  all in one place.
                </p>
              </div>
              <div className="fashion-text-btn flex">
                <Link to="/Men-Section">
                  <button className="fashion-text-btn-him">For him</button>
                </Link>
                <Link to="/Women-section">
                  <button className="fashion-text-btn-her">For her</button>
                </Link>
              </div>
            </div>
            <div className="Fashion-img flex">
              <img
                src="src/assets/photos/Body/Clothes/menFashion.png"
                alt="Men's Fashion"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
