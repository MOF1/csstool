import React, { useState } from "react";

export default function EditOption({
  setShow,
  options,
  setOptions,
  defaultOption,
  setDefaultOption,
  focusOption,
  focusIndex,
}) {
  const [optionName, setOptionName] = useState(() => focusOption.name);
  const [value, setValue] = useState(() => focusOption.value);
  const [rawValue, setRawValue] = useState(() => focusOption.raw_value);

  const [err, setErr] = useState(false);
  const [errMsg, setMsg] = useState("");

  const setOptionState = (e) => {
    setOptionName(e.target.value);
    const exists = options.find((item, index) => {
      if (focusIndex !== index) {
        return (
          item.name.toLowerCase().trim() === e.target.value.toLowerCase().trim()
        );
      }
      return false;
    });
    if (exists) {
      setErr(true);
      setMsg("Same option already exists");
    } else {
      setErr(false);
    }
  };
  const editOption = () => {
    if (focusOption.name === defaultOption) {
      setDefaultOption(optionName.trim());
    }

    const nOptions = options.map((item, index) => {
      if (index === focusIndex) {
        item.name = optionName.trim();
        item.value = value.trim();
        item.raw_value = rawValue.trim();
      }
      return item;
    });

    setOptions(nOptions);
    resetData();
    setShow(false);
  };

  const resetData = () => {
    setOptionName(focusOption.name);
    setValue(focusOption.value);
    setRawValue(focusOption.raw_value);
    setErr(false);
    setMsg("");
  };

  return (
    <>
      <div className="modal">
        <div className="container addcredit">
          <div className="modalHeader">
            <h4>Edit option</h4>
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
              <button onClick={editOption}>
                <i className="ri-save-2-line"></i>Save
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
