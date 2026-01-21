import HomePage from "./modules/HomePage/HomePage.jsx";
import GenZ from "./modules/Pages/GenZPage/GenZ.jsx";
import Millennial from "./modules/Pages/Millennial/Millennial.jsx";
import Shoes from "./modules/Pages/ShoesPage/Shoes.jsx";
import Clothes from "./modules/Pages/Clothes/Clothes.jsx";
import Watches from "./modules/Pages/Watches/Watches.jsx";
import MenClothes from "./modules/Pages/Clothes/ClothesSubPages/MenClothes.jsx";
import WomenClothes from "./modules/Pages/Clothes/ClothesSubPages/WomenClothes.jsx";
import GenZMen from "./modules/Pages/GenZPage/GenZSubPages/GenZMen.jsx";
import GenZWomen from "./modules/Pages/GenZPage/GenZSubPages/GenZWomen.jsx";
import MillennialMen from "./modules/Pages/Millennial/MIllennialSubPages/MillennialMen.jsx";
import MillennialWomen from "./modules/Pages/Millennial/MIllennialSubPages/MIlennialWomen.jsx";
import MenShoes from "./modules/Pages/ShoesPage/ShoesSubPages/MenShoes.jsx";
import WomenShoes from "./modules/Pages/ShoesPage/ShoesSubPages/WomenShoes.jsx";
import MenWatches from "./modules/Pages/Watches/WatchesSubPages/MenWatches.jsx";
import WomenWatches from "./modules/Pages/Watches/WatchesSubPages/WomenWatches.jsx";
import ProductDetail from "./modules/layout/categoryComonents/productDetailsPage/ProductDetail.jsx";
import Wishlist from "./modules/layout/Wishlist/Wishlist.jsx";
import Cart from "./modules/layout/Cart/Cart.jsx";
import LoginPage from "./modules/layout/LoginPage/Login.jsx";
import SignUpPage from "./modules/layout/SignUpPage/SIgnUpPage.jsx";
import AdminLoginPage from "./modules/Admin/AdminLoginPage/AdminLogin.jsx";
import AdminSignup from "./modules/Admin/AdminSignUpPage/AdminSignup.jsx";
import AdminDashboard from "./modules/Admin/AdminPages/AdminDashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserData from "./modules/layout/UserData/UserData.jsx";
import AddressSection from "./modules/layout/AddressSection/AddressSection.jsx";
import PaymentPage from "./modules/layout/PaymentSection/PaymentPage.jsx";
import WomenSection from "./modules/Pages/Female/FemaleProducts.jsx";
import MenSection from "./modules/Pages/Male/MaleProducts.jsx";
import { Orders } from "./modules/layout/Orders/Orders.jsx";
import EditProfile from "./modules/layout/EditProfileSection/EditProfileSection.jsx";
import ContactUs from "./modules/layout/ContactUs/ContactUs.jsx";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/Women-Section" element={<WomenSection />}></Route>
          <Route path="/Men-Section" element={<MenSection />}></Route>
          <Route path="/GenZ" element={<GenZ />}></Route>
          <Route path="/Shoes" element={<Shoes />}></Route>
          <Route path="/Millennial" element={<Millennial />}></Route>
          <Route path="/Clothes" element={<Clothes />}></Route>
          <Route path="/Watches" element={<Watches />}></Route>
        </Routes>
        <Routes>
          <Route path="/Clothes/MenClothes" element={<MenClothes />}></Route>
          <Route
            path="/Clothes/WomenClothes"
            element={<WomenClothes />}
          ></Route>
          <Route path="/GenZ/GenZMen" element={<GenZMen />}></Route>
          <Route path="/GenZ/GenZWomen" element={<GenZWomen />}></Route>
          <Route
            path="/MIllennial/MillennialMen"
            element={<MillennialMen />}
          ></Route>
          <Route
            path="/Millennial/MillennialWomen"
            element={<MillennialWomen />}
          ></Route>
          <Route path="/Shoes/MenShoes" element={<MenShoes />}></Route>
          <Route path="/Shoes/WomenShoes" element={<WomenShoes />}></Route>
          <Route path="/Watches/MenWatches" element={<MenWatches />}></Route>
          <Route
            path="/Watches/WomenWatches"
            element={<WomenWatches />}
          ></Route>
        </Routes>
        <Routes>
          <Route path="/ProductDetail" element={<ProductDetail />}></Route>
          <Route path="/Wishlist" element={<Wishlist />}></Route>
          <Route path="/Cart" element={<Cart />}></Route>
        </Routes>
        <Routes>
          <Route path="/LogIn" element={<LoginPage />}></Route>
          <Route path="/SignUp" element={<SignUpPage />}></Route>
          <Route path="/AdminLogin" element={<AdminLoginPage />}></Route>
          <Route path="/auth/register" element={<AdminSignup />}></Route>
        </Routes>
        <Routes>
          <Route path="/AdminDashboard" element={<AdminDashboard />}></Route>
        </Routes>
        <Routes>
          <Route path="/UserData" element={<UserData />}></Route>
        </Routes>
        <Routes>
          <Route path="/Address-selection" element={<AddressSection />}></Route>
        </Routes>
        <Routes>
          <Route path="/Payment-page" element={<PaymentPage />}></Route>
        </Routes>
        <Routes>
          <Route path="/Orders" element={<Orders />}></Route>
          <Route path="/Edit-Profile" element={<EditProfile />}></Route>
          <Route path="/ContactUs" element={<ContactUs />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
