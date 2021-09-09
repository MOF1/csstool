import React from "react";
import { Link } from "react-router-dom";

const gotoHome = () => {
  const link = document.createElement("a");
  link.href = "https://MOF1.github.io";
  link.click();
};

export default function NotFound() {
  return (
    <div className="notfound">
      <i class="ri-emotion-sad-line"></i>
      <p className="nofTitle">CSS NOT FOUND</p>
      <p className="nofDesc">
        The page you are looking for is not exists. If there is any issue then
        ask whoever sends you this link
      </p>
      <div className="nofAction">
        <button onClick={gotoHome}>
          <i className="ri-arrow-go-back-line"></i>Go Back Home
        </button>

        <Link to="/" style={{ textDecoration: "none" }}>
          <button>
            <i className="ri-list-check"></i>CSS List
          </button>
        </Link>
      </div>
    </div>
  );
}
