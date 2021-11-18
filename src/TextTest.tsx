import React from "react";
import { Input, Form, Space } from "antd";
import { wordToPinyin, wordToShuangpin } from "./utils";

export default function TextTest() {
  const [form] = Form.useForm();
  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Form form={form}>
        <Form.Item name="input" normalize={(val) => val?.substring(0, 1)}>
          <Input
            addonBefore="输入测试"
            onChange={(e) => {
              form.setFieldsValue({
                pinyin: JSON.stringify(wordToPinyin(e.target.value)),
                shuangpin: wordToShuangpin(e.target.value)
              });
            }}
            placeholder="只支持一个字"
          />
        </Form.Item>
        <Form.Item name="pinyin">
          <Input addonBefore="拼音" />
        </Form.Item>
        <Form.Item name="shuangpin">
          <Input addonBefore="双拼" />
        </Form.Item>
      </Form>
    </Space>
  );
}
