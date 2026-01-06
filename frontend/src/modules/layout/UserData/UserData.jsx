import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserData.css";
import {
  UserIcon,
  PhoneIcon,
  RoadIcon,
  MapPinIcon,
  BuildingIcon,
  GlobeIcon,
  HomeIcon,
} from "./UserDataComponents/UserIcons";

export default function UserData() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    gender: "",
    houseNo: "",
    street: "",
    pincode: "",
    city: "",
    district: "",
    state: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  const clearAddressFields = () => {
    setFormData((prevData) => ({
      ...prevData,
      city: "",
      district: "",
      state: "",
    }));
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      pincode: pincode,
    }));

    // Clear old data and errors
    if (pincode.length !== 6) {
      clearAddressFields();
      setPincodeError("");
      return;
    }

    setIsFetchingPincode(true);
    setPincodeError("");

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setFormData((prevData) => ({
          ...prevData,
          city: postOffice.Block || postOffice.District,
          district: postOffice.District,
          state: postOffice.State,
        }));
      } else {
        setPincodeError("Invalid Pincode. Please check.");
        clearAddressFields();
      }
    } catch (error) {
      console.log("Failed to fetch pincode data:", error);
      setPincodeError("Failed to fetch pincode data.");
      clearAddressFields();
    } finally {
      setIsFetchingPincode(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  // Prefill from stored user (if any) and provide robust id detection
  useEffect(() => {
    try {
      const storedRaw = localStorage.getItem("flexoraUser");
      if (!storedRaw) return;
      const stored = JSON.parse(storedRaw);
      // If signup returned a userName or email, prefill name/contact when available
      if (stored) {
        setFormData((prev) => ({
          ...prev,
          name: stored.userName || stored.name || "",
          contact: stored.contactNumber || stored.contact || "",
        }));
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const handleSubmit = async function (e) {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/users/updateUser`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.name,
          gender: formData.gender,
          contactNumber: formData.contact,
          address: {
            houseNumber: formData.houseNo,
            street: formData.street,
            pincode: formData.pincode,
            city: formData.city,
            district: formData.district,
            state: formData.state,
            contactNumber: formData.contact,
            userName: formData.name,
          },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Failed to update user:", txt);
        throw new Error(txt || "Failed to update user");
      }
    } catch (error) {
      console.log(`Error While uploading Users Data`, error);
    }
    console.log("Form Data Submitted:", formData);
    setSuccessMessage("User data submitted successfully!");

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/");
    }, 1000);
  };

  return (
    <div className="user-data-container">
      <main className="main-content">
        <div className="form-wrapper">
          <div>
            <h2 className="form-title">User Information</h2>
            <p className="form-subtitle">Please fill in your details below.</p>
          </div>

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <form className="user-form" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="input-group">
              <label htmlFor="name" className="floating-label">
                Full Name
              </label>
              <div className="input-field-wrapper">
                <div className="icon-wrapper">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Name"
                  required
                />
              </div>
            </div>

            {/* Contact No. Field */}
            <div className="input-group">
              <label htmlFor="contact" className="floating-label">
                Contact No.
              </label>
              <div className="input-field-wrapper">
                <div className="icon-wrapper">
                  <PhoneIcon />
                </div>
                <input
                  type="tel"
                  name="contact"
                  id="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Contact"
                  required
                />
              </div>
            </div>

            {/* Gender Field */}
            <div className="input-group">
              <label className="gender-label">Gender</label>
              <fieldset className="gender-fieldset">
                <legend className="sr-only">Gender</legend>
                <div className="gender-options">
                  <div className="radio-option">
                    <input
                      id="gender-male"
                      name="gender"
                      type="radio"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                      className="radio-input"
                    />
                    <label htmlFor="gender-male" className="radio-label">
                      Male
                    </label>
                  </div>
                  <div className="radio-option">
                    <input
                      id="gender-female"
                      name="gender"
                      type="radio"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                      className="radio-input"
                    />
                    <label htmlFor="gender-female" className="radio-label">
                      Female
                    </label>
                  </div>
                  <div className="radio-option">
                    <input
                      id="gender-other"
                      name="gender"
                      type="radio"
                      value="other"
                      checked={formData.gender === "other"}
                      onChange={handleChange}
                      className="radio-input"
                    />
                    <label htmlFor="gender-other" className="radio-label">
                      Other
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            {/* --- Address Fields --- */}

            {/* House No Field */}
            <div className="input-group">
              <label htmlFor="houseNo" className="floating-label">
                House/Flat No.
              </label>
              <div className="input-field-wrapper">
                <div className="icon-wrapper">
                  <HomeIcon />
                </div>
                <input
                  type="text"
                  name="houseNo"
                  id="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="A-123"
                  required
                />
              </div>
            </div>

            {/* Street Field */}
            <div className="input-group">
              <label htmlFor="street" className="floating-label">
                Street/Area
              </label>
              <div className="input-field-wrapper">
                <div className="icon-wrapper">
                  <RoadIcon />
                </div>
                <input
                  type="text"
                  name="street"
                  id="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Main Street, Example Colony"
                  required
                />
              </div>
            </div>

            {/* Pincode Field */}
            <div className="input-group">
              <label htmlFor="pincode" className="floating-label">
                Pincode
              </label>
              <div className="pincode-wrapper">
                <div className="input-field-wrapper">
                  <div className="icon-wrapper">
                    <MapPinIcon />
                  </div>
                  <input
                    type="tel"
                    name="pincode"
                    id="pincode"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    className="input-field"
                    placeholder="Enter 6-digit Pincode"
                    required
                    maxLength="6"
                  />
                </div>
                {isFetchingPincode && (
                  <div className="pincode-loader" role="status">
                    ⏳
                  </div>
                )}
              </div>
              {pincodeError && (
                <div className="pincode-error" role="alert">
                  {pincodeError}
                </div>
              )}
            </div>

            {/* City Field (Auto-filled) */}
            <div className="input-group">
              <label htmlFor="city" className="floating-label">
                City
              </label>
              <div className="input-field-wrapper">
                <div className="icon-wrapper">
                  <BuildingIcon />
                </div>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  className="input-field"
                  placeholder="City (auto-filled)"
                  readOnly
                />
              </div>
            </div>

            {/* District Field (Auto-filled) */}
            <div className="input-group">
              <label htmlFor="district" className="floating-label">
                District
              </label>
              <div className="input-field-wrapper">
                <div className="icon-wrapper">
                  <BuildingIcon />
                </div>
                <input
                  type="text"
                  name="district"
                  id="district"
                  value={formData.district}
                  className="input-field"
                  placeholder="District (auto-filled)"
                  readOnly
                />
              </div>
            </div>

            {/* State Field (Auto-filled) */}
            <div className="input-group">
              <label htmlFor="state" className="floating-label">
                State
              </label>
              <div className="input-field-wrapper">
                <div className="icon-wrapper">
                  <GlobeIcon />
                </div>
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={formData.state}
                  className="input-field"
                  placeholder="State (auto-filled)"
                  readOnly
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="button-group">
              <button type="submit" className="submit-button">
                Submit Information
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="user-data-footer">
        <div className="user-data-footer-content">
          &copy; {new Date().getFullYear()} Flexora. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
