import RelatedProductsCards from "./relatedProductsComponents/relatedProductsCards.jsx"
import "./relatedProducts.css"

export default function RelatedProducts(){
    return(
        <>
            <section className="lower-middle-section">
      <div className="lower-middle-section-part">
        <div className="container-for-body">
          <div className="lower-middle-body">
            <div className="title-bar-lms flex">
              <h2>❤ Products That you will fall for #Best Sellers</h2>
            </div>

            <div className="">
              <ul id="product-list" className="products card-section grid">
                <RelatedProductsCards/>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
        </>
    )
}