import { pinyin } from "pinyin-pro";
import { KeyMap } from "./types";

const microsoftKeyMap: KeyMap = {
  q: { shengmu: "q", yunmu: ["iu"] },
  w: { shengmu: "w", yunmu: ["ia", "ua"] },
  e: { shengmu: null, yunmu: ["e"] },
  r: { shengmu: "r", yunmu: ["er", "uan"] },
  t: { shengmu: "t", yunmu: ["ue"] },
  y: { shengmu: "y", yunmu: ["uai", "ü"] }, // ü
  u: { shengmu: "sh", yunmu: ["iu", "u"] },
  i: { shengmu: "ch", yunmu: ["i"] },
  o: { shengmu: null, yunmu: ["uo", "o"] },
  p: { shengmu: "p", yunmu: ["un"] },
  a: { shengmu: null, yunmu: ["a"] },
  s: { shengmu: "s", yunmu: ["ong", "iong"] },
  d: { shengmu: "d", yunmu: ["uang", "iang"] },
  f: { shengmu: "f", yunmu: ["en"] },
  g: { shengmu: "g", yunmu: ["eng"] },
  h: { shengmu: "h", yunmu: ["ang"] },
  j: { shengmu: "j", yunmu: ["an"] },
  k: { shengmu: "k", yunmu: ["ao"] },
  l: { shengmu: "l", yunmu: ["ai"] },
  z: { shengmu: "z", yunmu: ["ei"] },
  x: { shengmu: "x", yunmu: ["ie"] },
  c: { shengmu: "c", yunmu: ["iao"] },
  v: { shengmu: "zh", yunmu: ["ui", "üe"] }, // ü
  b: { shengmu: "b", yunmu: ["ou"] },
  n: { shengmu: "n", yunmu: ["in"] },
  m: { shengmu: "m", yunmu: ["ian"] },
  ";": { shengmu: null, yunmu: ["ing"] }
};

const microsoftKeyReverseMap: {
  [key: string]: string;
} = {};
for (let key in microsoftKeyMap) {
  const shengmu = microsoftKeyMap[key].shengmu;
  if (shengmu) microsoftKeyReverseMap[shengmu] = key;
  microsoftKeyMap[key].yunmu.forEach((i) => {
    microsoftKeyReverseMap[i] = key;
  });
}

function isCh(char: string) {
  return char.match(/^[\u4e00-\u9fa5]$/);
}

function findNextChIndex(sentence: string, currentIndex: number) {
  for (let i = currentIndex + 1; i < sentence.length; i++) {
    if (isCh(sentence[i])) return i;
  }
  return sentence.length;
}

/**
 * 将一个汉字转为声母和韵母数组，包含其所有的多音字
 * @param input 输入内容。需为一个字符，否则只取第一个
 * @returns 返回一个数组，index 0为包含其所有声母的数组，index 1为其所有韵母的数组
 */
function wordToPinyin(input: string): string[][] {
  if (!input) return [[""], [""]];
  if (input.length > 1) input = input[0];
  return [
    pinyin(input, {
      pattern: "initial", // 只要声母
      toneType: "none", // 拼音不带声调
      multiple: true, // 获取多音字所有拼音
      type: "array"
    }),
    pinyin(input, {
      pattern: "final", // 只要韵母
      toneType: "none", // 拼音不带声调
      multiple: true, // 多音字
      type: "array"
    })
  ];
}

/**
 * 将一个汉字转为双拼数组，包含其所有的多音字
 * @param input 输入内容。需为一个字符，否则只取第一个
 * @returns 返回一个包含该汉字所有多音字的双拼字符串的数组
 */
function wordToShuangpin(input: string): string[] {
  if (!input) return [""];
  const _pinyin = wordToPinyin(input);
  let shuangpinArray = _pinyin[0].map(
    (shengmu, index) => (shengmu ? microsoftKeyReverseMap[shengmu] : "o") + microsoftKeyReverseMap[_pinyin[1][index]]
  );
  shuangpinArray = Array.from(new Set(shuangpinArray)); // 有一些多音字只是声调不同，而我们用不到声调，做一下去重
  return shuangpinArray;
}

function judgeOneWord(input: string, targetWord: string): boolean {
  if (input?.length === 2 && targetWord) {
    console.log("input", input, "target", wordToShuangpin(targetWord), wordToShuangpin(targetWord).includes(input));
    return wordToShuangpin(targetWord).includes(input);
  }
  return false;
}

export { microsoftKeyMap, isCh, findNextChIndex, wordToPinyin, wordToShuangpin, judgeOneWord };
