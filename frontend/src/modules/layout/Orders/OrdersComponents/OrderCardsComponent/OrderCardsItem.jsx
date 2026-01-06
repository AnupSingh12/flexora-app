export default function OrderItem({ item }) {
  const product = item.productId || item.product || {};
  const img = product.images?.[0] || item.image || product.image || "";
  const title = product.title || item.title || "Product";
  const brand = product.brand || item.brand || "";
  const size = item.size || product.size || "-";
  const qty = item.quantity || item.qty || 1;
  const price = product.price || item.price || item.pricePaid || 0;

  return (
    <div className="fx-order-item">
      {img ? (
        <img src={img} alt={title} />
      ) : (
        <div className="fx-placeholder-img" />
      )}

      <div className="fx-order-item-info">
        <h4>{brand}</h4>
        <p>{title}</p>
        <div className="fx-item-meta">
          <span>Size: {size}</span>
          <span>Qty: {qty}</span>
        </div>
        <p className="fx-item-price">₹{price}</p>
      </div>
    </div>
  );
}
