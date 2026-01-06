import Navbar from "../layout/navbar/navbar.jsx";
import Footer from "../layout/footer/footer.jsx";
import ImageSlider from "./HomePageComponents/imageSlider.jsx";
import CollectionsSection from "./HomePageComponents/collectionsSection.jsx";
import RelatedProducts from "./HomePageComponents/relatedProducts.jsx";
import CreativeSection from "./HomePageComponents/creativeSection.jsx";
export default function HomePage() {
  return (
    <>
      <Navbar />
      <ImageSlider />
      <CollectionsSection />
      <RelatedProducts />
      <CreativeSection />
      <Footer />
    </>
  );
}
