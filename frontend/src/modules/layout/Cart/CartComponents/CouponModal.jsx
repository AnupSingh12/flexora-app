import { useEffect, useState } from "react";
import "./CouponModal.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function CouponModal({ isOpen, onClose, onApplyCoupon }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchCoupons() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/coupons`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch coupons: ${res.status}`);
        }
        const json = await res.json();
        const couponData = json.data.coupons;
        const userUsedCoupons = json.data.userUsedCoupons;
        function getAvailableCoupons(couponData, userUsedCoupons) {
          return couponData.filter((coupon) => {
            const used = userUsedCoupons.find((u) => u.couponId === coupon._id);
            return !used || used.numberOfTimeUsed < coupon.usageLimit;
          });
        }

        const result = getAvailableCoupons(couponData, userUsedCoupons);
        console.log(result);
        setCoupons(result || []);
      } catch (err) {
        setError(err.message || "Failed to load coupons");
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCoupons();
  }, [isOpen]);

  const handleApply = async (coupon) => {
    try {
      if (onApplyCoupon) {
        onApplyCoupon(coupon);
      }
      setSelectedCoupon(coupon.code);
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (error) {
      console.log("-----coupon not valid for this amount ");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="coupon-modal-overlay" onClick={onClose}>
      <div
        className="coupon-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="coupon-modal-header">
          <h2>Available Coupons</h2>
          <button className="coupon-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="coupon-modal-body">
          {loading && <p className="coupon-loading">Loading coupons...</p>}
          {error && <p className="coupon-error">{error}</p>}

          {!loading && coupons.length === 0 && (
            <p className="coupon-no-coupons">No active coupons available</p>
          )}

          {!loading && coupons.length > 0 && (
            <div className="coupon-cards-grid">
              {coupons.map((coupon) => {
                const discountLabel =
                  coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : `₹${coupon.discountValue}`;

                const minText = coupon.minPurchaseAmount
                  ? ` on orders above ₹${coupon.minPurchaseAmount}`
                  : "";

                return (
                  <div
                    key={coupon._id}
                    className={`coupon-card ${
                      selectedCoupon === coupon.code ? "selected" : ""
                    }`}
                  >
                    <div className="coupon-card-badge">
                      <span className="coupon-discount">{discountLabel}</span>
                      <span className="coupon-type">
                        {coupon.discountType === "percentage" ? "OFF" : "FLAT"}
                      </span>
                    </div>

                    <div className="coupon-card-body">
                      <h3 className="coupon-code">{coupon.code}</h3>
                      <p className="coupon-description">
                        Get {discountLabel} discount{minText}
                      </p>
                      {coupon.maxDiscountAmount && (
                        <p className="coupon-max">
                          Max discount: ₹{coupon.maxDiscountAmount}
                        </p>
                      )}
                    </div>

                    <button
                      className="coupon-apply-btn"
                      onClick={() => handleApply(coupon)}
                    >
                      Apply
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
