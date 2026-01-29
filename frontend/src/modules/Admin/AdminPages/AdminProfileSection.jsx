import "./AdminProfileSection.css";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminDashboardComponents/AdminNavbar.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminProfileSection() {
  const [adminData, setAdminData] = useState([]);
  const initialData = {
    userName: "admin_user",
    password: "password123",
    email: "admin@example.com",
    contact: "+91 98765 43210",
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop",
  };

  const [profile, setProfile] = useState(initialData);
  const [form, setForm] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleEdit() {
    setForm(profile);
    setIsEditing(true);
  }

  function handleCancel() {
    setForm(profile);
    setIsEditing(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSave() {
    setShowConfirm(true);
  }

  function confirmSave() {
    setProfile(form);
    setIsEditing(false);
    setShowConfirm(false);
  }

  function cancelConfirm() {
    setShowConfirm(false);
  }

  async function getAdminData() {
    try {
      const res = await fetch(`${API_URL}/api/admin-data`, {
        method: "GET",
        credentials: "include",
      });

      const rawData = await res.json();
      console.log("----raw data ----", rawData);
    } catch (error) {
      console.log("Unable to get admin data error :", error);
    }
  }
  useEffect(() => {
    getAdminData();
  }, []);
  return (
    <>
      <AdminNavbar />
      <section className="aps-container">
        <div className="aps-card">
          <div className="aps-header">
            <h3 className="aps-title">Admin Profile</h3>
            {!isEditing && (
              <button className="aps-edit-btn" onClick={handleEdit}>
                Edit
              </button>
            )}
          </div>

          <div className="aps-body">
            <div className="aps-avatar-wrap">
              <img
                className="aps-avatar-lg"
                src={profile.avatar}
                alt="avatar"
              />
            </div>

            <div className="aps-fields">
              <div className="aps-field">
                <label className="aps-label">User Name</label>
                {isEditing ? (
                  <input
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    className="aps-input"
                  />
                ) : (
                  <div className="aps-value">{profile.userName}</div>
                )}
              </div>

              <div className="aps-field">
                <label className="aps-label">Password</label>
                {isEditing ? (
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="aps-input"
                  />
                ) : (
                  <div className="aps-value">{"•".repeat(8)}</div>
                )}
              </div>

              <div className="aps-field">
                <label className="aps-label">Email</label>
                <div className="aps-value aps-immutable">{profile.email}</div>
              </div>

              <div className="aps-field">
                <label className="aps-label">Contact</label>
                {isEditing ? (
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    className="aps-input"
                  />
                ) : (
                  <div className="aps-value">{profile.contact}</div>
                )}
              </div>

              <div className="aps-field">
                <label className="aps-label">Avatar</label>
                <div className="aps-value">
                  <img
                    className="aps-avatar-sm"
                    src={profile.avatar}
                    alt="avatar"
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="aps-actions">
              <button className="aps-btn aps-btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="aps-btn aps-btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>

        {showConfirm && (
          <div className="aps-confirm-overlay">
            <div className="aps-confirm">
              <p className="aps-confirm-txt">
                Are you sure you want to change the profile?
              </p>
              <div className="aps-confirm-actions">
                <button
                  className="aps-btn aps-btn-cancel"
                  onClick={cancelConfirm}
                >
                  No
                </button>
                <button
                  className="aps-btn aps-btn-primary"
                  onClick={confirmSave}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
