import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CouponModal from "./CouponModal";
import { useGlobalCounter } from "../../../../context/globalCounterContext.jsx";
import "./CartPriceSection.css";
import ModernAlertModal from "../../../modals/modernAlertModal.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PriceSection(props) {
  const [priceDetails, setPriceDetails] = useState({
    totalMRP: 0,
    totalPrice: 0,
    totalDiscount: 0,
    couponValue: 0, // use couponValue consistently
    itemCount: 0,
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const { reloadCount, setReloadCount } = useGlobalCounter();
  const [alertModal, setAlertModal] = useState({
    open: false,
    title: "",
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadPrice() {
      try {
        const res = await fetch(`${API_URL}/api/cart-products`, {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to fetch cart-products", res.status);
          if (!isMounted) return;
          setSelectedProducts([]);
          setPriceDetails((pd) => ({ ...pd, itemCount: 0 }));
          return;
        }

        const json = await res.json();
        const cart = json.data || { items: [] };
        const items = cart.items || [];

        const couponData = cart.couponUsed || {};
        const backendCouponValue = Number(couponData.discountedAmount) || 0;

        // Sync backend coupon into local state (only if different)
        if (couponData.coupon) {
          const backendCoupon = couponData.coupon;
          if (!selectedCoupon || selectedCoupon.code !== backendCoupon.code) {
            setSelectedCoupon(backendCoupon);
          }
        } else if (!couponData.coupon && selectedCoupon) {
          // Backend has no coupon but local does → clear local
          setSelectedCoupon(null);
        }

        const selected = items
          .map((it) => {
            const p = it.productId || it.product;
            if (!p) return null;

            const mrp = Number(p.price || 0);
            const discountPercentage = Number(p.discountPercentage || 0);
            const price = mrp - (mrp * discountPercentage) / 100;

            return {
              id: p._id || p.id,
              price: Number(price),
              MRP: Number(mrp),
              quantity: Number(it.quantity || 1),
              category:
                typeof p.category === "string" ? p.category : p.category?.name,
              size: it.size,
            };
          })
          .filter(Boolean);

        if (!isMounted) return;
        setSelectedProducts(selected);

        let totalMRP = 0;
        let subtotal = 0;
        let totalDiscount = 0;

        selected.forEach((item) => {
          totalMRP += item.MRP * item.quantity;
          subtotal += item.price * item.quantity;
          totalDiscount += (item.MRP - item.price) * item.quantity;
        });

        // Start with backend stored value
        let couponDiscount = backendCouponValue;

        // If a coupon is selected locally, recalc based on current subtotal
        if (selectedCoupon) {
          const coupon = selectedCoupon;

          if (coupon.discountType === "flat") {
            couponDiscount = Math.min(
              Number(coupon.discountValue || 0),
              subtotal
            );
          } else if (coupon.discountType === "percentage") {
            couponDiscount = Math.round(
              (subtotal * Number(coupon.discountValue || 0)) / 100
            );
            if (coupon.maxDiscountAmount) {
              couponDiscount = Math.min(
                couponDiscount,
                Number(coupon.maxDiscountAmount)
              );
            }
          }

          couponDiscount = Math.max(
            0,
            Number.isNaN(couponDiscount) ? 0 : couponDiscount
          );
        }

        // Persist updated discount value if changed
        if (couponDiscount !== backendCouponValue) {
          try {
            const upd = await fetch(`${API_URL}/api/update-discount-values`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                couponValue: couponDiscount,
              }),
            });
            if (!upd.ok) {
              console.warn(
                "Failed to update discount value on server",
                upd.status
              );
            }
          } catch (err) {
            console.warn("Error updating discount value:", err);
          }
        }

        if (!isMounted) return;
        setPriceDetails({
          totalMRP: Math.round(totalMRP),
          totalPrice: Math.max(0, Math.round(subtotal - couponDiscount)),
          totalDiscount: Math.round(totalDiscount),
          couponValue: couponDiscount,
          itemCount: selected.length,
        });
      } catch (error) {
        console.error("Error loading price details:", error);
      }
    }

    loadPrice();

    return () => {
      isMounted = false;
    };
  }, [selectedCoupon, reloadCount]);

  const handleApplyCouponClick = () => {
    setIsCouponModalOpen(true);
  };

  const handleApplyCoupon = async (coupon) => {
    try {
      const res = await fetch(`${API_URL}/api/update-coupon-values`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupon }),
      });

      if (!res.ok) {
        console.warn("Failed to save coupon on server", res.status);
      } else {
        setSelectedCoupon(coupon);
        if (typeof setReloadCount === "function") {
          setReloadCount((prev) => (prev || 0) + 1);
        }
      }
    } catch (error) {
      console.log("Error while sending coupon to DB", error);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const res = await fetch(`${API_URL}/api/remove-coupon`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        console.warn("Failed to remove coupon on server", res.status);
      } else {
        setSelectedCoupon(null);
        if (typeof setReloadCount === "function") {
          setReloadCount((prev) => (prev || 0) + 1);
        }
      }
    } catch (err) {
      console.warn("Error removing coupon:", err);
    }
  };

  const handlePlaceOrder = async () => {
    if (props.page === "Cart") {
      const selected = selectedProducts || [];

      if (selected.length === 0) {
        setAlertModal({
          open: true,
          title: "No Items Selected",
          message:
            "Please select at least one item from your cart to place an order.",
        });
        return;
      }

      const sizeRequiredCategories = ["Clothes", "Shoes"];
      const missingSize = selected.some(
        (item) =>
          sizeRequiredCategories.includes(item.category) &&
          (!item.size || item.size === "NA")
      );

      if (missingSize) {
        setAlertModal({
          open: true,
          title: "Size Selection Required",
          message:
            "Please select a size for all clothing and shoe items before placing your order.",
        });
        return;
      }

      setTimeout(() => navigate("/Address-selection"), 1200);
    } else if (props.page === "Address") {
      // keeping your original logic here – make sure these are passed via props/context:
      const { selectedAddressIndex, addresses, openModal } = props;

      if (selectedAddressIndex === null || selectedAddressIndex === undefined) {
        return openModal && openModal("Please select a delivery address!");
      }

      const selectedAddress = addresses[selectedAddressIndex];
      let selectedAddressId =
        JSON.parse(localStorage.getItem("selectedAddressId")) || [];
      selectedAddressId = [];
      selectedAddressId.push(selectedAddress._id);
      localStorage.setItem(
        "selectedAddressId",
        JSON.stringify(selectedAddressId)
      );

      setTimeout(() => navigate("/Payment-page"), 1200);
    } else if (props.page === "payment") {
      try {
        const { selectedMethod, setShowModal } = props;
        if (selectedMethod !== "cod") return;

        const allCouponData = await fetch(`${API_URL}/api/get-coupon-data`, {
          method: "GET",
          credentials: "include",
        });

        const couponData = await allCouponData.json();

        const res = await fetch(`${API_URL}/api/cart-products`, {
          method: "POST",
          credentials: "include",
        });

        const AllData = await res.json();
        const cartData = AllData.data;

        const selectedAddressId = JSON.parse(
          localStorage.getItem("selectedAddressId")
        );
        // save data to order collection
        try {
          await fetch(`${API_URL}/api/place-order`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartData,
              selectedAddressId,
              couponData,
              totalAmount: priceDetails.totalPrice,
            }),
          });
        } catch (error) {
          console.log(
            "---Unable send or fetch data from the order place API---",
            error
          );
        }
        // change the value of coupon that is used so that the user only used it once

        try {
          await fetch(`${API_URL}/users/api/update-user-coupon-value`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ couponData }),
          });
        } catch (error) {
          console.log("---unable to clear coupon after order place---", error);
        }

        setShowModal && setShowModal(true);
      } catch (error) {
        console.log("----Something went wrong with placing Order--- ", error);
      }
    }
  };

  return (
    <div id="price" className="right-body">
      <ModernAlertModal
        isOpen={alertModal.open}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() => setAlertModal({ ...alertModal, open: false })}
      />

      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onApplyCoupon={handleApplyCoupon}
      />

      {props.page === "Cart" ? (
        <div className="apply-coupon">
          <p>Coupon</p>
          <div>
            <div className="left-coupon-sec">
              <div className="coupon-icon">
                <i className="fa-solid fa-ticket"></i>
              </div>
              <div className="coupon-heading">
                <p>Apply Coupons</p>
              </div>
            </div>
            <div id="coupon-button" className="coupon-button">
              <button onClick={handleApplyCouponClick}>Apply</button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <hr />
      <div className="price-details">
        <h5>
          PRICE DETAILS ( <span>{priceDetails.itemCount}</span> item
          {priceDetails.itemCount !== 1 ? "s" : ""} )
        </h5>
        {props.page === "Cart" && selectedCoupon && (
          <div className="applied-coupon-badge">
            <span className="badge-text">✓ {selectedCoupon.code}</span>
            <button
              className="badge-remove"
              onClick={handleRemoveCoupon}
              title="Remove coupon"
            >
              ✕
            </button>
          </div>
        )}

        <div className="middle-sec-price">
          <div className="product-mrp">
            <span>Total MRP</span>
            <span>₹{priceDetails.totalMRP}</span>
          </div>
          <div className="product-discount">
            <span>Discount on MRP</span>
            <span className="PD-value">- ₹{priceDetails.totalDiscount}</span>
          </div>
          <div className="coupon-discount">
            <span>Coupon Discount</span>
            <span className="CD-value">
              {priceDetails.couponValue > 0 ? "- " : ""}₹
              {priceDetails.couponValue}
            </span>
          </div>
          <div className="platform-fees">
            <span>Platform fee </span>
            <span className="PF-value">Free</span>
          </div>
        </div>
        <hr />
        <div className="footer-price-sec">
          <div className="total-amount">
            <span>
              <h3>Total Amount </h3>
            </span>
            <span>₹{priceDetails.totalPrice}</span>
          </div>
          <div
            id="place-order"
            className="place-order-btn"
            onClick={handlePlaceOrder}
          >
            <h4>
              {props.page === "Cart"
                ? "Place Order"
                : props.page === "Address"
                ? "Proceed to Payment"
                : "Place Order"}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
