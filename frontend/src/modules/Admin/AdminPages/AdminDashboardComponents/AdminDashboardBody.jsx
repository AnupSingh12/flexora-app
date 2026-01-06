import { useEffect } from "react";
import "./AdminDashboardBody.css";
import AdminDashboardSidebar from "./AdminDashBoardBodyComponents/AdminDashboardSidebar.jsx";
import AdminDashboardSidebody from "./AdminDashBoardBodyComponents/AdminDashboardSidebody.jsx";

export default function AdminDashboardBody() {
  useEffect(() => {
    const sidebar = document.getElementById("adb-sidebar");
    const navItems = Array.from(document.querySelectorAll(".adb-nav-item"));
    const panels = Array.from(document.querySelectorAll(".adb-panel"));
    const navbarToggle = document.getElementById("navbar-toggle");

    // PANEL SWITCH
    function showPanel(id) {
      panels.forEach((panel) => {
        panel.classList.toggle("adb-panel-active", panel.id === id);
      });

      navItems.forEach((item) => {
        item.classList.toggle(
          "adb-nav-item-active",
          item.dataset.target === id
        );
      });

      if (window.innerWidth < 1079) {
        sidebar.classList.add("adb-sidebar-collapsed");
      }
    }

    navItems.forEach((item) => {
      item.addEventListener("click", () => showPanel(item.dataset.target));
    });

    showPanel("dashboard");

    // SIDEBAR TOGGLE
    if (navbarToggle) {
      navbarToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebar.classList.toggle("adb-sidebar-collapsed");
      });
    }

    // LOAD CUSTOMERS TABLE
    function loadCustomers() {
      const container = document.getElementById("adb-customers");
      if (!container) return;

      const data = JSON.parse(localStorage.getItem("adminData")) || [];

      container.innerHTML = "";
      data.forEach((user, i) => {
        container.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${user.userName}</td>
            <td>${user.userEmail}</td>
            <td>+91 ${user.userContact}</td>
            <td>${user.userOrderDetails.length}</td>
            <td><button class="adb-btn adb-btn-small">View</button></td>
          </tr>
        `;
      });
    }

    // LOAD QUERIES TABLE
    function loadQueries() {
      const container = document.getElementById("adb-queries");
      if (!container) return;

      const data = JSON.parse(localStorage.getItem("adminQuerryData")) || [];

      container.innerHTML = "";
      data.forEach((q, i) => {
        container.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${q.customerName}</td>
            <td>${q.customerEmail}</td>
            <td><button class="adb-btn adb-btn-small">View</button></td>
          </tr>
        `;
      });
    }

    loadCustomers();
    loadQueries();
  }, []);

  return (
    <>
      <div className="adb-body">
        <div className="adb-main" role="main">
          <AdminDashboardSidebar />
          <AdminDashboardSidebody />
        </div>
      </div>
    </>
  );
}
