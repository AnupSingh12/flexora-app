import { useEffect } from "react";
import Slider from "./imageSliderComponents/slider.jsx";
import Thumbnail from "./imageSliderComponents/thumbnail.jsx";
import ArrowButtons from "./imageSliderComponents/arrowButton.jsx";
import "./imageSlider.css";

export default function ImageSlider() {
  useEffect(() => {
    const nextDom = document.getElementById("next");
    const prevDom = document.getElementById("prev");
    const carouselDom = document.querySelector(".carousel");
    const listItemDom = document.querySelector(".carousel .list");
    const thumbnailDom = document.querySelector(".carousel .thumbnail");

    const allItems = document.querySelectorAll(".carousel .list .item");
    if (allItems.length > 0) {
      allItems[0].classList.add("active");
    }

    const timeRunning = 2000;
    const timeAutoNext = 7000;
    let runTimeOut;
    let runNextAuto;

    const showSlider = (type) => {
      const SliderItems = document.querySelectorAll(".carousel .list .item");
      const thumbnailItems = document.querySelectorAll(
        ".carousel .thumbnail .item"
      );
      const currentActiveItem = document.querySelector(
        ".carousel .list .item.active"
      );

      if (SliderItems.length === 0) return;

      if (type === "next") {
        if (listItemDom && SliderItems[0])
          listItemDom.appendChild(SliderItems[0]);
        if (thumbnailDom && thumbnailItems.length > 0)
          thumbnailDom.appendChild(thumbnailItems[0]);
        if (carouselDom) carouselDom.classList.add("next");

        if (currentActiveItem) currentActiveItem.classList.remove("active");

        const newFirst = document.querySelectorAll(".carousel .list .item")[0];
        if (newFirst) newFirst.classList.add("active");
      } else {
        let positionLastItem = SliderItems.length - 1;
        if (listItemDom && SliderItems[positionLastItem])
          listItemDom.prepend(SliderItems[positionLastItem]);
        if (thumbnailDom && thumbnailItems.length > 0)
          thumbnailDom.prepend(thumbnailItems[positionLastItem]);
        if (carouselDom) carouselDom.classList.add("prev");

        if (currentActiveItem) currentActiveItem.classList.remove("active");

        const newFirst = document.querySelectorAll(".carousel .list .item")[0];
        if (newFirst) newFirst.classList.add("active");
      }

      clearTimeout(runTimeOut);
      runTimeOut = setTimeout(() => {
        if (carouselDom) {
          carouselDom.classList.remove("next");
          carouselDom.classList.remove("prev");
        }
      }, timeRunning);

      clearTimeout(runNextAuto);
      runNextAuto = setTimeout(() => {
        nextDom?.click();
      }, timeAutoNext);
    };

    const nextHandler = () => showSlider("next");
    const prevHandler = () => showSlider("prev");

    if (nextDom) nextDom.addEventListener("click", nextHandler);
    if (prevDom) prevDom.addEventListener("click", prevHandler);

    runNextAuto = setTimeout(() => {
      nextDom?.click();
    }, timeAutoNext);

    return () => {
      if (nextDom) nextDom.removeEventListener("click", nextHandler);
      if (prevDom) prevDom.removeEventListener("click", prevHandler);
      clearTimeout(runTimeOut);
      clearTimeout(runNextAuto);
    };
  }, []);

  return (
    <>
      <div className="image-slider">
        <div className="carousel">
          <Slider />
          <Thumbnail />
          <ArrowButtons />
        </div>
      </div>
    </>
  );
}
