import { createPortal } from "react-dom";
import "./ModernModal.css";

export default function ModernAlertModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="cart-modal-overlay">
      <div className="cart-modal-box">
        <h3 className="cart-modal-title">{title}</h3>
        <p className="cart-modal-message">{message}</p>

        <button className="cart-modal-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>,
    document.body
  );
}
