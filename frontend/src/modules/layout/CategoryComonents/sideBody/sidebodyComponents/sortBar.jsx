import "./sortBar.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleSortedProducts } from "../../../../../store/slices/productSlice.js";

export default function Sortbar() {
  const dispatch = useDispatch();

  const sortType = useSelector((state) => state.products.sortType);

  const handleSortChange = (e) => {
    dispatch(toggleSortedProducts(e.target.value));
  };

  return (
    <div className="sort-bar">
      <label htmlFor="selection">Sort by:</label>

      <div className="custom-select-wrapper">
        <select id="selection" value={sortType} onChange={handleSortChange}>
          <option value="Recommended">Recommended</option>
          <option value="Popularity">Popularity</option>
          <option value="Discount">Discount</option>
          <option value="Expensive">Price high-low</option>
          <option value="Cheap">Price low-high</option>
        </select>
      </div>
    </div>
  );
}
