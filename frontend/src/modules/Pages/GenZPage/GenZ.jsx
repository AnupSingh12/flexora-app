import Sidebar from "../../layout/categoryComonents/sidebar/sidebar.jsx";
import Sidebody from "../../layout/categoryComonents/sideBody/sidebody.jsx";
import Navbar from "../../layout/navbar/navbar.jsx";
import Footer from "../../layout/footer/footer.jsx";
import "../CommonBase.css";
import "./GenZ.css";

export default function GenZ() {
  return (
    <>
      <Navbar />
      <main className="main-body">
        <Sidebar />
        <Sidebody addedClass="side-body-banner-for-GenZ" />
      </main>
      <Footer />
    </>
  );
}
