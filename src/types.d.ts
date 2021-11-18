import { FormInstance } from "antd";

export type TextState = {
  input: string;
  sentence: string;
  wordCurrentIndex: number;
  wordLastIndex: number;
  currentError: boolean;
  correctWordNum: number;
  wrongWordNum: number;
  completeSentenceNum: number;
  inputValidateStatus: "" | "error" | "success" | "warning" | "validating";
};

export type SentenceProps = {
  form: FormInstance;
  textState: TextState;
};

export type KeyItem = {
  shengmu: string | null;
  yunmu: string[];
};

export type KeyMap = {
  [key: string]: KeyItem;
};

export type KeyProps = {
  // key: string; key作为属性会是react组件的key。。
  keyCode: string;
  keyItem: KeyItem;
  isCurrentShengmu?: boolean;
  isCurrentYunmu?: boolean;
  yunmu?: string;
};
