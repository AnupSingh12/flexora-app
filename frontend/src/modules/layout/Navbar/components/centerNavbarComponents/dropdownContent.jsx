import { Link } from "react-router-dom";
import "./dropDownContent.css";
import { useState, useRef, useEffect } from "react";

export default function DropdownContent(props) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef(null);
  const idRef = useRef("cn-dd-" + Math.random().toString(36).slice(2, 9));

  useEffect(() => {
    function onOtherOpen(e) {
      if (!e.detail) return;
      if (e.detail.id !== idRef.current) setOpen(false);
    }
    window.addEventListener("cn-dropdown-open", onOtherOpen);
    return () => window.removeEventListener("cn-dropdown-open", onOtherOpen);
  }, []);

  const broadcastOpen = () => {
    window.dispatchEvent(
      new CustomEvent("cn-dropdown-open", { detail: { id: idRef.current } })
    );
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearCloseTimer();
    setOpen(true);
    broadcastOpen();
  };

  const handleMouseLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, 180);
  };

  const handleClick = (e) => {
    e.preventDefault();
    clearCloseTimer();
    const next = !open;
    setOpen(next);
    if (next) broadcastOpen();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div
      className={`cn-dropdown-wrapper ${open ? "cn-open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-haspopup="true"
      aria-expanded={open}
    >
      <button
        className="cn-dropbtn cn-font"
        onClick={handleClick}
        aria-controls={idRef.current}
        aria-expanded={open}
      >
        {props.title}
      </button>

      <div
        id={idRef.current}
        className="cn-dropdown-menu"
        role="menu"
        onMouseEnter={() => {
          clearCloseTimer();
          setOpen(true);
        }}
        onMouseLeave={handleMouseLeave}
      >
        <Link className="cn-dropdown-item" to={props.menPage} role="menuitem">
          Men
        </Link>
        <Link className="cn-dropdown-item" to={props.womenPage} role="menuitem">
          Women
        </Link>
      </div>
    </div>
  );
}
