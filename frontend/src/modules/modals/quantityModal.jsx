import { createPortal } from "react-dom";
import "./ModernModal.css";

export default function QuantityModal({
  isOpen,
  max = 1,
  selectedQty,
  onSelect,
  onClose,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="cart-modal-overlay">
      <div className="cart-modal-box">
        <h3 className="cart-modal-title">Select Quantity</h3>

        <div className="cart-qty-grid">
          {[...Array(max)].map((_, i) => {
            const qty = i + 1;
            return (
              <button
                key={qty}
                className={`cart-qty-btn ${
                  selectedQty === qty ? "active" : ""
                }`}
                onClick={() => onSelect(qty)}
              >
                {qty}
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
