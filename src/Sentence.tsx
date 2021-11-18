import React, { useState, useEffect } from "react";
import { Form, Tooltip, Spin } from "antd";
import qs from "qs";
import { SentenceProps } from "./types";
import { wordToShuangpin, isCh } from "./utils";

const Sentence = (props: SentenceProps) => {
  const { textState, form } = props;
  const [spinning, setSpin] = useState(false);
  const { minLength, maxLength } = form.getFieldsValue();
  let { sentence, wordCurrentIndex, wordLastIndex, currentError } = textState;
  useEffect(() => {
    const needUpdate = wordCurrentIndex === -1 || wordCurrentIndex >= wordLastIndex;
    if (needUpdate) {
      setSpin(true);
      const param = qs.stringify({
        min_length: minLength,
        max_length: maxLength
      });
      if (wordCurrentIndex === wordLastIndex) textState.completeSentenceNum++;
      fetch("https://v1.hitokoto.cn" + (param ? `?${param}` : ""))
        .then((res) => {
          return res.json();
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          const res = "请求句子出现了一点问题";
          textState.sentence = res;
          textState.wordCurrentIndex = 0;
          textState.wordLastIndex = res.length;
          textState.currentError = false;
          setSpin(false);
        })
        .then((res) => {
          console.log("sentence", res?.hitokoto);
          textState.sentence = res?.hitokoto;
          textState.wordCurrentIndex = 0;
          textState.wordLastIndex = res?.hitokoto.length;
          textState.currentError = false;
          setSpin(false);
        });
    }
  }, [wordCurrentIndex, wordLastIndex, minLength, maxLength]);
  return (
    <Form form={form}>
      <Form.Item shouldUpdate>
        {({ getFieldValue }) => (
          <Spin spinning={spinning}>
            <div className="sentence-show">
              {(sentence ? [...sentence] : []).map((word, index) => {
                const key = `${word}${index}`;
                if (index === wordCurrentIndex)
                  return (
                    <Tooltip title={getFieldValue("enableTooltip") ? wordToShuangpin(word).toString() : null} placement="bottom">
                      <span className={`word-current ${currentError ? "error-word" : ""}`} key={key}>
                        {word}
                      </span>
                    </Tooltip>
                  );
                else
                  return (
                    <Tooltip title={getFieldValue("enableTooltip") && isCh(word) ? wordToShuangpin(word).toString() : null} placement="bottom">
                      <span key={key}>{word}</span>
                    </Tooltip>
                  );
              })}
            </div>
          </Spin>
        )}
      </Form.Item>
    </Form>
  );
};
export default Sentence;
