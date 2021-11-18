import React, { useEffect, useRef } from "react";
import { Input, Form, Space } from "antd";
import { useReactive } from "ahooks";
import Settings from "./Settings";
import Sentence from "./Sentence";
import TextTest from "./TextTest";
import Keyboard from "./Keyboard";
import "./styles.less";
import { judgeOneWord, findNextChIndex } from "./utils";
import { TextState } from "./types";

export default function App() {
  const inputRef = useRef<Input>();
  const [form] = Form.useForm();
  const textState = useReactive<TextState>({
    input: "",
    inputValidateStatus: "",
    sentence: "",
    wordCurrentIndex: 0,
    wordLastIndex: -1,
    currentError: false,
    correctWordNum: 0,
    wrongWordNum: 0,
    completeSentenceNum: 0
  });
  const sentencesProps = {
    textState,
    form
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.input.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          textState.input = "";
          textState.wordCurrentIndex = -1;
        }
      });
    }
  }, []);
  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Settings {...sentencesProps} />
      <Sentence {...sentencesProps} />
      <div style={{ textAlign: "center" }}>
        <Form.Item validateStatus={textState.inputValidateStatus}>
          <Input
            size="large"
            value={textState.input}
            addonBefore="输入"
            ref={inputRef}
            onChange={(e) => {
              const input = e.target.value
                ?.replace(/[^A-Za-z;]/g, "")
                .substring(0, 2)
                .toLowerCase();
              textState.input = input;
              const { sentence, wordCurrentIndex } = textState;
              if (input?.length === 2) {
                // console.log("update wordCurrentIndex", wordCurrentIndex, "wordLastIndex", wordLastIndex);
                if (judgeOneWord(input, sentence[wordCurrentIndex])) {
                  textState.inputValidateStatus = "success";
                  setTimeout(() => (textState.input = ""), 100); // 一段时候后再清空，以让人看清第二个字符输了进去
                  // 需要直接在textState的对象上更改，不可解构
                  textState.wordCurrentIndex = findNextChIndex(sentence, wordCurrentIndex);
                  textState.currentError = false;
                  textState.correctWordNum++;
                } else {
                  textState.inputValidateStatus = "error";
                  textState.currentError = true;
                  textState.wrongWordNum++;
                  if (form.getFieldValue("clearWhenError")) textState.input = "";
                }
              }
            }}
            onPressEnter={() => {
              textState.inputValidateStatus = "";
              textState.currentError = false;
              textState.wordCurrentIndex = findNextChIndex(textState.sentence, textState.wordCurrentIndex);
            }}
            style={{ width: 400 }}
          />
        </Form.Item>
      </div>

      {/* 没有Provider两个FormItem在不同Form里面，即使是一个实例form，仍不更新 */}
      <Form.Provider>
        <Form form={form}>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("enableCounter") && (
                <Form.Item>
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <div>正确个数：{textState.correctWordNum}</div>
                    <div>错误次数：{textState.wrongWordNum}</div>
                    <div>完成的句子数：{textState.completeSentenceNum}</div>
                  </div>
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => getFieldValue("enableTest") && <TextTest />}
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              return (
                getFieldValue("showKeyMap") && (
                  <Form.Item>
                    <Keyboard textState={textState} />
                  </Form.Item>
                )
              );
            }}
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("showTips") && (
                <div className="tips">
                  {`在输入中输入当前文字的双拼， 当前文字会显示为蓝色，错误时显示为红色。
                    输入时，Enter跳过该汉字，Tab刷新句子
                    句子的长度设置，回车后生效，会立即请求新的句子
                    开启悬浮提示：鼠标悬浮到文字上显示该文字的双拼，会显示多音字的所有结果
                    开启计数：Enter跳过最后一个汉字时会认为是完成了一个句子，Tab不会
                    展示键位图：多音字时，键位图提示的按键拼音仅为可能的一种，此时答案不唯一
                    开启测试：展示测试表单，可以验证某个汉字的拼音和双拼是什么，拼音为声母和韵母数组
                    错误时是否清空：输入两个字母后，如果验证错误是否清空输入`}
                </div>
              )
            }
          </Form.Item>
        </Form>
      </Form.Provider>
    </Space>
  );
}
