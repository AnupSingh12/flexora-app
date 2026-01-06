import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProducts: [],
  filteredProducts: [],
  selectedBrands: [],
  selectedColors: [],
  selectedTypes: [],
  selectedRange: null,
  sortType: "Recommended",
};

function applyFilters(state) {
  let filtered = [...state.allProducts];

  if (state.selectedBrands.length > 0) {
    filtered = filtered.filter((p) => state.selectedBrands.includes(p.brand));
  }

  if (state.selectedColors.length > 0) {
    filtered = filtered.filter((p) => state.selectedColors.includes(p.color));
  }

  if (state.selectedTypes.length > 0) {
    filtered = filtered.filter((p) =>
      state.selectedTypes.includes(p.productType)
    );
  }

  if (state.selectedRange) {
    filtered = filtered.filter((p) => p.price <= state.selectedRange);
  }

  // 🔽 SORT AFTER FILTERING
  switch (state.sortType) {
    case "Popularity":
      filtered.sort((a, b) => b.rating - a.rating);
      break;

    case "Discount":
      filtered.sort((a, b) => b.discount - a.discount);
      break;

    case "Expensive":
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
      break;

    case "Cheap":
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
      break;

    default:
      break;
  }

  state.filteredProducts = filtered;
}

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setAllProducts(state, action) {
      state.allProducts = action.payload;
      state.filteredProducts = action.payload;
    },

    toggleBrand(state, action) {
      const brand = action.payload;

      state.selectedBrands.includes(brand)
        ? (state.selectedBrands = state.selectedBrands.filter(
            (b) => b !== brand
          ))
        : state.selectedBrands.push(brand);

      applyFilters(state);
    },

    toggleColor(state, action) {
      const color = action.payload;

      state.selectedColors.includes(color)
        ? (state.selectedColors = state.selectedColors.filter(
            (c) => c !== color
          ))
        : state.selectedColors.push(color);

      applyFilters(state);
    },

    toggleType(state, action) {
      const productType = action.payload;

      state.selectedTypes.includes(productType)
        ? (state.selectedTypes = state.selectedTypes.filter(
            (t) => t !== productType
          ))
        : state.selectedTypes.push(productType);

      applyFilters(state);
    },
    toggleRange(state, action) {
      state.selectedRange = action.payload;
      applyFilters(state);
    },
    toggleSortedProducts(state, action) {
      state.sortType = action.payload;
      applyFilters(state);
    },
  },
});

export const {
  setAllProducts,
  toggleBrand,
  toggleColor,
  toggleType,
  toggleRange,
  toggleSortedProducts,
} = productSlice.actions;

export default productSlice.reducer;
