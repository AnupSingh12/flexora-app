import { useEffect, useState } from "react";
import "./Stocks.css";

const API_URL = import.meta.env.VITE_API_URL;
export default function Stocks() {
  const [productDetails, setProductDetails] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    images: "",
    thumbnail: "",
    brand: "",
    type: "",
    gender: "",
    mrp: "",
    discountPercentage: "",
    description: "",
    color: "",
    sizes: "",
    productType: "",
    sku: "",
    stock: "",
  });
  const [files, setFiles] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  async function getProductDetails() {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "GET",
        credentials: "include",
      });

      const rawData = await res.json();
      const productData = rawData.data;
      setProductDetails(productData);
    } catch (error) {
      console.log("Error while getting the items details :", error);
    }
  }

  useEffect(() => {
    getProductDetails();
  }, []);

  function openModal() {
    setMessage(null);
    setIsOpen(true);
    setIsEditMode(false);
    setEditingProductId(null);
  }

  function openEditModal(index) {
    const product = productDetails[index];
    setEditingProductId(product._id);
    setForm({
      title: product.title || "",
      brand: product.brand || "",
      category: product.category || "",
      gender: product.gender || "",
      mrp: product.price || "",
      discountPercentage: product.discountPercentage || "",
      description: product.description || "",
      color: product.color || "",
      sizes: (product.sizes || []).join(", "),
      productType: product.productType || "",
      sku: product.sku || "",
      stock: product.stock || "",
    });
    setFiles([]);
    setThumbnailFile(null);
    setMessage(null);
    setIsOpen(true);
    setIsEditMode(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingProductId(null);
    setIsEditMode(false);
  }

  function handleCategoryFilter(e) {
    setSelectedCategory(e.target.value);
  }

  function getFilteredProducts() {
    if (!selectedCategory) {
      return productDetails;
    }
    return productDetails.filter(
      (product) =>
        product.category?.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }

  function getUniqueCategories() {
    const categories = new Set(
      productDetails
        .map((product) => product.category)
        .filter((category) => category && category.trim() !== ""),
    );
    return Array.from(categories).sort();
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function onFileChange(e) {
    setFiles(Array.from(e.target.files || []));
  }

  function onThumbnailChange(e) {
    const file = e.target.files?.[0];
    setThumbnailFile(file || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let thumbnailUrl = "";

      if (thumbnailFile) {
        const thumbFd = new FormData();
        thumbFd.append("images", thumbnailFile);

        const thumbRes = await fetch(
          "http://localhost:3000/api/admin/upload-images",
          {
            method: "POST",
            credentials: "include",
            body: thumbFd,
          },
        );

        if (!thumbRes.ok) {
          const errTxt = await thumbRes.text();
          throw new Error(errTxt || "Thumbnail upload failed");
        }

        const thumbJson = await thumbRes.json();

        thumbnailUrl = thumbJson?.data?.images?.[0] || "";
      }

      let uploadedImages = [];

      if (files && files.length > 0) {
        const fd = new FormData();
        files.forEach((file) => fd.append("images", file));

        const uploadRes = await fetch(
          "http://localhost:3000/api/admin/upload-images",
          {
            method: "POST",
            credentials: "include",
            body: fd,
          },
        );

        if (!uploadRes.ok) {
          const errTxt = await uploadRes.text();
          throw new Error(errTxt || "Product image upload failed");
        }

        const uploadJson = await uploadRes.json();
        uploadedImages = uploadJson?.data?.images || [];
      }

      if (!thumbnailUrl && uploadedImages.length > 0) {
        thumbnailUrl = uploadedImages[0];
      }

      const payload = {
        title: form.title,
        brand: form.brand,
        category: form.category,
        gender: form.gender || "Unisex",
        description: form.description,
        price: Number(form.mrp) || 0,
        discountPercentage: Number(form.discountPercentage) || 0,
        stock: Number(form.stock) || 0,
        sku: form.sku,
        productType: form.productType,
        sizes: form.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        color: form.color,
      };

      // Only add images if they were updated
      if (thumbnailUrl) {
        payload.thumbnail = thumbnailUrl;
      }
      if (uploadedImages.length > 0) {
        payload.images = uploadedImages;
      }

      let res;
      if (isEditMode && editingProductId) {
        // UPDATE PRODUCT
        res = await fetch(
          `http://localhost:3000/api/admin/products/${editingProductId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );
      } else {
        // CREATE PRODUCT
        res = await fetch("http://localhost:3000/api/admin/products", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save product");
      }

      const successMsg = isEditMode
        ? "Product updated successfully"
        : "Product added successfully";
      setMessage({ type: "success", text: successMsg });

      // Refresh product list
      getProductDetails();

      setTimeout(() => {
        setForm({
          title: "",
          brand: "",
          category: "",
          gender: "",
          mrp: "",
          discountPercentage: "",
          description: "",
          color: "",
          sizes: "",
          productType: "",
          sku: "",
          stock: "",
        });
        setFiles([]);
        setThumbnailFile(null);
        setIsOpen(false);
        setEditingProductId(null);
        setIsEditMode(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section id="stock" className="adb-panel">
        <div className="adb-page-head">
          <h2>Items in Stock</h2>
          <p className="adb-text-muted">Manage inventory easily.</p>
        </div>

        <div className="adb-card">
          <div className="adb-card-actions">
            <select
              id="filterCategory"
              className="adb-input"
              value={selectedCategory}
              onChange={handleCategoryFilter}
            >
              <option value="">All categories</option>
              {getUniqueCategories().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button className="adb-btn" onClick={openModal} type="button">
              Add Item
            </button>
          </div>

          <table className="adb-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Title</th>
                <th>Category</th>
                <th>Stock</th>
                <th>MRP</th>
              </tr>
            </thead>

            <tbody>
              {getFilteredProducts().map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.sku}</td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.stock}</td>
                    <td>{item.price}</td>
                    <td>
                      <button
                        onClick={() => openEditModal(index)}
                        className="adb-btn adb-btn-small"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}

              {getFilteredProducts().length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No products found
                    {selectedCategory ? " in this category" : ""}
                  </td>
                </tr>
              )}

              <tr>
                <td>SH-101</td>
                <td>White Runner</td>
                <td>Shoes</td>
                <td>8</td>
                <td>₹3,199</td>
                <td>
                  <button className="adb-btn adb-btn-small">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal with CSS classes */}
        {isOpen && (
          <div className="adb-modal-overlay" onClick={closeModal}>
            <form
              className="adb-modal-form"
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
            >
              <h3>{isEditMode ? "Edit Product" : "Add New Product"}</h3>
              {message && (
                <div
                  className={`adb-modal-message ${
                    message.type === "error"
                      ? "adb-modal-message-error"
                      : "adb-modal-message-success"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="adb-modal-form-grid">
                <div className="adb-modal-field">
                  <label className="adb-modal-label">Brand *</label>
                  <input
                    type="text"
                    className="adb-modal-input"
                    name="brand"
                    value={form.brand}
                    onChange={onChange}
                    placeholder="e.g., Nike"
                    required
                  />
                </div>

                <div className="adb-modal-field">
                  <label className="adb-modal-label">SKU</label>
                  <input
                    type="text"
                    className="adb-modal-input"
                    name="sku"
                    value={form.sku}
                    onChange={onChange}
                    placeholder="Unique SKU (e.g., CL-001)"
                  />
                </div>
                <div className="adb-modal-field">
                  <label className="adb-modal-label">Product Type</label>
                  <input
                    type="text"
                    className="adb-modal-input"
                    name="productType"
                    value={form.productType}
                    onChange={onChange}
                    placeholder="Product Type (e.g., Trek , casual ,oversize)"
                  />
                </div>
                <div className="adb-modal-field">
                  <label className="adb-modal-label">Title</label>
                  <input
                    type="text"
                    className="adb-modal-input"
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    placeholder="Title (e.g., Nike Jordan Airmax)"
                  />
                </div>

                <div className="adb-modal-field">
                  <label className="adb-modal-label">Category</label>
                  <input
                    type="text"
                    className="adb-modal-input"
                    name="category"
                    value={form.category}
                    onChange={onChange}
                    placeholder="e.g., Clothes"
                  />
                </div>

                <div className="adb-modal-field">
                  <label className="adb-modal-label">Gender</label>
                  <input
                    type="text"
                    className="adb-modal-input"
                    name="gender"
                    value={form.gender}
                    onChange={onChange}
                    placeholder="e.g., Male"
                  />
                </div>

                <div className="adb-modal-field">
                  <label className="adb-modal-label">Color</label>
                  <input
                    type="text"
                    className="adb-modal-input"
                    name="color"
                    value={form.color}
                    onChange={onChange}
                    placeholder="e.g., Black"
                  />
                </div>

                <div className="adb-modal-field">
                  <label className="adb-modal-label">MRP (₹)</label>
                  <input
                    type="number"
                    className="adb-modal-input"
                    name="mrp"
                    value={form.mrp}
                    onChange={onChange}
                    placeholder="e.g., 499"
                  />
                </div>

                <div className="adb-modal-field">
                  <label className="adb-modal-label">
                    Discount Percentage{" "}
                  </label>
                  <input
                    type="number"
                    className="adb-modal-input"
                    name="discountPercentage"
                    value={form.discountPercentage}
                    onChange={onChange}
                    placeholder="Optional"
                  />
                </div>

                <div className="adb-modal-field">
                  <label className="adb-modal-label">Stock</label>
                  <input
                    type="number"
                    className="adb-modal-input"
                    name="stock"
                    value={form.stock}
                    onChange={onChange}
                    placeholder="e.g., 24"
                  />
                </div>

                <div className="adb-modal-field adb-modal-form-full">
                  <label className="adb-modal-label">Images</label>
                  <input
                    type="file"
                    className="adb-modal-input"
                    name="images"
                    onChange={onFileChange}
                    accept="image/*"
                    multiple
                  />
                </div>

                <div className="adb-modal-field adb-modal-form-full">
                  <label className="adb-modal-label">Thumbnail Image</label>
                  <input
                    type="file"
                    className="adb-modal-input"
                    name="thumbnail"
                    onChange={onThumbnailChange}
                    accept="image/*"
                  />
                  {thumbnailFile && (
                    <p
                      className="adb-modal-label"
                      style={{
                        fontSize: "12px",
                        marginTop: "4px",
                        color: "#666",
                      }}
                    >
                      Selected: {thumbnailFile.name}
                    </p>
                  )}
                </div>

                <div className="adb-modal-field adb-modal-form-full">
                  <label className="adb-modal-label">Sizes</label>
                  <input
                    type="text"
                    className="adb-modal-input"
                    name="sizes"
                    value={form.sizes}
                    onChange={onChange}
                    placeholder="Comma separated: S, M, L, XL"
                  />
                </div>

                <div className="adb-modal-field adb-modal-form-full">
                  <label className="adb-modal-label">Description</label>
                  <textarea
                    className="adb-modal-textarea"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    placeholder="Enter product description"
                  />
                </div>
              </div>

              <div className="adb-modal-buttons">
                <button
                  type="button"
                  className="adb-modal-btn"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adb-modal-btn adb-modal-btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? isEditMode
                      ? "Updating…"
                      : "Adding…"
                    : isEditMode
                      ? "Update Product"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </>
  );
}
