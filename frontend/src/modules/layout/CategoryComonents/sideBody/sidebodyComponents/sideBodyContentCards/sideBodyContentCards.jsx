import { useState, useEffect } from "react";
import "./sideBodyContentCards.css";
import { useGlobalCounter } from "../../../../../../context/globalCounterContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setAllProducts } from "../../../../../../store/slices/productSlice.js";

const API_URL = import.meta.env.VITE_API_URL;

export default function SideBodyContentCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { wishlist, cart, triggerReload } = useGlobalCounter();
  const products = useSelector((state) => state.products.filteredProducts);

  async function addToWishlist(id) {
    try {
      const res = await fetch(`${API_URL}/api/add-to-wishlist/${id}`, {
        method: "POST",
        credentials: "include",
      });
      triggerReload(); // 🔥 updates instantly (no double click)
      if (!res.ok) console.log("Unable to add to wishlist");
    } catch (error) {
      console.log("Wishlist API error", error);
    }
  }

  async function addToCart(id) {
    try {
      const res = await fetch(`${API_URL}/api/add-to-cart/${id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) console.log("Unable to add to cart");

      triggerReload();
    } catch (error) {
      console.log("Cart API error", error);
    }
  }

  function addToDetailsCard(item) {
    window.location.href = `/ProductDetail?category=${item.category}&gender=${item.gender}&id=${item.id}`;
  }

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      async function fetchProducts() {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();

        const pathname = window.location.pathname.toLowerCase();
        const searchTerms = pathname.split("/").filter(Boolean);

        const possibleCats = [
          "shoes",
          "clothes",
          "watches",
          "genz",
          "millennial",
        ];
        const categoryKey = possibleCats.find((c) =>
          searchTerms.some((t) => t.includes(c))
        );

        let genderValue = "";
        if (pathname.includes("women")) genderValue = "female";
        else if (pathname.includes("men")) genderValue = "male";

        let filtered = data.data;

        if (categoryKey) {
          filtered = filtered.filter(
            (p) => p.category?.toLowerCase() === categoryKey
          );
        }

        if (genderValue) {
          filtered = filtered.filter(
            (p) => p.gender?.toLowerCase() === genderValue
          );
        }

        const transformed = filtered.map((p) => ({
          id: p._id,
          img: p.thumbnail,
          brand: p.brand,
          title: p.title,
          color: p.color,
          category: p.category,
          productType: p.productType,
          gender: p.gender,
          stock: p.stock,
          price: Number(
            (p.price - p.price * (p.discountPercentage / 100)).toFixed(2)
          ),
          MRP: p.price,
          rating: p.ratings || 0,
          discount: p.discountPercentage || 0,
        }));

        dispatch(setAllProducts(transformed));
        setLoading(false);
      }

      fetchProducts();
    } catch (error) {
      setError(error);
    }
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error}</p>;
  if (products.length === 0) return <li>No products match your criteria.</li>;

  return (
    <>
      {products.map((item) => {
        const isInWishlist = wishlist?.some((w) => w.productId._id === item.id);
        const isInCart = cart?.some((c) => c.productId._id === item.id);
        const isOutOfStock = item.stock === 0;

        return (
          <li
            key={item.id}
            className="side-body-content-cards-item product-card"
          >
            <div
              className="card-img-div"
              onClick={() =>
                addToDetailsCard({
                  category: item.category,
                  gender: item.gender,
                  id: item.id,
                })
              }
            >
              <img
                className={`side-body-img product-image ${
                  isOutOfStock ? "out-of-stock-img" : ""
                }`}
                src={item.img}
                alt={item.brand}
              />

              {isOutOfStock && (
                <div className="out-of-stock-badge">OUT OF STOCK</div>
              )}
            </div>

            {/* WISHLIST BUTTON */}
            <button
              disabled={isOutOfStock}
              className={`card-img-hover btn-wishlist ${
                isInWishlist ? "red-icon" : ""
              } ${isOutOfStock ? "disabled-btn" : ""}`}
              onClick={() => !isOutOfStock && addToWishlist(item.id)}
            >
              <i className="fa-solid fa-heart fa-lg"></i>
            </button>

            <div className="card-content-wrapper">
              <div className="card-head">
                <h3>{item.brand}</h3>
                <p>{item.title}</p>
              </div>
              <div className="card-rating">
                <span>⭐ {item.rating}</span>
              </div>
              <div className="card-price">
                <span className="price">₹{item.price}</span>
                <span className="mrp">₹{item.MRP}</span>
                <span className="discount">({item.discount}% OFF)</span>
              </div>
            </div>

            {/* CART BUTTON */}
            <button
              disabled={isOutOfStock}
              className={`add-to-cart-btn btn-addToCart ${
                isInCart ? "cart-red-icon" : ""
              } ${isOutOfStock ? "disabled-btn" : ""}`}
              onClick={() => !isOutOfStock && addToCart(item.id)}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </li>
        );
      })}
    </>
  );
}
