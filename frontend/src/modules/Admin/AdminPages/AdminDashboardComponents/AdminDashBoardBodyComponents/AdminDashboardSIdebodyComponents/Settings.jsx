export default function Settings() {
  return (
    <>
      <section id="settings" className="adb-panel">
        <div className="adb-page-head">
          <h2>Settings</h2>
          <p className="adb-text-muted">General dashboard settings.</p>
        </div>

        <div className="adb-card">
          <label className="adb-text-muted">Store Name</label>
          <input className="adb-input" defaultValue="Flexora" />
          <button className="adb-btn adb-btn-mt">Save</button>
        </div>
      </section>
    </>
  );
}
