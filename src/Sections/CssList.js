import axios from "axios";
import React, { useEffect, useState } from "react";
import MinInfo from "./MinInfo";

export const getList = async () => {
  try {
    const url =
      "https://raw.githubusercontent.com/MOF1/krunker_css_configs/main/configs.json";
    const response = await axios.get(url, {
      params: {
        t: new Date().getTime(),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};
export default function CssList() {
  const [state, setState] = useState([]);

  useEffect(() => {
    getList().then((data) => {
      setState(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="list">
      {state.map((item, id) => (
        <MinInfo key={id} css={item.base} />
      ))}
    </div>
  );
}
