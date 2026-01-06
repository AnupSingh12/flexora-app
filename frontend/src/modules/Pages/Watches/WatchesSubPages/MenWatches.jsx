import Navbar from "../../../layout/navbar/navbar.jsx";
import Sidebar from "../../../layout/categoryComonents/sidebar/sidebar.jsx";
import Sidebody from "../../../layout/categoryComonents/sideBody/sidebody.jsx";
import Footer from "../../../layout/footer/footer.jsx";
import "../../CommonBase.css";
import "./MenWatches.css";

export default function MenWatches() {
  return (
    <>
      <Navbar />
      <main className="main-body">
        <Sidebar />
        <Sidebody addedClass="side-body-banner-for-Men-Watches" />
      </main>
      <Footer />
    </>
  );
}
