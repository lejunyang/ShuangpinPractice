import React from "react";
import { Input, Form, Tooltip, Switch, Row, Col } from "antd";
import { SentenceProps } from "./types";

const Settings = (props: SentenceProps) => {
  const { textState, form } = props;
  return (
    <Form form={form}>
      <Row>
        <Col span={11}>
          <Form.Item
            name="minLength"
            label="句子最小长度"
            initialValue={1}
            rules={[
              {
                type: "number"
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value < 1) return Promise.reject(new Error("‘最小长度’不能小于1"));
                  if (getFieldValue("maxLength") > value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("‘最小长度’需小于‘最大长度’"));
                }
              })
            ]}
            normalize={(val) => +`${val}`?.replace(/\D/g, "")}
          >
            <Input
              onPressEnter={() => {
                form
                  .validateFields()
                  .then((val) => {
                    textState.wordCurrentIndex = -1;
                  })
                  .catch((err) => {
                    console.error("err", err);
                  });
              }}
            />
          </Form.Item>
        </Col>
        <Col span={11} push={1}>
          <Form.Item
            name="maxLength"
            label="句子最大长度"
            initialValue={15}
            rules={[
              {
                type: "number"
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value > 50) return Promise.reject(new Error("最大长度不能超过50"));
                  if (getFieldValue("minLength") < value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("‘最大长度’需大于‘最小长度’"));
                }
              })
            ]}
            normalize={(val) => +`${val}`?.replace(/\D/g, "")}
          >
            <Input
              onPressEnter={() => {
                form
                  .validateFields()
                  .then((val) => {
                    textState.wordCurrentIndex = -1;
                  })
                  .catch((err) => {
                    console.error("err", err);
                  });
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item name="enableCounter" label="开启计数" initialValue={true} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="showKeyMap" label="展示键位图" initialValue={true} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="enableTooltip" label="开启悬浮提示" initialValue={false} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item name="enableTest" label="开启测试" initialValue={false} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="clearWhenError" label="错误时是否清空" initialValue={false} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="showTips" label="展示工具说明" initialValue={false} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Settings;
