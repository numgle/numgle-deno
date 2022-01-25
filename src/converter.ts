import type { Data } from "./data.ts";

enum Token {
  Empty,
  CompleteHangul,
  NotCompleteHangul,
  EnglishUpper,
  EnglishLower,
  Number,
  SpecialLetter,
  Unknown,
}
type SeperatedHan = [number, number, number];
function getToken(letter: string, code: number, data: Data): Token {
  const range = data.range;
  if (/\s/.test(letter)) return Token.Empty;
  else if (
    code >= range.completeHangul.start && code <= range.completeHangul.end
  ) {
    return Token.CompleteHangul;
  } else if (
    code >= range.notCompleteHangul.start && code <= range.notCompleteHangul.end
  ) {
    return Token.NotCompleteHangul;
  } else if (code >= range.uppercase.start && code <= range.uppercase.end) {
    return Token.EnglishUpper;
  } else if (code >= range.lowercase.start && code <= range.lowercase.end) {
    return Token.EnglishLower;
  } else if (code >= range.number.start && code <= range.number.end) {
    return Token.Number;
  } else if (range.special.includes(code)) return Token.SpecialLetter;
  else return Token.Unknown;
}
function isInData(
  cho: number,
  jung: number,
  jong: number,
  data: Data,
): boolean {
  if (jong != 0 && data.jong[jong] == "") return false;
  else if (jung >= 8 && jung != 20) return data.jung[jung - 8] != "";
  else return data.cj[Math.min(8, jung)][cho] != "";
}
function seperateHan(han: number): SeperatedHan {
  return [
    (han - 44032) / 28 / 21 | 0,
    (han - 44032) / 28 % 21 | 0,
    (han - 44032) % 28,
  ];
}

export function convert(input: string, data: Data) {
  return Array.from(input, (letter) => {
    const letterCode = letter.charCodeAt(0);
    const token = getToken(letter, letterCode, data);
    switch (token) {
      case Token.Empty: {
        return "";
      }
      case Token.CompleteHangul: {
        const [cho, jung, jong] = seperateHan(letterCode);
        if (!isInData(cho, jung, jong, data)) {
          return "";
        } else if (jung >= 8 && jung != 20) {
          return data.jong[jong] + data.jung[jung - 8] + data.cho[cho];
        }
        return data.jong[jong]! + data.cj[Math.min(8, jung)][cho];
      }
      case Token.NotCompleteHangul: {
        const start = data.range.notCompleteHangul.start;
        return data.han[letterCode - start];
      }
      case Token.EnglishUpper: {
        const start = data.range.uppercase.start;
        return data.englishUpper[letterCode - start];
      }
      case Token.EnglishLower: {
        const start = data.range.lowercase.start;
        return data.englishLower[letterCode - start];
      }
      case Token.Number: {
        const start = data.range.number.start;
        return data.number[letterCode - start];
      }
      case Token.SpecialLetter: {
        return data.special[data.range.special.indexOf(letterCode)];
      }
    }
    return "";
  }).join("\n");
}
