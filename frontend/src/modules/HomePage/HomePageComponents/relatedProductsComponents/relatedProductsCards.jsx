import { useState, useEffect } from "react";
import { useGlobalCounter } from "../../../../context/globalCounterContext.jsx";
import "./relatedProductsCards.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function RelatedProductsCards() {
  const [products, setProducts] = useState([]);

  const { wishlist, cart, triggerReload } = useGlobalCounter();

  const getRandomItem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

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

  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const rawData = await res.json();
        const randomProducts = [];

        for (let i = 0; i <= 3; i++) {
          const product = rawData.data;
          if (!product || product.length === 0) continue; //always use early return
          const cardToBeShown = getRandomItem(product);
          const imageData = cardToBeShown.img || "";
          const src = imageData.startsWith(".")
            ? imageData.slice(1)
            : imageData;
          // if already included, skip
          if (randomProducts.some((p) => p._id === cardToBeShown._id)) {
            i--;
            continue;
          }
          randomProducts.push({
            ...cardToBeShown,
            src,
          });
        }

        setProducts(randomProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    loadItems();
  }, []);

  return (
    <>
      {products.map((product) => {
        const isInWishlist = wishlist?.some(
          (w) => w.productId._id === product._id
        );
        const isInCart = cart?.some((c) => c.productId._id === product._id);
        return (
          <li key={`${product._id}`} className="card-item product-card">
            <div
              className="card-img-div"
              onClick={() =>
                addToDetailsCard({
                  category: product.category,
                  gender: product.gender,
                  id: product._id,
                })
              }
            >
              <img
                className="product-image"
                src={product.thumbnail}
                alt={product.category}
              />
            </div>
            <div className="head-bar">
              <h3>{product.brand}</h3>
              <p>{product.title}</p>
            </div>
            <div className="card-item-rating">⭐{product.ratings}</div>
            <div className="details-last-bar flex">
              <span>
                ₹
                {(
                  product.price -
                  (product.price * product.discountPercentage) / 100
                ).toFixed(2)}
              </span>
              <div className="card-detail-bar-icon flex">
                <button
                  className={`card-item-button btn-addcart ${
                    isInCart ? "cart-red-icon" : ""
                  }`}
                  onClick={() => addToCart(product._id)}
                  title="Add to cart"
                >
                  <i className="fa-solid fa-xl fa-cart-plus"></i>
                </button>
                <button
                  className={`card-item-button btn-wishlist ${
                    isInWishlist ? "red-icon" : ""
                  }`}
                  onClick={() => addToWishlist(product._id)}
                  title="Add to wishlist"
                >
                  <i className="fa-solid fa-xl fa-heart"></i>
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </>
  );
}
