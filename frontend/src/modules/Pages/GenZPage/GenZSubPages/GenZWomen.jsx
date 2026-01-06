import Navbar from "../../../layout/navbar/navbar.jsx";
import Sidebar from "../../../layout/categoryComonents/sidebar/sidebar.jsx";
import Sidebody from "../../../layout/categoryComonents/sideBody/sidebody.jsx";
import Footer from "../../../layout/footer/footer.jsx";
import "../../CommonBase.css";
import "./GenZWomen.css";

export default function GenZWomen() {
  return (
    <>
      <Navbar />
      <main className="main-body">
        <Sidebar />
        <Sidebody addedClass="side-body-banner-for-Women-GenZ" />
      </main>
      <Footer />
    </>
  );
}
