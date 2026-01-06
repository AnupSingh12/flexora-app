import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddressSection.css";
import PriceSection from "../Cart/CartComponents/CartPriceSection";

const API_URL = import.meta.env.VITE_API_URL;
export default function AddressSection() {
  const [addresses, setAddresses] = useState([]);
  const [price, setPrice] = useState({
    numberOfItems: 0,
    totalMRP: 0,
    totalDiscount: 0,
    totalPrice: 0,
  });
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    street: "",
    pincode: "",
    city: "",
    state: "",
    contactNumber: "",
    addressType: "",
    userName: "",
  });
  const [errors, setErrors] = useState({});
  const [editAddress, setEditAddress] = useState({
    houseNumber: "",
    street: "",
    pincode: "",
    city: "",
    state: "",
    contactNumber: "",
    addressType: "",
    userName: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [modalMsg, setModalMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;

    setNewAddress((prev) => ({ ...prev, [name]: value }));

    if (name === "pincode" && value.length === 6) {
      fetchCityState(value);
    }
  };
  const validateAddress = (address) => {
    const newErrors = {};
    if (!address.userName.trim()) newErrors.userName = "Name is required";

    if (!address.houseNumber.trim())
      newErrors.houseNumber = "House number is required";
    if (!address.street.trim()) newErrors.street = "Street is required";
    if (!/^[0-9]{6}$/.test(address.pincode))
      newErrors.pincode = "Pincode must be 6 digits";
    if (!/^[0-9]{10}$/.test(address.contactNumber))
      newErrors.contactNumber = "Contact number must be 10 digits";

    if (!address.addressType.trim())
      newErrors.addressType = "Please select address type";

    return newErrors;
  };

  const handleEditAddressChange = (e) => {
    const { name, value } = e.target;

    setEditAddress((prev) => ({ ...prev, [name]: value }));

    if (name === "pincode" && value.length === 6) {
      fetchCityStateEdit(value);
    }
  };

  const saveNewAddress = async (e) => {
    e.preventDefault();

    const validationErrors = validateAddress(newAddress);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // clear errors

    try {
      const res = await fetch(`${API_URL}/add-address`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      if (res.ok) {
        setShowAddModal(false);
        loadAddresses();
        openModal("New address added successfully!");
      }
    } catch (error) {
      console.log("Unable to call add-address API");
    }
  };

  // ---------------- LOAD ADDRESSES ----------------
  const loadAddresses = async () => {
    try {
      const res = await fetch(`${API_URL}/get-addresses`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        console.log("unable to get the addresses");
      }

      const data = await res.json();
      const addresses = data.addresses;
      setAddresses(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchCityState = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      const data = await response.json();

      if (
        data[0].Status === "Success" &&
        data[0].PostOffice &&
        data[0].PostOffice.length > 0
      ) {
        const postOffice = data[0].PostOffice[0];

        setNewAddress((prev) => ({
          ...prev,
          city: postOffice.Block || postOffice.District,
          state: postOffice.State,
        }));
      } else {
        console.log("Invalid pincode");
        setNewAddress((prev) => ({
          ...prev,
          city: "",
          state: "",
        }));
      }
    } catch (error) {
      console.log("Unable to fetch city & state");
    }
  };
  const fetchCityStateEdit = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      const data = await response.json();

      if (
        data[0].Status === "Success" &&
        data[0].PostOffice &&
        data[0].PostOffice.length > 0
      ) {
        const postOffice = data[0].PostOffice[0];

        setEditAddress((prev) => ({
          ...prev,
          city: postOffice.Block || postOffice.District,
          state: postOffice.State,
        }));
      } else {
        setEditAddress((prev) => ({
          ...prev,
          city: "",
          state: "",
        }));
      }
    } catch (error) {
      console.log("Unable to fetch city & state");
    }
  };

  const loadPrice = async () => {
    try {
      const res = await fetch(`${API_URL}/get-price`, {
        method: "POST",
        credentials: "include",
      });

      const Alldata = await res.json();
      const data = Alldata.data;
      setPrice(data);
    } catch (error) {
      console.log("Unable to get the price details ");
    }
  };

  const loadDiscountPrice = async () => {
    const res = JSON.parse(localStorage.getItem("CouponData"));
    const discountValue = res.discountAmount;
    setCouponDiscount(discountValue);
  };

  // ---------------- SHOW MODAL ----------------
  const openModal = (msg) => {
    setModalMsg(msg);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  // ---------------- REMOVE ADDRESS ----------------
  const removeAddress = async (index) => {
    try {
      const res = await fetch(`${API_URL}/remove-address/${index}`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log(
        "Unable to remove error something wrong with remove API calling "
      );
    }
    openModal("Address removed successfully!");

    loadAddresses();
  };

  // ---------------- SAVE EDITED ADDRESS ----------------
  const saveEdited = async (e, index) => {
    e.preventDefault();

    const validationErrors = validateAddress(editAddress);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await fetch(`${API_URL}/edit-address/${index}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAddress),
      });

      openModal("Address updated successfully!");
      setEditingIndex(null);
      loadAddresses();
    } catch (error) {
      console.log("Unable to update address");
    }
  };

  useEffect(() => {
    loadPrice();
    loadAddresses();
    loadDiscountPrice();
  }, []);

  return (
    <div className="da-wrapper">
      {/* ---------------- NAVBAR ---------------- */}
      <header className="da-navbar">
        <div className="da-navbar-left">
          <h1>Flexora</h1>
        </div>

        <div className="da-navbar-mid">
          <p>
            CART <span>/</span>
          </p>
          <p className="da-step-active">
            ADDRESS <span>/</span>
          </p>
          <p>PAYMENT</p>
        </div>

        <div className="da-navbar-right">
          <p>100% Secure</p>
        </div>
      </header>

      {/* ---------------- BODY ---------------- */}
      <div className="da-body">
        {/* LEFT SIDE */}
        <div className="da-left">
          <div className="da-add-top">
            <h3>Select Delivery Address</h3>
            <button
              className="da-add-btn"
              onClick={() => {
                setNewAddress({
                  houseNumber: "",
                  street: "",
                  pincode: "",
                  city: "",
                  state: "",
                  contactNumber: "",
                  addressType: "",
                  userName: "",
                });
                setErrors({});
                setShowAddModal(true);
              }}
            >
              ADD NEW ADDRESS
            </button>
          </div>

          <h4>Default Address</h4>

          {addresses.length === 0 ? <p>Please add an address.</p> : <></>}
          <div className="da-address-list">
            {addresses.map((address, i) => (
              <div key={i} className="da-address-card">
                <input
                  type="checkbox"
                  className="da-checkbox"
                  checked={selectedAddressIndex === i}
                  onChange={() => setSelectedAddressIndex(i)}
                />

                {editingIndex !== i ? (
                  <div className="da-address-content">
                    <div className="da-name-row">
                      <h4>{address.userName}</h4>
                      <p className="da-type">{address.addressType}</p>
                    </div>

                    <p>
                      {address.houseNumber}, {address.street}
                    </p>
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>

                    <p className="da-phone">Contact: {address.contactNumber}</p>

                    <div className="da-btn-row">
                      <button
                        onClick={() => removeAddress(i)}
                        className="da-remove"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => {
                          setEditAddress(addresses[i]);
                          setEditingIndex(i);
                        }}
                        className="da-edit"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  // EDIT FORM
                  <form
                    className="add-modal-form edit-form"
                    onSubmit={(e) => saveEdited(e, i)}
                  >
                    <div className="add-input-group">
                      <label>User Name</label>
                      <input
                        name="userName"
                        value={editAddress.userName}
                        onChange={handleEditAddressChange}
                        required
                      />
                      {errors.userName && (
                        <p className="error-text">{errors.userName}</p>
                      )}
                    </div>

                    <div className="add-input-group">
                      <label>House Number</label>
                      <input
                        name="houseNumber"
                        value={editAddress.houseNumber}
                        onChange={handleEditAddressChange}
                        required
                      />
                      {errors.houseNumber && (
                        <p className="error-text">{errors.houseNumber}</p>
                      )}
                    </div>

                    <div className="add-input-group">
                      <label>Street</label>
                      <input
                        name="street"
                        value={editAddress.street}
                        onChange={handleEditAddressChange}
                        required
                      />
                      {errors.street && (
                        <p className="error-text">{errors.street}</p>
                      )}
                    </div>

                    <div className="add-input-group">
                      <label>Pincode</label>
                      <input
                        name="pincode"
                        value={editAddress.pincode}
                        onChange={handleEditAddressChange}
                        maxLength="6"
                        required
                      />
                      {errors.pincode && (
                        <p className="error-text">{errors.pincode}</p>
                      )}
                    </div>

                    <div className="add-input-group">
                      <label>City</label>
                      <input name="city" value={editAddress.city} readOnly />
                    </div>

                    <div className="add-input-group">
                      <label>State</label>
                      <input name="state" value={editAddress.state} readOnly />
                    </div>

                    <div className="add-input-group">
                      <label>Contact Number</label>
                      <input
                        name="contactNumber"
                        value={editAddress.contactNumber}
                        onChange={handleEditAddressChange}
                        maxLength="10"
                        required
                      />
                      {errors.contactNumber && (
                        <p className="error-text">{errors.contactNumber}</p>
                      )}
                    </div>

                    <div className="add-input-group">
                      <label>Address Type</label>

                      <div className="type-toggle">
                        <button
                          type="button"
                          className={`type-btn ${
                            editAddress.addressType === "Home" ? "active" : ""
                          }`}
                          onClick={() =>
                            handleEditAddressChange({
                              target: { name: "addressType", value: "Home" },
                            })
                          }
                        >
                          Home
                        </button>

                        <button
                          type="button"
                          className={`type-btn ${
                            editAddress.addressType === "Office" ? "active" : ""
                          }`}
                          onClick={() =>
                            handleEditAddressChange({
                              target: { name: "addressType", value: "Office" },
                            })
                          }
                        >
                          Office
                        </button>
                      </div>

                      {errors.addressType && (
                        <p className="error-text">{errors.addressType}</p>
                      )}
                    </div>

                    <div className="add-modal-actions">
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => setEditingIndex(null)}
                      >
                        Cancel
                      </button>

                      <button type="submit" className="save-btn">
                        Update Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE PRICE DETAILS */}
        {/* RIGHT SIDE PRICE DETAILS */}
        <PriceSection
          page="Address"
          selectedAddressIndex={selectedAddressIndex}
          addresses={addresses}
          openModal={openModal}
        />
      </div>

      {/* ---------------- CUSTOM MODAL ---------------- */}
      {showModal && (
        <div className="da-modal-overlay" onClick={closeModal}>
          <div className="da-modal">
            <p>{modalMsg}</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}

      {/* ----------------------adddresses modal------------ */}
      {showAddModal && (
        <div className="da-modal-overlay add-modal-overlay">
          <div className="da-modal add-modal-container">
            <h2 className="add-modal-title">Add New Address</h2>

            <form className="add-modal-form" onSubmit={saveNewAddress}>
              <div className="add-input-group">
                <label>User Name</label>
                <input
                  name="userName"
                  value={newAddress.userName}
                  onChange={handleNewAddressChange}
                  placeholder="Enter your name"
                  required
                />
                {errors.userName && (
                  <p className="error-text">{errors.userName}</p>
                )}
              </div>

              <div className="add-input-group">
                <label>House Number</label>
                <input
                  name="houseNumber"
                  value={newAddress.houseNumber}
                  onChange={handleNewAddressChange}
                  placeholder="Enter house number"
                  required
                />
                {errors.houseNumber && (
                  <p className="error-text">{errors.houseNumber}</p>
                )}
              </div>

              <div className="add-input-group">
                <label>Street</label>
                <input
                  name="street"
                  value={newAddress.street}
                  onChange={handleNewAddressChange}
                  placeholder="Enter street"
                  required
                />
                {errors.street && <p className="error-text">{errors.street}</p>}
              </div>

              <div className="add-input-group">
                <label>Pincode</label>
                <input
                  name="pincode"
                  value={newAddress.pincode}
                  onChange={handleNewAddressChange}
                  maxLength="6"
                  placeholder="Enter pincode"
                  required
                />
                {errors.pincode && (
                  <p className="error-text">{errors.pincode}</p>
                )}
              </div>

              <div className="add-input-group">
                <label>City</label>
                <input name="city" value={newAddress.city} readOnly />
              </div>

              <div className="add-input-group">
                <label>State</label>
                <input name="state" value={newAddress.state} readOnly />
              </div>

              <div className="add-input-group">
                <label>Contact Number</label>
                <input
                  name="contactNumber"
                  value={newAddress.contactNumber}
                  onChange={handleNewAddressChange}
                  placeholder="Enter contact number"
                  maxLength="10"
                  required
                />
                {errors.contactNumber && (
                  <p className="error-text">{errors.contactNumber}</p>
                )}
              </div>

              <div className="add-input-group">
                <label>Address Type</label>

                <div className="type-toggle">
                  <button
                    type="button"
                    className={`type-btn ${
                      newAddress.addressType === "Home" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleNewAddressChange({
                        target: { name: "addressType", value: "Home" },
                      })
                    }
                  >
                    Home
                  </button>

                  <button
                    type="button"
                    className={`type-btn ${
                      newAddress.addressType === "Office" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleNewAddressChange({
                        target: { name: "addressType", value: "Office" },
                      })
                    }
                  >
                    Office
                  </button>
                </div>

                {errors.addressType && (
                  <p className="error-text">{errors.addressType}</p>
                )}
              </div>

              <div className="add-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
