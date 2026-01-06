import React, { useState } from "react";
import styles from "./EditAddressForm.module.css";

export default function EditAddressForm({ index, initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = (e) => {
    e.preventDefault();
    onSave(index, form);
  };

  return (
    <form className={styles.editForm} onSubmit={save}>
      {Object.keys(form).map((key) => (
        <div key={key} className={styles.editRow}>
          <label>{key}</label>
          <input name={key} value={form[key]} onChange={handleChange} />
        </div>
      ))}

      <div className={styles.btnRow}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.saveBtn}>
          Save
        </button>
      </div>
    </form>
  );
}
