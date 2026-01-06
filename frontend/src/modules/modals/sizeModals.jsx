import { createPortal } from "react-dom";
import "./ModernModal.css";

export default function SizeModal({
  isOpen,
  allSizes = [],
  availableSizes = [],
  selectedSize,
  onSelect,
  onClose,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="cart-modal-overlay">
      <div className="cart-modal-box">
        <h3 className="cart-modal-title">Select Size</h3>

        <div className="cart-size-grid">
          {allSizes.map((size) => {
            const isAvailable = availableSizes.includes(size);

            return (
              <button
                key={size}
                disabled={!isAvailable}
                className={`cart-size-btn
                  ${selectedSize === size ? "active" : ""}
                  ${!isAvailable ? "disabled" : ""}
                `}
                onClick={() => isAvailable && onSelect(size)}
              >
                {size}
              </button>
            );
          })}
        </div>

        <button className="cart-modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
