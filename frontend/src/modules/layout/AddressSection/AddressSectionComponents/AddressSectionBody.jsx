import { useEffect, useState } from "react";
import AddressCard from "./AdddressCard.jsx";
import EditAddressForm from "./EditAddressForm.jsx";
import styles from "./AddressSectionBody.module.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function AddressSectionBody({ onAddressSelected }) {
  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  async function loadAddresses() {
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
  }
  useEffect(() => {
    loadAddresses();
  }, []);

  // Save default address when user selects one
  useEffect(() => {
    if (selectedIndex === null) return;

    const addr = addresses[selectedIndex];
    localStorage.setItem("defaultAddress", JSON.stringify(addr));
    if (onAddressSelected) onAddressSelected(addr);
  }, [selectedIndex]);

  // Remove address
  const handleRemove = (idx) => {
    const users = JSON.parse(localStorage.getItem("SignUpUser")) || [];
    const loggedUser = users.find((u) => u.UserLoggedIn === true);
    if (!loggedUser) return;

    loggedUser.addresses = loggedUser.addresses.filter((_, i) => i !== idx);
    localStorage.setItem("SignUpUser", JSON.stringify(users));

    setAddresses(loggedUser.addresses);

    if (idx === selectedIndex) setSelectedIndex(null);
  };

  // Save edited address
  const handleSave = (index, updated) => {
    const users = JSON.parse(localStorage.getItem("SignUpUser")) || [];
    const loggedUser = users.find((u) => u.UserLoggedIn === true);

    loggedUser.addresses[index] = updated;
    localStorage.setItem("SignUpUser", JSON.stringify(users));

    setAddresses([...loggedUser.addresses]);
    setEditingIndex(null);
  };

  return (
    <div className={styles.addrSectionWrapper}>
      <div className={styles.addrHeader}>
        <h3>Select Delivery Address</h3>
        <a href="/address">
          <button className={styles.addrAddBtn}>ADD NEW ADDRESS</button>
        </a>
      </div>

      <h4 className={styles.addrTitle}>Your Addresses</h4>

      <div className={styles.addrBody}>
        {addresses.length === 0 ? (
          <p>No addresses found. Please add one.</p>
        ) : (
          addresses.map((addr, idx) => (
            <div key={idx} className={styles.addrCardWrapper}>
              {editingIndex === idx ? (
                <EditAddressForm
                  index={idx}
                  initial={addr}
                  onSave={handleSave}
                  onCancel={() => setEditingIndex(null)}
                />
              ) : (
                <AddressCard
                  index={idx}
                  address={addr}
                  isSelected={idx === selectedIndex}
                  onSelect={() => setSelectedIndex(idx)}
                  onEdit={() => setEditingIndex(idx)}
                  onRemove={() => handleRemove(idx)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
