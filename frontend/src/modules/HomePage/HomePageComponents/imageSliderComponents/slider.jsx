import { useState, useEffect } from "react";
import Item from "./sliderComponents/items.jsx";

export default function Slider() {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("./carouselItemData.json");
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        console.error("Failed to fetch items data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="list">
        {data.map((item, index) => (
          <Item
            key={index}
            isActive={index === activeIndex}
            description={item.description}
            menPage={item.menPage}
            womenPage={item.womenPage}
            category={item.category}
            imgSrc={item.imgSrc}
          />
        ))}
      </div>
    </>
  );
}
