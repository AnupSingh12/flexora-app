import { useState, useEffect } from "react";
import Navbar from "../../navbar/navbar.jsx";
import Footer from "../../footer/footer.jsx";
import DetailsContainer from "./productDetailComponents/productDetailsContainer.jsx";
import ReviewSection from "./productDetailComponents/ReviewSection.jsx";
import YouMayAlsoLike from "../youMayAlsoLikeSection/YouMayAlsoLike.jsx";
const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  // FIX 1: Set initial product state to null
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initializeProducts() {
      try {
        setLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        const mongoProducts = await res.json();

        const finalProduct = mongoProducts.data.find((sp) => sp._id === id);

        if (finalProduct) {
          setProduct(finalProduct);
        } else {
          throw new Error("Product not found.");
        }
      } catch (error) {
        console.error("Failed to initialize products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    initializeProducts();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "50px", textAlign: "center" }}>
          Loading product...
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "50px", textAlign: "center", color: "red" }}>
          Error: {error}
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "50px", textAlign: "center" }}>
          Sorry, we couldn't find that product.
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <DetailsContainer
        productId={product._id}
        MRP={product.price}
        brand={product.brand}
        category={product.category}
        color={product.color}
        description={product.description}
        discount={product.discountPercentage}
        gender={product.gender}
        id={product._id}
        imgSrc={product.thumbnail}
        images={product.images}
        sizes={product.sizes}
        price={
          product.price - product.price * (product.discountPercentage / 100)
        }
      />

      <ReviewSection productId={product._id} />
      <YouMayAlsoLike />
      <Footer />
    </>
  );
}
