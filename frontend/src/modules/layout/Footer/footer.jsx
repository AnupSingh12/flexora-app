import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-body container-for-body">
          <div className="footer-body-content grid">
            <div className="div-1st footer-card flex">
              <h1>Flexora</h1>
              <p>
                Flexora is your ultimate destination for trendy wearables from
                top brands. We bring you the latest in fashion with quality,
                style, and affordability in one place.
              </p>
            </div>
            <div className="footer-card flex">
              <h3>SHOPPING</h3>
              <Link to="/Clothes">Clothes</Link>
              <Link to="/Watches">Watches</Link>
              <Link to="/Shoes">Shoes</Link>
            </div>
            <div className="footer-card flex">
              <h3>HELP</h3>
              <Link to="/ContactUs">Contact Us</Link>
              <Link to="/Orders">Delivery</Link>
              <Link to="/PaymentInfo">Payment Methods</Link>
              <Link to="/ReturnAndExchange">Return & Exchange</Link>
            </div>
            <div className="footer-card flex">
              <h3>Who we Are ?</h3>
              <p>
                We're a passionate team redefining fashion retail. At Flexora,
                we connect trendsetters with premium clothes, shoes, and watches
                — all in one modern, easy-to-shop platform.
              </p>
            </div>
          </div>
        </div>
        <hr className="horizontal-rule" />
        <div className="flex last">
          <p>
            Copyright © All right reserved | This template is made with ❤ by
            CodeJi
          </p>
        </div>
      </footer>
    </>
  );
}
