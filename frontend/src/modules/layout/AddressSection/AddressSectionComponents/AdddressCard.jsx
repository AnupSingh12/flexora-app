import styles from "./AddressCard.module.css";

export default function AddressCard({
  address,
  index,
  isSelected,
  onSelect,
  onEdit,
  onRemove,
}) {
  return (
    <div className={styles.cardWrapper}>
      <input
        type="radio"
        name="selectedAddress"
        checked={isSelected}
        onChange={onSelect}
        className={styles.cardRadio}
      />

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h4>{address.name}</h4>
          <span className={styles.cardType}>{address.type}</span>
        </div>

        <p>
          {address.houseDetails}, {address.locality}
        </p>
        <p>
          {address.city}, {address.State} - {address.Pincode}
        </p>

        <p className={styles.cardContact}>
          Contact Number: <span>{address.mobileNumber}</span>
        </p>

        <div className={styles.cardButtons}>
          <button onClick={onRemove} className={styles.removeBtn}>
            Remove
          </button>
          <button onClick={onEdit} className={styles.editBtn}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
