import { useEffect, useState, useCallback } from "react";
import { useGlobalCounter } from "../../../../context/globalCounterContext.jsx";
import "./YouMayAlsoLike.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function YouMayAlsoLike() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { wishlist, cart, triggerReload } = useGlobalCounter();

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const allData = await res.json();
        const data = allData.data;

        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get("category");
        const gender = urlParams.get("gender");
        const id = urlParams.get("id");

        let items = [];
        if (category && gender && id) {
          items = data.filter(
            (item) =>
              item.category === category &&
              item.gender === gender &&
              item._id !== id
          );
        }

        const related = [];

        if (items && items.length > 0) {
          const shuffled = [...items].sort(() => 0.5 - Math.random());
          for (let i = 0; i < Math.min(6, shuffled.length); i++) {
            const card = shuffled[i];
            const imageData = card.thumbnail || "";
            const src = imageData.startsWith(".")
              ? imageData.slice(1)
              : imageData;
            related.push({ ...card, src });
          }
        } else {
          const categories = [
            "Clothes",
            "Shoes",
            "Watches",
            "GenZ",
            "Millennial",
          ];
          const genders = ["male", "female"];
          let attempts = 0;
          while (related.length < 6 && attempts < 30) {
            attempts++;
            const c = getRandomItem(categories);
            const g = getRandomItem(genders);
            const list =
              data.find(
                (item) =>
                  item.category.toLowerCase() === c.toLowerCase() &&
                  item.gender.toLowerCase() === g.toLowerCase()
              ) || null;

            if (!list || list.length === 0) continue;
            const candidate = getRandomItem(list);
            if (!candidate || candidate.id === id) continue;
            if (related.find((r) => r.id === candidate.id)) continue;
            const imageData = candidate.img || "";
            const src = imageData.startsWith(".")
              ? imageData.slice(1)
              : imageData;
            related.push({ ...candidate, src });
          }
        }

        if (mounted) {
          setCards(related);
          setLoading(false);
        }
      } catch (err) {
        console.error("YouMayAlsoLike load error", err);
        if (mounted) {
          setError(err.message || "Failed to load related items");
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleAddToCart(cart) {
    try {
      const id = cart._id;
      console.log("-----id ----", id);
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

  async function handleAddToWishlist(cart) {
    try {
      const id = cart._id;
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

  const openDetails = useCallback((product) => {
    const url = `${window.location.origin}/ProductDetail?category=${product.category}&gender=${product.gender}&id=${product._id}`;
    window.location.href = url;
  }, []);

  return (
    <div className="you-may-also-like">
      <div className="container-for-body">
        <div>
          <h2>You May Also Like</h2>
          <br />
          <hr />
          <br />
          <br />
        </div>
        <div className="you-may-also-like-section">
          {loading && <p>Loading suggestions...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <ul
              id="you-may-also-like-ul"
              className="you-may-also-like-cards grid"
            >
              {cards.map((card, idx) => (
                <li
                  key={`${card.id}-${idx}`}
                  className="you-may-also-like-card-item"
                >
                  <div
                    className="you-may-also-like-card-img-div"
                    onClick={() => openDetails(card)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") openDetails(card);
                    }}
                    aria-label={`Open details for ${card.brand}`}
                  >
                    <img
                      className="you-may-also-like-card-img"
                      src={card.src}
                      alt={card.brand}
                      loading="lazy"
                    />
                  </div>
                  <div className="you-may-also-like-card-head">
                    <h3>{card.brand}</h3>
                    <p>{card.color}</p>
                  </div>
                  <div className="you-may-also-like-card-rating">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <div className="you-may-also-like-card-footer flex">
                    <span>₹{card.price}</span>
                    <div className="you-may-also-like-card-actions flex">
                      <button
                        className="you-may-also-like-btn-cart"
                        onClick={() => handleAddToCart(card)}
                        title="Add to cart"
                      >
                        <i className="fa-solid fa-xl fa-cart-plus"></i>
                      </button>
                      <button
                        className="you-may-also-like-btn-wishlist"
                        onClick={() => handleAddToWishlist(card.id)}
                        title="Add to wishlist"
                      >
                        <i className="fa-solid fa-xl fa-heart"></i>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
