import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { decimalToHex } from "../Sections/Work";
import AddOption from "./AddOption";
import EditOption from "./EditOption";

const getTypes = (type) => {
  const types = [
    {
      type: "imageURL",
      value: false,
    },
    {
      type: "select",
      value: false,
    },
    {
      type: "color",
      value: false,
    },
  ];

  return types.map((item) => {
    item.value = item.type === type;
    return item;
  });
};

const getInitial = (data, r = "") => {
  if (Array.isArray(r)) {
    return data ? JSON.parse(JSON.stringify(data)) : r;
  }
  return data ? data : r;
};

export default function EditConfig({
  setShow,
  configs,
  setConfigs,
  focusConfigIndex,
  focusConfig,
}) {
  const [name, setName] = useState(() => focusConfig.title);
  const [description, setDescription] = useState(() => focusConfig.description);
  const [cvar, setCvar] = useState(() => focusConfig.var);
  const [hint_image, setHint_image] = useState(() => focusConfig.hint_image);
  const [defaultVar, setDefaultVar] = useState(() => focusConfig.default);

  // ImageURL Specific
  const [raw_on_empty, setRaw_on_empty] = useState(() =>
    getInitial(focusConfig.raw_value_on_empty)
  );
  const [raw_on_fill, setRaw_on_fill] = useState(() =>
    getInitial(focusConfig.raw_value_on_fill)
  );

  // Select
  const [options, setOptions] = useState(() =>
    getInitial(focusConfig.options, [])
  );
  const [focusOption, setFocusOption] = useState({});
  const [focusIndex, setFocusIndex] = useState(0);
  const [defaultOption, setDefaultOption] = useState(() => focusConfig.default);
  const [showAddOption, setAddOption] = useState(false);
  const [showEditOption, setEditOption] = useState(false);

  // Color
  const [defaultColor, setDefaultColor] = useState(() => focusConfig.default);

  const [err, setErr] = useState(false);
  const [errMsg, setMsg] = useState("");

  const [types, setTypes] = useState(() => getTypes(focusConfig.type));

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
        item.value = item.type === e.target.value ? true : false;
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
    setFocusOption({});
    setFocusIndex(0);
    setAddOption(false);
    setEditOption(false);
    setDefaultColor(focusConfig.default);
    setErr(false);
    setMsg("");
    setName(focusConfig.title);
    setDescription(focusConfig.description);
    setHint_image(focusConfig.hint_image);
    setDefaultVar(focusConfig.default);
    setRaw_on_empty(getInitial(focusConfig.raw_value_on_empty));
    setRaw_on_fill(getInitial(focusConfig.raw_value_on_fill));
    setOptions(getInitial(focusConfig.options, []));
    setDefaultOption(focusConfig.default);
    setTypes(getTypes(focusConfig.type));
    setCvar(focusConfig.var);
  };

  const getCurrType = () => types.find((item) => item.value).type;

  const configOK = () => {
    const type = getCurrType();

    if (cvar === "") {
      return false;
    }

    if (type === "select") {
      const dOption = options.find((option) => option.name === defaultOption);

      if (!(dOption && options.length > 1)) {
        return false;
      }
    }

    return true;
  };

  const addConfig = () => {
    const type = getCurrType();

    if (type === "select") {
      setConfigs([
        ...configs,
        {
          title: name,
          description,
          type: "select",
          var: cvar,
          default: defaultOption,
          hint_image,
          options,
        },
      ]);
    } else if (type === "imageURL") {
      setConfigs([
        ...configs,
        {
          title: name,
          description,
          type: "imageURL",
          var: cvar,
          default: defaultVar,
          hint_image,
          raw_value_on_empty: raw_on_empty,
          raw_value_on_fill: raw_on_fill,
        },
      ]);
    } else if (type === "color") {
      setConfigs([
        ...configs,
        {
          title: name,
          description,
          type: "color",
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
            <h4>Edit config</h4>
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
                  value={item.type}
                  checked={item.value === true}
                  onChange={(e) => changeType(e)}
                />
                <label htmlFor={`type${id}`}>{item.type}</label>
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

            {types.find((item) => item.type === "imageURL" && item.value) !==
              undefined && (
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

            {types.find((item) => item.type === "select" && item.value) !==
              undefined && (
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

            {types.find((item) => item.type === "color" && item.value) !==
              undefined && (
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
                <i className="ri-save-2-line"></i>Save
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
