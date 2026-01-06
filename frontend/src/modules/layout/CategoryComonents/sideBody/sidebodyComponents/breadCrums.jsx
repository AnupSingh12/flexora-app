import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BreadCrums() {
  const [breadcrum1, setBreadcrums1] = useState("");
  const [breadcrum2, setBreadcrums2] = useState("");

  useEffect(() => {
    const pathname = window.location.pathname.toLowerCase();
    const searchTerms = pathname.split("/").filter(Boolean);

    // Category
    const possibleCats = ["shoes", "clothes", "watches", "genz", "millennial"];
    const categoryKey = possibleCats.find((c) =>
      searchTerms.some((t) => t.includes(c))
    );

    setBreadcrums1(
      categoryKey
        ? categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)
        : ""
    );

    // Gender
    let genderValue = "";
    if (pathname.includes("women")) genderValue = "Female";
    else if (pathname.includes("men")) genderValue = "Male";

    setBreadcrums2(genderValue);
  }, []);

  return (
    <div className="breadcrum">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        {breadcrum1 && (
          <>
            <li>/</li>
            <li>
              <Link to={`/${breadcrum1}`}>{breadcrum1}</Link>
            </li>
          </>
        )}

        {breadcrum2 && (
          <>
            <li>/</li>
            <li>{breadcrum2}</li>
          </>
        )}
      </ul>
    </div>
  );
}
