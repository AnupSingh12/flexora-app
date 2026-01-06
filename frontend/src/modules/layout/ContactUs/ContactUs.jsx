import { useEffect, useState } from "react";
import "./ContactUs.css";
import Navbar from "../navbar/navbar.jsx";
import Footer from "../footer/footer.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ContactUs() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    subject: "",
    message: "",
  });

  useEffect(() => {
    getUserInfo();
    setFormData((prev) => ({
      ...prev,
      name: userData.name,
      email: userData.email,
    }));
  }, [userData]);

  async function getUserInfo() {
    try {
      const res = await fetch(`${API_URL}/users/user-info`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.log("Unable to get the user info error code :", res.status);
      }

      const rawData = await res.json();
      const userInfo = rawData.data;

      setUserData({
        name: userInfo.userName,
        email: userInfo.email,
      });
    } catch (error) {
      console.log("Unable to get the user Info", error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/contact-us`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccessMsg("Your message has been sent successfully ✨");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="fx-contact-container">
        <form className="fx-contact-card" onSubmit={handleSubmit}>
          <h2 className="fx-contact-title">Contact Us</h2>
          <p className="fx-contact-subtitle">
            We'd love to hear from you. Let's talk.
          </p>

          <div className="fx-contact-grid">
            <div className="fx-input-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder={userData.name}
                readOnly
              />
            </div>

            <div className="fx-input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder={userData.email}
                readOnly
              />
            </div>

            <div className="fx-input-group fx-full">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="fx-input-group fx-full">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows="4"
                required
              />
            </div>
          </div>

          {errorMsg && <p className="fx-error">{errorMsg}</p>}
          {successMsg && <p className="fx-success">{successMsg}</p>}

          <button className="fx-contact-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
