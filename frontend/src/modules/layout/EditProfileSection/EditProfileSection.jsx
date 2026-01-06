import { useEffect, useState } from "react";
import "./EditProfileSection.css";
import Navbar from "../navbar/navbar.jsx";
import Footer from "../Footer/footer.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function EditProfile() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [profileData, setProfileData] = useState({
    userName: "",
    email: "",
    gender: "",
    contactNumber: "",
    avatar: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/users/api/v1/users/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setProfileData({
          userName: data.data.userName || "",
          email: data.data.email || "",
          gender: data.data.gender || "",
          contactNumber: data.data.contactNumber || "",
          avatar: data.data.avatar || "",
        });
      } catch (err) {
        setErrorMsg(err.message || "Failed to load profile");
      }
    }

    fetchProfile();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = { ...profileData };
      if (!payload.password) delete payload.password;

      const res = await fetch(`${API_URL}users/api/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccessMsg("Profile updated successfully");
      setProfileData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setErrorMsg(err.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="fx-edit-profile-container">
        <form className="fx-edit-profile-card" onSubmit={handleSubmit}>
          <h2 className="fx-title">Edit Profile</h2>
          <p className="fx-subtitle">Update your Flexora account details</p>

          <div className="fx-avatar-section">
            <img
              src={
                profileData.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="User Avatar"
              className="fx-avatar"
            />
          </div>

          <div className="fx-form-grid">
            <div className="fx-input-group">
              <label>Name</label>
              <input
                type="text"
                name="userName"
                value={profileData.userName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="fx-input-group">
              <label>Email</label>
              <input type="email" value={profileData.email} disabled />
            </div>

            <div className="fx-input-group">
              <label>Gender</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="fx-input-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={profileData.contactNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {errorMsg && <p className="fx-error">{errorMsg}</p>}
          {successMsg && <p className="fx-success">{successMsg}</p>}

          <button className="fx-save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
