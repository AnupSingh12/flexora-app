import "./typeFilter.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleType } from "../../../../../store/slices/productSlice.js";

export default function TypeFilter() {
  const dispatch = useDispatch();

  const { allProducts, selectedTypes } = useSelector((state) => state.products);

  const uniqueTypes = [...new Set(allProducts.map((p) => p.productType))];
  return (
    <>
      <div className="type">
        <h4>Type</h4>
        <ul className="ul-type">
          {uniqueTypes.map((productType) => (
            <li key={productType} className="list">
              <input
                className="type-checkbox"
                type="checkbox"
                value={productType}
                checked={selectedTypes.includes(productType)}
                onChange={() => dispatch(toggleType(productType))}
              />
              <label htmlFor="TrekShoes">{productType}</label>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
