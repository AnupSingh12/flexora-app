import { useState } from "react";
import "./Stocks.css";

export default function Coupon() {
  const [form, setForm] = useState({
    code: "",
    discountType: "flat",
    discountValue: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
    startDate: "",
    expiryDate: "",
    usageLimit: "1",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/admin/coupons", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Status ${res.status}`);
      }

      // success
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setForm({
        code: "",
        discountType: "flat",
        discountValue: "",
        minPurchaseAmount: "",
        maxDiscountAmount: "",
        startDate: "",
        expiryDate: "",
        usageLimit: "1",
        isActive: true,
      });
    } catch (err) {
      setError(err.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="coupons" className="adb-panel">
      {" "}
      <div className="adb-modal-form">
        <h3>Create Coupon</h3>

        {showSuccess && (
          <div className="adb-modal-overlay" style={{ pointerEvents: "none" }}>
            <div
              className="adb-modal-form"
              style={{ maxWidth: 320, textAlign: "center" }}
            >
              <div className="adb-modal-message adb-modal-message-success">
                Coupon created successfully
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="adb-modal-message adb-modal-message-error">
            {error}
          </div>
        )}

        <form className="adb-modal-form-grid" onSubmit={handleSubmit}>
          <div className="adb-modal-field">
            <label className="adb-modal-label">Code</label>
            <input
              name="code"
              className="adb-modal-input"
              value={form.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="adb-modal-field">
            <label className="adb-modal-label">Discount Type</label>
            <select
              name="discountType"
              className="adb-modal-input"
              value={form.discountType}
              onChange={handleChange}
            >
              <option value="flat">Flat</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          <div className="adb-modal-field">
            <label className="adb-modal-label">Discount Value</label>
            <input
              name="discountValue"
              type="number"
              className="adb-modal-input"
              value={form.discountValue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="adb-modal-field">
            <label className="adb-modal-label">Min Purchase Amount</label>
            <input
              name="minPurchaseAmount"
              type="number"
              className="adb-modal-input"
              value={form.minPurchaseAmount}
              onChange={handleChange}
            />
          </div>

          <div className="adb-modal-field">
            <label className="adb-modal-label">Max Discount Amount</label>
            <input
              name="maxDiscountAmount"
              type="number"
              className="adb-modal-input"
              value={form.maxDiscountAmount}
              onChange={handleChange}
            />
          </div>

          <div className="adb-modal-field">
            <label className="adb-modal-label">Start Date</label>
            <input
              name="startDate"
              type="date"
              className="adb-modal-input"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="adb-modal-field">
            <label className="adb-modal-label">Expiry Date</label>
            <input
              name="expiryDate"
              type="date"
              className="adb-modal-input"
              value={form.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="adb-modal-field">
            <label className="adb-modal-label">Usage Limit</label>
            <input
              name="usageLimit"
              type="number"
              className="adb-modal-input"
              value={form.usageLimit}
              onChange={handleChange}
            />
          </div>

          <div className="adb-modal-field adb-modal-form-full">
            <label className="adb-modal-label">Active</label>
            <input
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange}
            />
          </div>

          <div className="adb-modal-buttons adb-modal-form-full">
            <button
              type="button"
              className="adb-modal-btn"
              onClick={() =>
                setForm({
                  code: "",
                  discountType: "flat",
                  discountValue: "",
                  minPurchaseAmount: "",
                  maxDiscountAmount: "",
                  startDate: "",
                  expiryDate: "",
                  usageLimit: "1",
                  isActive: true,
                })
              }
            >
              Reset
            </button>
            <button
              type="submit"
              className="adb-modal-btn adb-modal-btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
