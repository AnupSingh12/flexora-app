import { useDispatch, useSelector } from "react-redux";
import { toggleBrand } from "../../../../../store/slices/productSlice.js";
import "./brandFilter.css";

export default function BrandFilter() {
  const dispatch = useDispatch();

  const { allProducts, selectedBrands } = useSelector(
    (state) => state.products
  );

  const uniqueBrands = [...new Set(allProducts.map((p) => p.brand))];

  return (
    <div className="brand-filter">
      <h4>BRAND</h4>
      <ul className="ul-brand">
        {uniqueBrands.map((brand) => (
          <li key={brand} className="list">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => dispatch(toggleBrand(brand))}
            />
            <label>{brand}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
