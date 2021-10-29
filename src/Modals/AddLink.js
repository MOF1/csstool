import React, { useState } from "react";

export default function AddLink({ setShow, links, setLinks }) {
  const [err, setErr] = useState(false);
  const [errMsg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const setNameState = (e) => {
    setName(e.target.value.trim());
    const exists = links.find(
      (item) => item.contact_type === e.target.value.trim()
    );
    if (exists) {
      setErr(true);
      setMsg("Same reference already exists");
    } else {
      setErr(false);
    }
  };

  const addRefLink = () => {
    setLinks([...links, { contact_type: name, link: link }]);
    resetData();
    setShow(false);
  };

  const resetData = () => {
    setErr(false);
    setMsg("");
    setName("");
    setLink("");
  };

  return (
    <>
      <div className="modal">
        <div className="container addcredit">
          <div className="modalHeader">
            <h4>Add Reference / Link</h4>
            <i
              className="ri-close-line"
              onClick={() => {
                setShow(false);
              }}
            ></i>
          </div>

          <p className="head">Type of reference</p>
          <input
            value={name}
            onChange={(e) => {
              setNameState(e);
            }}
            type="text"
            placeholder="Ex. Github, Discord, Youtube"
          />
          <p className={`modalStatus ${err ? "statusShow" : ""}`}>
            <i className="ri-error-warning-line"></i>
            {errMsg}
          </p>

          <p className="head">Link (URL)</p>
          <input
            value={link}
            onChange={(e) => {
              setLink(e.target.value.trim());
            }}
            type="text"
            placeholder="Ex. https://google.co.in"
          />

          <div className="modalBottomBar">
            <button onClick={resetData} className="reset">
              <i className="ri-restart-fill"></i>Reset
            </button>
            {!err && name !== "" && link !== "" && (
              <button onClick={addRefLink}>
                <i className="ri-add-box-fill"></i>Add Reference
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
