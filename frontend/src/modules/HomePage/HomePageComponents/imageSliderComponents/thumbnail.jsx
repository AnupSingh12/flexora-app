import { useEffect, useState } from "react";
import Card from "./thumbnailComponents/cards.jsx";
import "./thumbnail.css";

export default function Thumbnail() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("./thumbnailCardData.json");
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
      <div className="thumbnail">
        {data.map((card) => (
          <Card
            key={card.category}
            imgSrc={card.imgSrc}
            pageLink={card.pageLink}
            category={card.category}
          />
        ))}
      </div>
    </>
  );
}
