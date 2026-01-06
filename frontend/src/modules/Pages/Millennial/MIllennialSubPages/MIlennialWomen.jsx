import Navbar from "../../../layout/navbar/navbar.jsx";
import Sidebar from "../../../layout/categoryComonents/sidebar/sidebar.jsx";
import Sidebody from "../../../layout/categoryComonents/sideBody/sidebody.jsx";
import Footer from "../../../layout/footer/footer.jsx";
import "../../CommonBase.css";
import "./MIllennialWomen.css";

export default function MillennialWomen() {
  return (
    <>
      <Navbar />
      <main className="main-body">
        <Sidebar />
        <Sidebody addedClass="side-body-banner-for-Women-Millennial" />
      </main>
      <Footer />
    </>
  );
}
