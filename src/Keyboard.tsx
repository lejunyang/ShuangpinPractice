import React, { useMemo } from "react";
import Key from "./Key";
import { microsoftKeyMap } from "./utils";
import { TextState } from "./types";
import { wordToPinyin, wordToShuangpin } from "./utils";

const Keyboard = (props: { textState: TextState }) => {
  const keyborad = useMemo(
    () => [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
      ["z", "x", "c", "v", "b", "n", "m"]
    ],
    []
  );
  const { sentence, wordCurrentIndex } = props.textState;
  const shuangpin = wordToShuangpin(sentence[wordCurrentIndex])[0]; // 如果有多音只取第一个
  const yunmu = wordToPinyin(sentence[wordCurrentIndex])[1][0]; // 如果有多音只取第一个韵母
  return (
    <div className="keyboard">
      {keyborad.map((row) => (
        <div className="keyboard-row">
          {row.map((item) => {
            const keyProps = {
              keyCode: item,
              keyItem: microsoftKeyMap[item],
              isCurrentShengmu: shuangpin[0] === item,
              isCurrentYunmu: shuangpin[1] === item,
              yunmu: yunmu
            };
            return <Key {...keyProps} />;
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
