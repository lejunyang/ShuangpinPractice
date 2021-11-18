import React from "react";
import { KeyProps } from "./types";

const Key = (props: KeyProps) => {
  const { keyCode, keyItem, isCurrentShengmu, isCurrentYunmu, yunmu } = props;
  const isJuanshe = ["sh", "ch", "zh"].includes(keyItem.shengmu);
  return (
    <div className={"keyboard-item" + (isCurrentShengmu || isCurrentYunmu ? " key-item-current" : "")}>
      <div className="shengmu">
        <div className={"key" + (isCurrentShengmu && !isJuanshe ? " word-current" : "")}>{keyCode?.toUpperCase()}</div>
        <div className={"juanshe" + (isCurrentShengmu && isJuanshe ? " word-current" : "")}>
          {
            // 两个空格加break-spaces占位置，以让左边key保持位置
            isJuanshe ? keyItem.shengmu : "  "
          }
        </div>
      </div>
      <div className="yunmu">
        {keyItem.yunmu.map((k) => (
          <div className={isCurrentYunmu && k === yunmu ? "word-current" : ""}>{k}</div>
        ))}
      </div>
    </div>
  );
};

export default Key;
