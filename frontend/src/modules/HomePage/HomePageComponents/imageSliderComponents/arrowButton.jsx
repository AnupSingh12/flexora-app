import "./arrowButton.css"

export default function ArrowButtons(){
    return (
        <>
            <div className="arrow">
            <button id="prev">
              <i className="fi fi-rr-angle-small-left"></i>
            </button>
            <button id="next">
              <i className="fi fi-rr-angle-small-right"></i>
            </button>
          </div>
        </>
    )
}