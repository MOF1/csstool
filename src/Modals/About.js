import React from "react";

export default function About({ setShow }) {
  return (
    <div className="modal">
      <div className="container">
        <div className="modalHeader">
          <h4>About</h4>
          <i
            className="ri-close-line"
            onClick={() => {
              setShow(false);
            }}
          ></i>
        </div>
        <h1>
          <i className="ri-pencil-ruler-2-line"></i>Krunker CSS Tool
        </h1>
        <p>
          This tool created for krunker css lovers who can customize their
          fevorite css without modifying the code.
        </p>

        <p className="head">v 0.1 ALPHA</p>
        <p>This tool currently in beta. More css support coming soon.</p>

        <p className="head">Credits</p>
        <p>
          <ul>
            <li>Team MOF1</li>
            <li>CSS Devs</li>
            <li>Krunker Community</li>
          </ul>
        </p>
      </div>
    </div>
  );
}
