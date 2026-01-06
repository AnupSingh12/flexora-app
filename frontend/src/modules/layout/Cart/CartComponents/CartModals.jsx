import "./CartModals.css";

export default function CartModals() {
  return (
    <>
      <div id="cart-overlay"></div>

      <div id="cart-size-clothes-modal">
        <div className="cart-size-selection-container">
          <button data-size="S" className="cart-size-btn">
            S
          </button>
          <button data-size="M" className="cart-size-btn">
            M
          </button>
          <button data-size="L" className="cart-size-btn">
            L
          </button>
          <button data-size="XL" className="cart-size-btn">
            XL
          </button>
          <button data-size="2XL" className="cart-size-btn">
            2XL
          </button>
          <button data-size="3XL" className="cart-size-btn">
            3XL
          </button>
        </div>
      </div>

      <div id="cart-size-shoes-modal">
        <div className="cart-size-selection-container">
          <button data-size="6" className="cart-size-btn">
            6
          </button>
          <button data-size="7" className="cart-size-btn">
            7
          </button>
          <button data-size="8" className="cart-size-btn">
            8
          </button>
          <button data-size="9" className="cart-size-btn">
            9
          </button>
          <button data-size="10" className="cart-size-btn">
            10
          </button>
          <button data-size="11" className="cart-size-btn">
            11
          </button>
        </div>
      </div>

      <div id="cart-quantity-modal">
        <div className="cart-quantity-container">
          <div className="cart-quantity-controls">
            <button id="cart-quantity-decrease">-</button>
            <h3 id="cart-quantity-value">1</h3>
            <button id="cart-quantity-increase">+</button>
          </div>
          <div id="cart-quantity-save-btn" className="cart-save-button">
            Save
          </div>
        </div>
      </div>

      <div id="cart-alert-modal" className="cart-modal-overlay">
        <div className="cart-modal-content">
          <div id="cart-alert-icon" className="cart-modal-icon-container"></div>
          <h2 id="cart-alert-title">Modal Title</h2>
          <p id="cart-alert-message">Modal message goes here.</p>
          <button id="cart-alert-button">Okay</button>
        </div>
      </div>

      <div id="cart-coupon-modal" className="cart-modal-overlay">
        <div className="cart-modal-content">
          <div className="cart-modal-icon-container">
            <div className="cart-modal-icon cart-modal-icon-info">
              <i className="fa-solid fa-ticket"></i>
            </div>
          </div>
          <h2>Apply Coupon</h2>
          <p>Enter a valid coupon code to get a discount on your order.</p>
          <input
            type="text"
            id="cart-coupon-input"
            className="cart-coupon-input"
            placeholder="Enter Coupon Code"
          />
          <div className="cart-coupon-actions">
            <button id="cart-apply-coupon-btn">Apply</button>
            <button id="cart-cancel-coupon-btn" className="cart-btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
