import { useState, useEffect } from "react";
import "./ReviewSection.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewSection(props) {
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([
    {
      userId: 1,
      userName: "Alex Johnson",
      rating: 5,
      comment: "Absolutely fantastic product. Premium quality!",
      images: [],
    },
  ]);

  const [reviewDetails, setReviewDetails] = useState({
    rating: "",
    comment: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setReviewDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    try {
      async function fetchReviews(productId = props.productId) {
        const res = await fetch(`${API_URL}/api/reviews`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({
            productId: productId,
          }),
        });

        const rawData = await res.json();
        const reviewsData = rawData.data;
        setReviews([...reviewsData]);
      }

      fetchReviews();
    } catch (error) {
      console.log("Unable to get Reviews", error);
    }
  }, []);

  async function submitReview(e) {
    e.preventDefault();
    const files = Array.from(e.target.images.files);
    console.log("----files----", files);

    let uploadedImages = [];

    if (files.length > 0) {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      const uploadRes = await fetch(
        "http://localhost:3000/api/user/upload-images",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        throw new Error("Image upload failed");
      }

      const uploadJson = await uploadRes.json();
      uploadedImages = uploadJson.data.images;
    }

    // ✅ 3. Send image URLs to MongoDB
    await fetch(`${API_URL}/api/add-review`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: props.productId,
        reviewDetails: {
          rating: Number(reviewDetails.rating),
          comment: reviewDetails.comment,
          images: uploadedImages,
        },
      }),
    });

    setShowModal(true);
    e.target.reset();
    setTimeout(() => setShowModal(false), 2000);
  }

  return (
    <section className="fx-review-root">
      <h2 className="fx-review-title">Customer Reviews</h2>

      {/* Review list */}
      <div className="fx-review-list">
        {reviews.map((r) => (
          <article className="fx-review-item" key={r.userId}>
            <header className="fx-review-header">
              <span className="fx-review-name">{r.userName}</span>
              <span className="fx-review-stars">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
            </header>

            <p className="fx-review-text">{r.comment}</p>

            {r.images?.length > 0 && (
              <div className="fx-review-imageGrid">
                {r.images.map((img, i) => (
                  <img key={i} src={img} alt="review" />
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Review form */}
      <form className="fx-review-form" onSubmit={submitReview}>
        <h3 className="fx-review-formTitle">Add Your Review</h3>

        <select
          name="rating"
          required
          className="fx-review-select"
          onChange={handleInputChange}
        >
          <option value="">Rating</option>
          <option value="5">★★★★★ Excellent</option>
          <option value="4">★★★★☆ Good</option>
          <option value="3">★★★☆☆ Average</option>
          <option value="2">★★☆☆☆ Poor</option>
          <option value="1">★☆☆☆☆ Bad</option>
        </select>

        <textarea
          name="comment"
          placeholder="Write your experience..."
          required
          className="fx-review-textarea"
          onChange={handleInputChange}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          name="images"
          className="fx-review-file"
        />

        <button className="fx-review-submit">SUBMIT REVIEW</button>
      </form>

      {/* Success modal */}
      {showModal && (
        <div className="fx-review-modalOverlay">
          <div className="fx-review-modal">
            <p>Review added successfully</p>
          </div>
        </div>
      )}
    </section>
  );
}
