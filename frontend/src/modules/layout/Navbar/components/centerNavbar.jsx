import DropdownContent from "./centerNavbarComponents/dropdownContent.jsx";
import "./centerNavbar.css";

export default function CenterNavbar() {
  return (
    <>
      {/* Unique id & class to scope styles and avoid cascading */}
      <div id="cn-center-navbar" className="cn-nav-center">
        <DropdownContent
          title="Footwear"
          menPage="/Shoes/MenShoes"
          womenPage="/Shoes/WomenShoes"
        />

        <DropdownContent
          title="Clothes"
          menPage="/Clothes/MenClothes"
          womenPage="/Clothes/WomenClothes"
        />

        <DropdownContent
          title="Watches"
          menPage="/Watches/MenWatches"
          womenPage="/Watches/WomenWatches"
        />

        <DropdownContent
          title="GenZ"
          menPage="/GenZ/GenZMen"
          womenPage="/GenZ/GenZWomen"
        />

        <DropdownContent
          title="Millennial"
          menPage="/Millennial/MillennialMen"
          womenPage="/Millennial/MillennialWomen"
        />
      </div>
    </>
  );
}
