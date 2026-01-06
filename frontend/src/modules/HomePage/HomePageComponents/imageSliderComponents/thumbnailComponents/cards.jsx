import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./cards.css"


export default function Card(props){
    return(
        <>
            <Link to={props.pageLink}>
              <div className="item">
                <img
                  src={props.imgSrc}
                  loading="eager"
                  alt="footwear"
                />
                <div className="content">
                  <div className="category">{props.category}</div>
                </div>
              </div>
            </Link>
        </>
    )
}