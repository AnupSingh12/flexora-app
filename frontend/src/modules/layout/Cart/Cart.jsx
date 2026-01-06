import "./Cart.css";
import Navbar from "../navbar/navbar.jsx";
import Footer from "../footer/footer.jsx";
import PriceSection from "./CartComponents/CartPriceSection.jsx";
import CartItemSection from "./CartComponents/CartItemsSection.jsx";
export default function Cart() {
  return (
    <>
      <Navbar />
      <main className="cart-main-body">
        <div className="cart-full-container">
          <div className="cart-wrapper container-for-body">
            <div className="cart-left-section">
              <div className="cart-delivery-check">
                <p>Check delivery time & services</p>
                <button className="cart-delivery-btn">ENTER PIN CODE</button>
              </div>
              <div className="cart-coupons-bar">
                <div className="cart-coupons-header">
                  <i className="fa-solid fa-tag"></i>
                  <p>Available Offers</p>
                </div>
                <div className="cart-offers-list">
                  <ul>
                    <li>
                      10% Instant discount in ICICI Bank Credit Card & Debit
                      Card on a min spend of 3000.TCA
                    </li>
                    <li>Extra 5% off on prepaid orders</li>
                    <li>Free shipping on orders above ₹2999</li>
                  </ul>
                </div>
                <div className="cart-show-more-section">
                  <button className="cart-show-more-btn">Show More</button>
                </div>
              </div>

              <div id="cart-buttons-container"></div>

              <CartItemSection />
            </div>
            <PriceSection page="Cart" />
          </div>
        </div>
        {/* <CartModals /> */}
      </main>
      <Footer />
    </>
  );
}
