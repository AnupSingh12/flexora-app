import { useEffect, useState } from "react";
import "./PaymentPage.css";
import { useNavigate } from "react-router-dom";
import PriceSection from "./../Cart/CartComponents/CartPriceSection.jsx";

//images import
import SBIPng from "../../../assets/SVG/sbi.svg";
import HDFCPng from "../../../assets/SVG/hdfc-bank.png";
import AXISPng from "../../../assets/SVG/Axis-bank.png";
import PNBPng from "../../../assets/SVG/pnb.png";

const API_URL = import.meta.env.VITE_API_URL;
export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState("cod");
  const [priceData, setPriceData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPrice();
  }, []);

  // Auto close modal and navigate after success (optional)
  useEffect(() => {
    if (!showModal) return;
    const t = setTimeout(() => {
      setShowModal(false);
      navigate("/");
    }, 3500);
    return () => clearTimeout(t);
  }, [showModal, navigate]);

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
  };

  async function loadPrice() {
    try {
      const res = await fetch(`${API_URL}/get-price`, {
        method: "POST",
        credentials: "include",
      });

      const Alldata = await res.json();
      const data = Alldata.data;

      let couponDiscountValue = JSON.parse(
        localStorage.getItem("CouponData")
      ) || [0];
      let couponDiscount = couponDiscountValue.discountAmount || 0;

      let totalMRP = data.totalMRP;
      let totalDiscount = data.totalDiscount;
      let totalPrice = data.totalPrice - couponDiscount;

      setPriceData({
        totalMRP,
        totalDiscount,
        couponDiscount,
        totalPrice,
      });
    } catch (error) {
      console.log("unable to get data from the API called");
    }
  }

  return (
    <>
      {/* NAVBAR */}
      <header>
        <nav>
          <div className="flexora-pay-navbar">
            <div className="flexora-pay-left-navbar">
              <a href="/">
                <h1>Flexora</h1>
              </a>
            </div>

            <div className="flexora-pay-mid-navbar-body">
              <div>
                <a href="/Checkout">
                  <p>CART</p>
                </a>
              </div>
              <div>/</div>
              <div>
                <a href="/Default-address">
                  <p>ADDRESS</p>
                </a>
              </div>
              <div>/</div>
              <div>
                <p className="flexora-pay-step-active">PAYMENT</p>
              </div>
            </div>

            <div className="flexora-pay-right-navbar">
              <p>
                <i className="fa-solid fa-lg fa-shield-halved" /> 100% Secure
              </p>
            </div>
          </div>
        </nav>
      </header>

      {/* MAIN BODY */}
      <div className="flexora-pay-main-body">
        <section className="flexora-pay-payment-page">
          {/* LEFT SECTION */}
          <div className="flexora-pay-payment-left">
            <h2>Select Payment Method</h2>

            <div className="flexora-pay-payment-sec">
              <div className="flexora-pay-payment-method-keys">
                {["cod", "emi", "card", "upi", "netbanking"].map((method) => (
                  <div
                    key={method}
                    className={`flexora-pay-payment-method ${
                      selectedMethod === method
                        ? "flexora-pay-active-method"
                        : ""
                    }`}
                    onClick={() => handleMethodChange(method)}
                  >
                    <input
                      type="radio"
                      checked={selectedMethod === method}
                      readOnly
                    />
                    <label>{method.toUpperCase()}</label>
                  </div>
                ))}
              </div>

              {/* METHOD BODY */}
              <div className="flexora-pay-payment-method-option">
                {selectedMethod === "cod" && (
                  <div className="flexora-pay-method-body flexora-pay-show">
                    <h3>Cash on Delivery</h3>
                    <p>Pay when the order arrives.</p>
                  </div>
                )}

                {selectedMethod === "emi" && (
                  <div className="flexora-pay-method-body flexora-pay-show">
                    <h3>EMI</h3>

                    <div className="flexora-pay-banks">
                      {[
                        { id: "sbi", label: "SBI", img: SBIPng },
                        {
                          id: "hdfc",
                          label: "HDFC",
                          img: HDFCPng,
                        },
                        {
                          id: "axis",
                          label: "AXIS",
                          img: AXISPng,
                        },
                        { id: "pnb", label: "PNB", img: PNBPng },
                      ].map((bank) => (
                        <label key={bank.id} className="flexora-pay-bank-label">
                          <input type="radio" name="emi-bank" />
                          <img src={bank.img} alt={bank.label} />
                          {bank.label}
                        </label>
                      ))}
                    </div>

                    <button className="flexora-pay-btn">
                      Continue to Bank
                    </button>
                  </div>
                )}

                {selectedMethod === "card" && (
                  <div className="flexora-pay-method-body flexora-pay-show">
                    <h3>Card Payment</h3>
                    <input placeholder="Card Number" />
                    <input placeholder="Name on Card" />
                    <input placeholder="Expiry (MM/YY)" />
                    <input placeholder="CVV" />
                    <button className="flexora-pay-btn">Pay Now</button>
                  </div>
                )}

                {selectedMethod === "upi" && (
                  <div className="flexora-pay-method-body flexora-pay-show">
                    <h3>UPI</h3>
                    <input placeholder="Enter UPI ID" />
                    <button className="flexora-pay-btn">Verify</button>
                  </div>
                )}

                {selectedMethod === "netbanking" && (
                  <div className="flexora-pay-method-body flexora-pay-show">
                    <h3>Net Banking</h3>

                    <div className="flexora-pay-banks">
                      {[
                        { id: "sbi", label: "SBI", img: SBIPng },
                        {
                          id: "hdfc",
                          label: "HDFC",
                          img: HDFCPng,
                        },
                        {
                          id: "axis",
                          label: "AXIS",
                          img: AXISPng,
                        },
                        { id: "pnb", label: "PNB", img: PNBPng },
                      ].map((bank) => (
                        <label key={bank.id} className="flexora-pay-bank-label">
                          <input type="radio" name="net-banking-bank" />
                          <img src={bank.img} alt={bank.label} />
                          {bank.label}
                        </label>
                      ))}
                    </div>

                    <button className="flexora-pay-btn">
                      Continue to Bank
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <PriceSection
            page="payment"
            selectedMethod={selectedMethod}
            setShowModal={setShowModal}
          />
        </section>
      </div>

      {/* SUCCESS MODAL (new class names) */}
      {showModal && (
        <div
          className="fp-modal-overlay"
          onClick={() => {
            // click outside to close
            setShowModal(false);
          }}
        >
          <div
            className="fp-modal-card"
            onClick={(e) => {
              // prevent overlay click from closing if clicked inside card
              e.stopPropagation();
            }}
          >
            <div className="fp-check-wrap">
              {/* animated SVG circle + check path */}
              <svg
                className="fp-check-svg"
                viewBox="0 0 52 52"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  className="fp-check-circle"
                  cx="26"
                  cy="26"
                  r="24"
                  fill="none"
                />
                {/* check path — coordinates produce a clean tick */}
                <path
                  className="fp-check-path"
                  d="M14 27 L22 35 L38 19"
                  fill="none"
                />
              </svg>
            </div>

            <h2 className="fp-modal-title">Order Placed Successfully!</h2>
            <p className="fp-modal-sub">Your order is confirmed 🎉</p>

            <div className="fp-modal-actions">
              <button
                className="fp-modal-btn"
                onClick={() => {
                  setShowModal(false);
                  navigate("/");
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
