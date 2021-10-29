import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { decimalToHex } from "../Sections/Work";
import AddOption from "./AddOption";
import EditOption from "./EditOption";

const getTypes = () => [
  {
    config_type: "imageURL",
    value: true,
  },
  {
    config_type: "select",
    value: false,
  },
  {
    config_type: "color",
    value: false,
  },
];

export default function AddConfig({ setShow, configs, setConfigs }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cvar, setCvar] = useState("");
  const [hint_image, setHint_image] = useState("");
  const [defaultVar, setDefaultVar] = useState("");

  // ImageURL Specific
  const [raw_on_empty, setRaw_on_empty] = useState("");
  const [raw_on_fill, setRaw_on_fill] = useState("");

  // Select
  const [options, setOptions] = useState([]);
  const [focusOption, setFocusOption] = useState({});
  const [focusIndex, setFocusIndex] = useState(0);
  const [defaultOption, setDefaultOption] = useState("");
  const [showAddOption, setAddOption] = useState(false);
  const [showEditOption, setEditOption] = useState(false);

  // Color
  const [defaultColor, setDefaultColor] = useState("#FFFFFFFF");

  const [err, setErr] = useState(false);
  const [errMsg, setMsg] = useState("");

  const [types, setTypes] = useState(() => getTypes());

  const setNameState = (e) => {
    setName(e.target.value);
    const exists = configs.find((item) => item.title === e.target.value.trim());
    if (exists) {
      setErr(true);
      setMsg("Same config already exists");
    } else {
      setErr(false);
    }
  };

  const changeType = (e) => {
    setTypes(
      types.map((item) => {
        item.value = item.config_type === e.target.value ? true : false;
        return item;
      })
    );
  };

  const changeOption = (e) => {
    setDefaultOption(e.target.value);
  };

  const deleteOption = (curr) => {
    let reqIndex = 0;

    const gOptions = options.map((item) => item);
    gOptions.forEach((item, index) => {
      if (item.name === curr) {
        reqIndex = index;
      }
    });
    gOptions.splice(reqIndex, 1);

    // Handles Default option
    if (defaultOption === curr && gOptions.length > 0) {
      setDefaultOption(gOptions[0].name);
    }

    setOptions(gOptions);
  };

  const setColor = (e) => {
    const color = `${e.hex}${decimalToHex(e.rgb.a)}`;
    setDefaultColor(color);
  };

  const resetData = () => {
    setName("");
    setDescription("");
    setCvar("");
    setHint_image("");
    setDefaultVar("");
    setRaw_on_empty("");
    setRaw_on_fill("");
    setOptions([]);
    setFocusOption({});
    setFocusIndex(0);
    setDefaultOption("");
    setAddOption(false);
    setEditOption(false);
    setDefaultColor("#FFFFFFFF");
    setErr(false);
    setMsg("");
  };

  const getCurrType = () => types.find((item) => item.value).config_type;

  const configOK = () => {
    const config_type = getCurrType();

    if (cvar === "") {
      return false;
    }

    if (config_type === "select") {
      const dOption = options.find((option) => option.name === defaultOption);

      if (!(dOption && options.length > 1)) {
        return false;
      }
    }

    return true;
  };

  const addConfig = () => {
    const config_type = getCurrType();

    if (config_type === "select") {
      setConfigs([
        ...configs,
        {
          title: name,
          description,
          config_type: "select",
          var: cvar,
          default: defaultOption,
          hint_image,
          options,
        },
      ]);
    } else if (config_type === "imageURL") {
      setConfigs([
        ...configs,
        {
          title: name,
          description,
          config_type: "imageURL",
          var: cvar,
          default: defaultVar,

          hint_image,
          raw_value_on_empty: raw_on_empty,
          raw_value_on_fill: raw_on_fill,
        },
      ]);
    } else if (config_type === "color") {
      setConfigs([
        ...configs,
        {
          title: name,
          description,
          config_type: "color",
          var: cvar,
          default: defaultColor,
          hint_image,
        },
      ]);
    }

    resetData();
    setShow(false);
  };

  return (
    <>
      <div className="modal">
        <div className="container addcredit">
          <div className="modalHeader">
            <h4>Add config</h4>
            <i
              className="ri-close-line"
              onClick={() => {
                setShow(false);
              }}
            ></i>
          </div>

          <p className="head">Config Type</p>
          <div className="radioContainer">
            {types.map((item, id) => (
              <div key={id}>
                <input
                  id={`type${id}`}
                  type="radio"
                  name="configType"
                  value={item.config_type}
                  checked={item.value === true}
                  onChange={(e) => changeType(e)}
                />
                <label htmlFor={`type${id}`}>{item.config_type}</label>
              </div>
            ))}
          </div>

          <div className="scroller">
            <p className="head">Config Name</p>
            <input
              value={name}
              onChange={(e) => {
                setNameState(e);
              }}
              type="text"
              placeholder="Ex. Accent Color"
            />
            <p className={`modalStatus ${err ? "statusShow" : ""}`}>
              <i className="ri-error-warning-line"></i>
              {errMsg}
            </p>

            <p className="head">Description (Optional)</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder="A good description about the config"
            ></textarea>

            <p className="head">Hint image</p>
            <input
              value={hint_image}
              onChange={(e) => setHint_image(e.target.value)}
              type="text"
              placeholder="Image url"
            />
            <br></br>
            <br></br>

            <p className="head">Css Variable Name</p>
            <input
              value={cvar}
              onChange={(e) => {
                setCvar(e.target.value);
              }}
              type="text"
              placeholder="Ex. --accent-color"
            />
            <br></br>
            <br></br>

            {types.find(
              (item) => item.config_type === "imageURL" && item.value
            ) !== undefined && (
              <>
                <p className="head">Default value (optional)</p>
                <input
                  value={defaultVar}
                  onChange={(e) => setDefaultVar(e.target.value)}
                  type="text"
                  placeholder="Url"
                ></input>
                <br></br>
                <br></br>

                <p className="head">Raw value on empty (optional)</p>
                <input
                  value={raw_on_empty}
                  onChange={(e) => setRaw_on_empty(e.target.value.trim())}
                  type="text"
                  placeholder="ex. --acc-h: #fff; --acc-sub: #f4f;"
                ></input>
                <br></br>
                <br></br>

                <p className="head">Raw value on fill (optional)</p>
                <input
                  value={raw_on_fill}
                  onChange={(e) => setRaw_on_fill(e.target.value.trim())}
                  type="text"
                  placeholder="ex. --acc-h: #fff; --acc-sub: #f4f;"
                ></input>
              </>
            )}

            {types.find(
              (item) => item.config_type === "select" && item.value
            ) !== undefined && (
              <>
                {options.length > 0 && (
                  <>
                    <p className="head">Default option</p>
                    <div className="radioContainer">
                      {options.map((item, id) => (
                        <div key={id}>
                          <input
                            id={`option${id}`}
                            type="radio"
                            name="configOption"
                            value={item.name}
                            checked={item.name === defaultOption}
                            onChange={(e) => changeOption(e)}
                          />
                          <label htmlFor={`option${id}`}>{item.name}</label>
                        </div>
                      ))}
                    </div>

                    <p className="head">Options</p>
                    <div className="optionList">
                      {options.map((option, id) => (
                        <div className="optionItem" key={id}>
                          <div className="optionItemTitle">{option.name}</div>

                          <div className="optionItemActions">
                            <i
                              onClick={() => {
                                setFocusIndex(id);
                                setFocusOption(option);
                                setEditOption(true);
                              }}
                              className="ri-pencil-fill"
                            ></i>
                            <i
                              onClick={() => deleteOption(option.name)}
                              className="ri-delete-bin-line"
                            ></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <button onClick={() => setAddOption(true)}>
                  <i className="ri-menu-add-line"></i>Add{" "}
                  {options.length > 2 ? "More" : "Option"}
                </button>
              </>
            )}

            {types.find(
              (item) => item.config_type === "color" && item.value
            ) !== undefined && (
              <>
                <p className="head">Default color</p>
                <ChromePicker
                  color={defaultColor}
                  onChangeComplete={(e) => setColor(e)}
                />
              </>
            )}
          </div>

          <div className="modalBottomBar">
            <button onClick={resetData} className="reset">
              <i className="ri-restart-fill"></i>Reset
            </button>
            {!err && name !== "" && configOK() && (
              <button onClick={addConfig}>
                <i className="ri-add-box-fill"></i>Add Config
              </button>
            )}
          </div>
        </div>
      </div>
      {showAddOption && (
        <AddOption
          setShow={setAddOption}
          options={options}
          setOptions={setOptions}
          setDefaultOption={setDefaultOption}
        />
      )}
      {showEditOption && (
        <EditOption
          setShow={setEditOption}
          options={options}
          setOptions={setOptions}
          defaultOption={defaultOption}
          setDefaultOption={setDefaultOption}
          focusOption={focusOption}
          focusIndex={focusIndex}
        />
      )}
    </>
  );
}
