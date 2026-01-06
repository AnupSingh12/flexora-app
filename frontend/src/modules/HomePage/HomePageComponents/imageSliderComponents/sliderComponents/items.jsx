import { Link } from "react-router-dom";
import "./items.css"

export default function Item({ isActive, imgSrc, category, description, menPage, womenPage }) {
    return(
        <div className={`item ${isActive ? 'active' : ''}`}>
          <img
            src={imgSrc}
            alt="clothes"
          />
          <div className="content">
            <div className="category">{category}</div>
            <div className="description">
              {description}
            </div>
            <div className="buttons">
              <Link to={menPage}>
                <button>For him</button>
              </Link>
              <Link to={womenPage}>
                <button>For her</button>
              </Link>
            </div>
          </div>
        </div>
    )
}