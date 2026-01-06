import "./Wishlist.css";
import Navbar from "../navbar/navbar.jsx";
import Footer from "../footer/footer.jsx";
import WishlistItems from "./WishlistComponents/WishlistItems.jsx";

export default function Wishlist() {
  return (
    <>
      <Navbar />
      <WishlistItems />
      <Footer />
    </>
  );
}
