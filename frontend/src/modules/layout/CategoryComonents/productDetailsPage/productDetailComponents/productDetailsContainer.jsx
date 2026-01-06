import { useState, useEffect } from "react";
import "./productDetailsContainer.css";
import { useGlobalCounter } from "../../../../../context/globalCounterContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function DetailsContainer(props) {
  const images = (() => {
    if (props.images && props.images.length > 0) {
      // Fill missing slots with thumbnail
      const filled = [...props.images];
      while (filled.length < 5) {
        filled.push(props.imgSrc);
      }
      return filled.slice(0, 5);
    }

    // fallback if images array missing
    return Array(5).fill(props.imgSrc);
  })();

  const { triggerReload } = useGlobalCounter();

  const [activeIndex, setActiveIndex] = useState(0);

  const [selectedSize, setSelectedSize] = useState(null);

  const SIZE_OPTIONS = {
    Clothes: ["XS", "S", "M", "L", "XL", "XXL"],
    Shoes: ["6", "7", "8", "9", "10", "11"],
    Watches: ["One Size"],
  };

  const allSizes = SIZE_OPTIONS[props.category] || SIZE_OPTIONS.Clothes;

  // ✅ derive available sizes from backend data
  const availableSizeSet = getAvailableSizeSet(props.sizes || []);

  function getAvailableSizeSet(sizes = []) {
    return new Set(sizes);
  }

  const next = () =>
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const prev = () =>
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  /* Keyboard navigation (mobile + desktop) */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  async function addToCart(id, size = selectedSize) {
    try {
      const res = await fetch(`${API_URL}/api/add-to-cart/${id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) console.log("Unable to add to cart");

      triggerReload();

      await fetch(`${API_URL}/api/update-size`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          size: size,
        }),
      });
    } catch (error) {
      console.log("Cart API error", error);
    }
  }

  return (
    <section className="fx-pdp-root">
      {/* IMAGE SECTION */}
      <div className="fx-pdp-imageWrapper">
        {/* DESKTOP GRID (2 + 3) */}
        <div className="fx-pdp-grid">
          <div className="fx-pdp-row fx-pdp-row-two">
            <img src={images[0]} alt="" />
            <img src={images[1]} alt="" />
          </div>

          <div className="fx-pdp-row fx-pdp-row-three">
            <img src={images[2]} alt="" />
            <img src={images[3]} alt="" />
            <img src={images[4]} alt="" />
          </div>
        </div>

        {/* MOBILE STACK */}
        <div className="fx-pdp-stack">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className={`fx-pdp-stackImg ${
                index === activeIndex ? "fx-pdp-active" : ""
              }`}
            />
          ))}

          <div className="fx-pdp-counter">
            {activeIndex + 1} / {images.length}
          </div>

          <button className="fx-pdp-arrow fx-pdp-arrowLeft" onClick={prev}>
            ‹
          </button>
          <button className="fx-pdp-arrow fx-pdp-arrowRight" onClick={next}>
            ›
          </button>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <aside className="fx-pdp-info">
        <span className="fx-pdp-season">NEW SEASON</span>

        <h1 className="fx-pdp-title">{props.brand}</h1>

        <div className="fx-pdp-priceRow">
          <span className="fx-pdp-price">₹{props.price.toFixed(2)}</span>
          <span className="fx-pdp-mrp">₹{props.MRP}</span>
        </div>

        <div className="fx-pdp-sizeBlock">
          <div className="fx-pdp-sizeHeader">
            <span>SIZE</span>
          </div>

          <div className="fx-pdp-sizeGrid">
            {allSizes.map((size) => {
              const isAvailable = availableSizeSet.has(size);

              return (
                <button
                  key={size}
                  disabled={!isAvailable}
                  className={`fx-pdp-sizeBtn
        ${selectedSize === size ? "fx-pdp-sizeActive" : ""}
        ${!isAvailable ? "fx-pdp-sizeDisabled" : ""}
      `}
                  onClick={() => isAvailable && setSelectedSize(size)}
                >
                  {size}
                  {!isAvailable && <span className="fx-pdp-sizeCross">✕</span>}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="fx-pdp-addBtn"
          disabled={props.category === "Watches" ? "" : !selectedSize}
          style={{
            opacity: props.category === "Watches" ? 1 : !selectedSize ? 0.6 : 1,
            cursor:
              props.category === "Watches"
                ? "pointer"
                : !selectedSize
                ? "not-allowed"
                : "pointer",
          }}
          onClick={() => addToCart(props.productId)}
        >
          ADD TO CART
        </button>

        <div className="fx-pdp-accordion">
          <details className="fx-pdp-accordionItem">
            <summary className="fx-pdp-accordionTitle">
              PRODUCT DESCRIPTION
            </summary>
            <p className="fx-pdp-accordionContent">{props.description}</p>
          </details>

          <details className="fx-pdp-accordionItem">
            <summary className="fx-pdp-accordionTitle">PRODUCT DETAILS</summary>
            <p className="fx-pdp-accordionContent">
              Fabric, fit & care instructions.
            </p>
          </details>

          <details className="fx-pdp-accordionItem">
            <summary className="fx-pdp-accordionTitle">OUR COMMITMENT</summary>
            <p className="fx-pdp-accordionContent">
              Crafted with quality & sustainability.
            </p>
          </details>
        </div>
      </aside>
    </section>
  );
}
