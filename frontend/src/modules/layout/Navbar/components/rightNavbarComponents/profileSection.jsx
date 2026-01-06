import { Link, useNavigate } from "react-router-dom";
import "./profileSection.css";
import { useState, useEffect, useRef } from "react";
import profileImage from "../../../../../assets/abcd.jpg";

export default function ProfileSection() {
  const navigate = useNavigate();
  const [name, setName] = useState("World");
  const [image, setImage] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        console.error("Logout failed");
        return;
      }
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log("error while calling API from frontend ", error);
    }
  };

  async function getUserDetails() {
    try {
      const res = await fetch("http://localhost:3000/users/user-info", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (error) {
      console.log("Unable to fetch data", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserDetails();
        if (data) {
          setName(data.data.userName);
          setImage(data.data.avatar);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="ps-wrapper">
      <div className="ps-container" ref={profileRef}>
        <div className="ps-avatar" onClick={toggleDropdown}>
          <img src={image} alt="Profile" />
        </div>

        <div className={`ps-dropdown ${isOpen ? "ps-open" : ""}`}>
          <div className="ps-header">
            <h4>Hello 👋</h4>
            <p>{name}</p>
          </div>

          <div className="ps-section">
            <Link to="/Orders" className="ps-link">
              Orders
            </Link>
            <Link to="/Wishlist" className="ps-link">
              Wishlist
            </Link>
            <Link to="/Cart" className="ps-link">
              Cart
            </Link>
            <Link to="/ContactUs" className="ps-link">
              Contact Us
            </Link>
          </div>

          <div className="ps-section">
            <Link to="/Edit-Profile" className="ps-link">
              Edit Profile
            </Link>
            <button onClick={handleLogout} className="ps-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
