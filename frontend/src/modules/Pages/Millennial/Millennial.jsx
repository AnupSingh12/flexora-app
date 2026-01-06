import Sidebar from "../../layout/categoryComonents/sidebar/sidebar.jsx";
import Sidebody from "../../layout/categoryComonents/sideBody/sidebody.jsx";
import Navbar from "../../layout/navbar/navbar.jsx";
import Footer from "../../layout/footer/footer.jsx";
import "./Millennial.css";
import "../CommonBase.css";

export default function Millennial() {
  return (
    <>
      <Navbar />
      <main className="main-body">
        <Sidebar />
        <Sidebody addedClass="side-body-banner-for-Millennial" />
      </main>
      <Footer />
    </>
  );
}
