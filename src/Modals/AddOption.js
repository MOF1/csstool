import React, { useState } from "react";

export default function AddOption({
  setShow,
  options,
  setOptions,
  setDefaultOption,
}) {
  const [optionName, setOptionName] = useState("");
  const [value, setValue] = useState("");
  const [rawValue, setRawValue] = useState("");

  const [err, setErr] = useState(false);
  const [errMsg, setMsg] = useState("");

  const setOptionState = (e) => {
    setOptionName(e.target.value);
    const exists = options.find(
      (item) =>
        item.name.toLowerCase().trim() === e.target.value.toLowerCase().trim()
    );
    if (exists) {
      setErr(true);
      setMsg("Same option already exists");
    } else {
      setErr(false);
    }
  };
  const addOption = () => {
    if (options.length < 1) {
      setDefaultOption(optionName.trim());
    }
    setOptions([
      ...options,
      {
        name: optionName.trim(),
        value: value.trim(),
        raw_value: rawValue.trim(),
      },
    ]);
    resetData();
    setShow(false);
  };

  const resetData = () => {
    setOptionName("");
    setValue("");
    setRawValue("");
    setErr(false);
    setMsg("");
  };

  return (
    <>
      <div className="modal">
        <div className="container addcredit">
          <div className="modalHeader">
            <h4>Add option</h4>
            <i
              className="ri-close-line"
              onClick={() => {
                setShow(false);
              }}
            ></i>
          </div>

          <div className="scroller">
            <p className="head">Option Name</p>
            <input
              value={optionName}
              onChange={(e) => {
                setOptionState(e);
              }}
              type="text"
              placeholder="Ex. On, Off, etc"
            />
            <p className={`modalStatus ${err ? "statusShow" : ""}`}>
              <i className="ri-error-warning-line"></i>
              {errMsg}
            </p>

            <p className="head">Option Value</p>
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              type="text"
              placeholder="Ex. 1px, 1rem, 20%, calc(xx x xx), etc"
            />
            <br></br>
            <br></br>

            <p className="head">Raw Value (Optional)</p>
            <input
              value={rawValue}
              onChange={(e) => {
                setRawValue(e.target.value);
              }}
              type="text"
              placeholder="ex. --acc-h: #fff; --acc-sub: #f4f;"
            />
          </div>

          <div className="modalBottomBar">
            <button onClick={resetData} className="reset">
              <i className="ri-restart-fill"></i>Reset
            </button>
            {!err && optionName.trim() !== "" && value.trim() !== "" && (
              <button onClick={addOption}>
                <i className="ri-add-box-fill"></i>Add
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
