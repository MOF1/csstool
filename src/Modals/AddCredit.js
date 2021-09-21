import React, { useState } from "react";
import "./AddCredit.css";
import AddLink from "./AddLink";

export default function AddCredit({ setShow, credits, setCredits }) {
  const [err, setErr] = useState(false);
  const [errMsg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [links, setLinks] = useState([]);
  const [showAddLink, setAddLink] = useState(false);

  const setNameState = (e) => {
    setName(e.target.value.trim());
    const exists = credits.find((item) => item.name === e.target.value.trim());
    if (exists) {
      setErr(true);
      setMsg("Same credit already exists");
    } else {
      setErr(false);
    }
  };

  const addCredit = () => {
    setCredits([...credits, { name, contacts: links }]);
    resetData();
    setShow(false);
  };

  const resetData = () => {
    setErr(false);
    setMsg("");
    setName("");
    setLinks([]);
  };

  return (
    <>
      <div className="modal">
        <div className="container addcredit">
          <div className="modalHeader">
            <h4>Add Credit</h4>
            <i
              className="ri-close-line"
              onClick={() => {
                setShow(false);
              }}
            ></i>
          </div>

          <p className="head">Name of credit</p>
          <input
            value={name}
            onChange={(e) => {
              setNameState(e);
            }}
            type="text"
            placeholder="Write here"
          />

          <p className={`modalStatus ${err ? "statusShow" : ""}`}>
            <i className="ri-error-warning-line"></i>
            {errMsg}
          </p>

          <p className="head">References / Links</p>

          <div className="linkLists">
            {links.map((link, index) => (
              <div className="linkItem" key={index}>
                <div className="linkName">{link.type}</div>
                <div className="linkItemActions">
                  <i className="ri-pencil-fill"></i>
                  <i className="ri-delete-bin-line"></i>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setAddLink(true)}>
            Add {links.length < 1 ? "Reference / Link" : "More"}
          </button>

          <div className="modalBottomBar">
            <button onClick={resetData} className="reset">
              <i className="ri-restart-fill"></i>Reset
            </button>
            {!err && name !== "" && (
              <button onClick={addCredit}>
                <i className="ri-add-box-fill"></i>Add Credit
              </button>
            )}
          </div>
        </div>
      </div>
      {showAddLink && (
        <AddLink setShow={setAddLink} links={links} setLinks={setLinks} />
      )}
    </>
  );
}
