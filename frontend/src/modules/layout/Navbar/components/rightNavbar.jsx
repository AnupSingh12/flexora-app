import { Link } from "react-router-dom";
import ProfileSection from "./rightNavbarComponents/profileSection.jsx";
import UserAccessButtons from "./rightNavbarComponents/userAccessButtons.jsx";
import "./rightNavbar.css";
import { useState, useEffect } from "react";
import { ApiError } from "../../../../../../backend/src/utils/ApiError.js";
import { useGlobalCounter } from "../../../../context/globalCounterContext.jsx";
const API_URL = import.meta.env.VITE_API_URL;
async function checkAuthStatus() {
  try {
    const res = await fetch("http://localhost:3000/users/status-check", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return data.isLoggedIn;
    }

    return false;
  } catch (error) {
    throw new ApiError(500, "Failed to check authentication status");
  }
}

export default function RightNavbar() {
  const [wishlistItemCount, setWishlsitItemCount] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [personLoggedIn, setPersonLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const { reloadCount } = useGlobalCounter();

  const loadStatus = async () => {
    setLoading(true);
    const isLoggedIn = await checkAuthStatus();
    setPersonLoggedIn(isLoggedIn);
    setLoading(false);
  };
  async function checkWishlistItemCount() {
    try {
      const res = await fetch(`${API_URL}/api/wishlist-products`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        const wishlistData = json.data?.items || [];
        const numberOfItems = wishlistData.length;
        setWishlsitItemCount(numberOfItems);
      }
    } catch (error) {
      console.log("Unable to get the data from the api", error);
    }
  }

  async function checkCartItemCount() {
    try {
      const res = await fetch(`${API_URL}/api/cart-products`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        const cartData = json.data?.items || [];
        const numberOfItems = cartData.length;
        setCartItemCount(numberOfItems);
      }
    } catch (error) {
      console.log(
        "Unable to get data from the API of count number of items from cart"
      );
    }
  }
  useEffect(() => {
    checkCartItemCount();
    checkWishlistItemCount();
    loadStatus();
  }, [reloadCount]);
  if (loading) {
    return (
      <div className="nav-right-sec">
        <div className="mobile" id="mobile">
          ☰
        </div>
      </div>
    );
  }

  // 5. DETERMINE WHICH SECTION TO SHOW based on state
  const toggleUserSection = personLoggedIn ? (
    <ProfileSection />
  ) : (
    <UserAccessButtons />
  );

  return (
    <>
      <div className="nav-right-sec">
        <div className="nav-right">
          <div className="search-bar-div">
            <input
              id="search-input"
              type="text"
              size="30"
              placeholder="Search...."
            />
            <button id="search-button">
              <i className="fa-solid fa-xl fa-magnifying-glass"></i>
            </button>
          </div>
          <div className="wishlist-icon">
            <Link id="wishlistIcon" to="/Wishlist">
              <i className="fa-solid fa-lg fa-heart"></i>
            </Link>
            <div className="count-wishlist-items">{wishlistItemCount}</div>
          </div>
          <div className="cart-icon">
            <Link id="addToCartIcon" to="/Cart">
              <i className="fa-solid fa-lg fa-cart-shopping"></i>
            </Link>
            <div className="count-cart-items">{cartItemCount}</div>
          </div>
          {/* Display ProfileSection or UserAccessButtons based on status */}
          {toggleUserSection}
        </div>
        <div className="mobile" id="mobile">
          ☰
        </div>
      </div>
    </>
  );
}
