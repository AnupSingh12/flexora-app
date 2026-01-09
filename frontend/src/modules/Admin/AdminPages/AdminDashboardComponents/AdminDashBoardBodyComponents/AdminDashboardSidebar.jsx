export default function AdminDashboardSidebar() {
  return (
    <>
      <aside id="adb-sidebar" className="adb-sidebar adb-sidebar-collapsed">
        <div className="adb-sidebar-inner">
          <div className="adb-sidebar-head">
            <h3>Admin Panel</h3>
          </div>

          <ul className="adb-nav">
            <li
              className="adb-nav-item adb-nav-item-active"
              data-target="dashboard"
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </li>

            <li className="adb-nav-item" data-target="customers">
              <i className="fas fa-users"></i>
              <span>Customers</span>
            </li>

            <li className="adb-nav-item" data-target="stock">
              <i className="fas fa-box"></i>
              <span>Items in Stock</span>
            </li>

            <li className="adb-nav-item" data-target="coupons">
              <i className="fas fa-ticket-alt"></i>
              <span>Coupon</span>
            </li>

            <li className="adb-nav-item" data-target="delivery">
              <i className="fas fa-truck"></i>
              <span>Delivery Status</span>
            </li>

            <li className="adb-nav-item" data-target="orders">
              <i className="fas fa-shopping-bag"></i>
              <span>Orders</span>
            </li>

            <li className="adb-nav-item" data-target="queries">
              <i className="fa-solid fa-clipboard-question"></i>
              <span>Queries</span>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
