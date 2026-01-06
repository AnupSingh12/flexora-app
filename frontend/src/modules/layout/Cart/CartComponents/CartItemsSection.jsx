// CartItemsSection.jsx
import { useEffect, useState } from "react";
import { useGlobalCounter } from "../../../../context/globalCounterContext.jsx";
import crossPNG from "../../../../assets/icons/close.png";
import SizeModal from "../../../modals/sizeModals.jsx";
import QuantityModal from "../../../modals/quantityModal.jsx";
import ModernAlertModal from "../../../modals/modernAlertModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function CartItemSection() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // MODAL STATES
  const [openSizeModal, setOpenSizeModal] = useState(false);
  const [openQtyModal, setOpenQtyModal] = useState(false);

  // Which item is being edited
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  // ALERT MODAL
  const [alertModal, setAlertModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const { triggerReload } = useGlobalCounter();

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCart() {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/cart-products`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.log("Unable to call cart API");
      }

      const allData = await res.json();
      const items = allData.data?.items || [];

      const selected = items
        .map((item) => {
          const product = item.productId;
          if (!product) return null;

          const sizeStockMap = getSizeStockMap(product.sizes || []);

          return {
            id: product._id,
            title: product.title,
            brand: product.brand,
            category: product.category,
            color: product.color,
            price: (
              product.price -
              product.price * (product.discountPercentage / 100)
            ).toFixed(2),
            MRP: product.price,
            discount: product.discountPercentage,
            rating: product.ratings,
            img: product.thumbnail,
            gender: product.gender,

            // ✅ CORRECT DATA
            availableSizes: Object.keys(sizeStockMap),
            sizeStockMap,

            size: item.size || null,
            quantity: item.quantity || 1,
          };
        })
        .filter(Boolean);

      setCartItems(selected);
    } catch (err) {
      console.error("Error loading cart:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // REMOVE ITEM
  async function removeFromCart(productId) {
    try {
      await fetch(`${API_URL}/api/remove-from-cart/${productId}`, {
        method: "POST",
        credentials: "include",
      });

      await loadCart();
      triggerReload();
    } catch (error) {
      console.log("Error removing item from cart");
      setAlertModal({
        open: true,
        title: "Could not remove item",
        message: "Try again later.",
      });
    }
  }

  // UPDATE SIZE
  async function updateSize(newSize) {
    const item = cartItems[activeItemIndex];
    if (!item) return;

    const maxQty = item.sizeStockMap[newSize] || 1;

    setCartItems((prev) => {
      const copy = [...prev];
      copy[activeItemIndex].size = newSize;
      copy[activeItemIndex].quantity = Math.min(
        copy[activeItemIndex].quantity,
        maxQty
      );
      return copy;
    });

    await fetch(`${API_URL}/api/update-size`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: item.id,
        size: newSize,
      }),
    });

    setOpenSizeModal(false);
    triggerReload();
  }

  // UPDATE QUANTITY
  async function updateQuantity(newQty) {
    const item = cartItems[activeItemIndex];
    if (!item) return;

    // Instant frontend update
    setCartItems((prev) => {
      const copy = [...prev];
      copy[activeItemIndex].quantity = newQty;
      return copy;
    });

    try {
      await fetch(`${API_URL}/api/update-quantity`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.id,
          quantity: newQty,
        }),
      });

      setOpenQtyModal(false);
      triggerReload();
    } catch (err) {
      console.log("Error updating quantity");
    }
  }

  // OPEN MODALS
  function showSizeChart(index) {
    setActiveItemIndex(index);
    setOpenSizeModal(true);
  }

  function showQuantityChart(index) {
    const item = cartItems[index];

    if (!item.size) {
      setAlertModal({
        open: true,
        title: "Select Size First",
        message: "Please select a size before choosing quantity.",
      });
      return;
    }

    setActiveItemIndex(index);
    setOpenQtyModal(true);
  }

  function getSizeStockMap(sizes = []) {
    return sizes.reduce((acc, size) => {
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {});
  }

  // CART RENDERING
  let content;

  if (isLoading) {
    content = <p>Loading your cart...</p>;
  } else if (error) {
    content = <p>Error loading cart: {error}</p>;
  } else if (cartItems.length === 0) {
    content = (
      <div className="empty-cart-text">
        <h3>Your Cart is Empty!</h3>
        <p>Looks like you haven't added anything yet.</p>
      </div>
    );
  } else {
    content = cartItems.map((item, index) => (
      <div className="items" key={`${item.id}-${index}`}>
        <div className="left-sec">
          {/* Product Image */}
          <div className="item-img">
            <div>
              <img src={item.img} alt={item.category} />
            </div>
          </div>

          {/* Product Details */}
          <div className="item-desc">
            <div>
              <h3>{item.brand}</h3>
              <p>{item.title}</p>
            </div>

            {/* SIZE + QTY BUTTONS */}
            <div className="card-size-button">
              <button className="size-btn" onClick={() => showSizeChart(index)}>
                Size: {item.size}
              </button>

              <button
                className="quantity-btn"
                onClick={() => showQuantityChart(index)}
              >
                Qty : {item.quantity}
              </button>
            </div>

            {/* Prices */}
            <div className="item-price ">
              <p>₹{item.price}</p>
              <span>₹{item.MRP}</span>
              <div className="discount-offer ">
                <h4>{item.discount}% off</h4>
              </div>
            </div>

            <div>
              <p>
                <i className="fa-solid fa-arrow-rotate-left"></i> 14 days return
                policy
              </p>
            </div>
          </div>

          {/* REMOVE BUTTON */}
          <div
            className="remove-form-cart-btn"
            onClick={() => removeFromCart(item.id)}
          >
            <img className="cross-btn" src={crossPNG} alt="cancel-btn" />
          </div>
        </div>
      </div>
    ));
  }

  return (
    <div id="cart-items-container">
      {content}

      {/* Size & Quantity modals rendered once (portal ensures they are outside layout) */}
      <SizeModal
        isOpen={openSizeModal}
        allSizes={
          cartItems[activeItemIndex]?.category === "Shoes"
            ? ["6", "7", "8", "9", "10", "11"]
            : ["S", "M", "L", "XL", "XXL"]
        }
        availableSizes={cartItems[activeItemIndex]?.availableSizes || []}
        selectedSize={cartItems[activeItemIndex]?.size}
        onSelect={(s) => updateSize(s)}
        onClose={() => setOpenSizeModal(false)}
      />

      <QuantityModal
        isOpen={openQtyModal}
        max={
          cartItems[activeItemIndex]?.size
            ? cartItems[activeItemIndex].sizeStockMap[
                cartItems[activeItemIndex].size
              ]
            : 1
        }
        selectedQty={cartItems[activeItemIndex]?.quantity}
        onSelect={(q) => updateQuantity(q)}
        onClose={() => setOpenQtyModal(false)}
      />

      <ModernAlertModal
        isOpen={alertModal.open}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() => setAlertModal({ ...alertModal, open: false })}
      />
    </div>
  );
}
