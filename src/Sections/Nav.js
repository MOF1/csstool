/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useLocation } from "react-router";
import About from "../Modals/About";
import "./Nav.css";

export default function Nav() {
  const location = useLocation();
  const [showAbout, setAbout] = useState(false);

  const openAbout = (e) => {
    e.preventDefault();
    setAbout(true);
  };

  return (
    <nav id="deskNav">
      <a href="https://MOF1.github.io">Home</a>
      {location.pathname !== "/" && <a href="/">CSS Tool</a>}

      <a
        href=""
        onClick={(e) => {
          openAbout(e);
        }}
      >
        About
      </a>
      {showAbout && <About setShow={setAbout} />}
    </nav>
  );
}
