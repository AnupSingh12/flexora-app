import "./colorFilter.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleColor } from "../../../../../store/slices/productSlice.js";

export default function ColorFilter() {
  const dispatch = useDispatch();

  const { allProducts, selectedColors } = useSelector(
    (state) => state.products
  );

  const uniqueColors = [...new Set(allProducts.map((p) => p.color))];
  return (
    <>
      <div className="color-bar">
        <h4>Color</h4>
        <ul className="ul-color">
          {uniqueColors.map((color) => (
            <li key={color} className="list">
              <input
                id={`color-${color}`}
                type="checkbox"
                checked={selectedColors.includes(color)}
                onChange={() => dispatch(toggleColor(color))}
              />

              <label htmlFor={`color-${color}`}>
                <span
                  className="color"
                  style={{ backgroundColor: color }}
                ></span>
                {color}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
