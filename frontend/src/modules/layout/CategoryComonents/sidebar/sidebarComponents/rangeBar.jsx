import "./rangeBar.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleRange } from "../../../../../store/slices/productSlice.js";
import { useEffect, useRef } from "react";

export default function RangeBar() {
  const dispatch = useDispatch();
  const selectedRange = useSelector((state) => state.products.selectedRange);

  const sliderRef = useRef(null);

  function calValue(value) {
    const slider = sliderRef.current;
    if (!slider) return;

    const min = slider.min;
    const max = slider.max;

    const percentage = ((value - min) / (max - min)) * 100;

    slider.style.background = `linear-gradient(
      to right,
      #5e8ac6 ${percentage}%,
      #ebe9e7 ${percentage}%
    )`;
  }

  useEffect(() => {
    calValue(selectedRange || 50000);
  }, [selectedRange]);

  const handleRangeChange = (e) => {
    dispatch(toggleRange(Number(e.target.value)));
  };

  return (
    <div className="range-bar">
      <h4>Range</h4>

      <div className="range-section">
        <input
          ref={sliderRef}
          type="range"
          className="slider"
          min="1000"
          max="50000"
          value={selectedRange || 50000}
          onChange={handleRangeChange}
        />

        <div className="value">{selectedRange || 50000}</div>
      </div>
    </div>
  );
}
