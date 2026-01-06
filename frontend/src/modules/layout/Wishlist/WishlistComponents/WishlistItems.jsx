import { useEffect, useState } from "react";
import { useGlobalCounter } from "../../../../context/globalCounterContext.jsx";
const API_URL = import.meta.env.VITE_API_URL;

export default function WishlistItems() {
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { triggerReload } = useGlobalCounter();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch products");

      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error("Error fetching products", err);
      return [];
    }
  };

  const fetchUserStatus = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/status-check", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) return null;

      return res.json();
    } catch {
      return null;
    }
  };

  const loadWishlist = async () => {
    setLoading(true);
    const prodData = await fetchProducts();
    const person = await fetchUserStatus();

    setProducts(prodData);
    setUser(person);

    if (!person) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    let wishlistData = [];
    try {
      const res = await fetch(`${API_URL}/api/wishlist-products`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        wishlistData = json.data?.items || [];
      } else {
        console.log("Unable to fetch wishlist data using API");
      }
    } catch (error) {
      console.log("Unable to call Wishlist data using API", error);
    }

    const mapped = wishlistData
      .map((item) => {
        const product = item.productId;
        if (!product) return null;

        return {
          id: product._id,
          brand: product.brand,
          category: product.category,
          color: product.color,
          price: (
            product.price -
            (product.price - product.price * (product.discountPercentage / 100))
          ).toFixed(2),
          MRP: product.price,
          discount: product.discountPercentage,
          rating: product.ratings,
          img: product.thumbnail,
          gender: product.gender,
        };
      })
      .filter(Boolean);

    setWishlistItems(mapped);
    setLoading(false);
  };

  const removeFromWishlist = async (productId) => {
    try {
      await fetch(`${API_URL}/api/remove-from-wishlist/${productId}`, {
        method: "POST",
        credentials: "include",
      });
      loadWishlist();
      triggerReload();
    } catch (error) {
      console.log("Unable to call API from ", error);
    }
  };

  const addToCart = async (productID) => {
    try {
      await fetch(`${API_URL}/api/add-to-cart/${productID}`, {
        method: "POST",
        credentials: "include",
      });

      triggerReload();
    } catch (error) {
      console.log("Unable to fetch data");
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <div className="wishlist-main-body">
      <div className="container-for-body">
        <div className="heading">
          <div className="item-teller ">
            <h2>My Wishlist</h2>
          </div>
        </div>

        <div className="Selected-Items wishlist-card">
          {loading ? (
            <p>Loading Wishlist...</p>
          ) : !user ? (
            <p>Please log in to see your wishlist.</p>
          ) : wishlistItems.length === 0 ? (
            <p>Your wishlist is empty.</p>
          ) : (
            <div className="wishlist grid">
              {wishlistItems.map((product) => (
                <div className="card-body" key={product.id}>
                  <div
                    className="card-img"
                    onClick={() =>
                      console.log("Navigate to details", product.id)
                    }
                  >
                    <img src={product.img} alt={product.category} />
                  </div>

                  <div className="brand-name">
                    <h3>{product.brand}</h3>
                  </div>
                  <div className="brand-color">
                    <p>{product.color}</p>
                  </div>
                  <div className="rating">⭐{product.rating}</div>

                  <div className="brand-price-details">
                    <div className="price">₹{product.price}</div>
                    <div className="MRP">₹{product.MRP}</div>
                    <div className="discount">{product.discount}%</div>
                  </div>

                  <div
                    className="remove-btn remove-wishlist"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </div>

                  <div
                    className="wishlist-add-to-cart-btn btn-addToCart"
                    onClick={() => addToCart(product.id)}
                  >
                    Add To Cart
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
