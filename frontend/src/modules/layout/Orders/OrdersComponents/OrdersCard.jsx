import { useEffect, useState } from "react";
import OrderItem from "./OrderCardsComponent/orderCardsItem.jsx";

export default function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  // console.log("------order---", order);

  useEffect(() => {
    const isoDate =
      order.addedAt || order.createdAt || order.addedAt || order.createdAt;
    const formattedDate = new Date(isoDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setDate(formattedDate);
  }, []);
  return (
    <div className="fx-order-card">
      <div className="fx-order-header">
        <div>
          <p className="fx-order-id">Order #{order.orderId || order._id}</p>
          <span className="fx-order-date">Placed on {date}</span>
        </div>

        {/* <span className={`fx-order-status ${order.status.toLowerCase()}`}>
          {order.status}
        </span> */}
      </div>

      <div className="fx-order-preview">
        {Array.isArray(order.items) &&
          order.items.slice(0, 6).map((item, idx) => {
            const img =
              item.productId?.images?.[0] ||
              item.image ||
              item.productId?.image ||
              "";
            const alt = item.productId?.title || item.title || `product-${idx}`;
            return img ? <img key={idx} src={img} alt={alt} /> : null;
          })}
      </div>

      <div className="fx-order-footer">
        <p className="fx-order-price">
          ₹{order.totalAmountPaid || order.totalAmount || order.total || 0}
        </p>

        <button className="fx-order-btn" onClick={() => setOpen(!open)}>
          {open ? "Hide Details" : "View Details"}
        </button>
      </div>

      {open && (
        <div className="fx-order-details">
          {Array.isArray(order.items) &&
            order.items.map((item, idx) => (
              <OrderItem
                key={item.productId?._id || item.productId || idx}
                item={item}
              />
            ))}

          <div className="fx-order-meta">
            <p>
              <strong>Payment:</strong> {order.paymentMethod || "COD"}
            </p>
            <p>
              <strong>Delivery:</strong>{" "}
              {order.selectedAddress?.city ||
                order.address?.city ||
                order.selectedAddressId ||
                "N/A"}
              {order.selectedAddress?.state || order.address?.state
                ? ", " + (order.selectedAddress?.state || order.address?.state)
                : ""}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {order.orderStatus || order.status || "Order Placed"}
            </p>
            {order.couponUsed?.coupon?.code && (
              <p>
                <strong>Coupon:</strong> {order.couponUsed.coupon.code} (Saved ₹
                {order.couponUsed.discountAmount || 0})
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
