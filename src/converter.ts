import { data } from "./data.ts";

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
function getToken(letter: string, code: number): Token {
  if (/\s/.test(letter)) return Token.Empty;
  else if (code >= 44032 && code <= 55203) return Token.CompleteHangul;
  else if (code >= 12593 && code <= 12643) return Token.NotCompleteHangul;
  else if (code >= 65 && code <= 90) return Token.EnglishUpper;
  else if (code >= 97 && code <= 122) return Token.EnglishLower;
  else if (code >= 48 && code <= 57) return Token.Number;
  else if (/[?!.^-]/.test(letter)) return Token.SpecialLetter;
  else return Token.Unknown;
}
function isInData(cho: number, jung: number, jong: number): boolean {
  if (jong != 0 && data.jong[jong] == "") return false;
  else if (jung >= 8 && jung != 20) return data.jung[jung - 8] != "";
  else return data.cj[Math.min(8, jung)][cho] != "";
}
function seperateHan(han: number): SeperatedHan {
  return [(han - 44032) / 28 / 21 | 0, (han - 44032) / 28 % 21 | 0, (han - 44032) % 28];
}

export function convert(input: string) {
  return Array.from(input, (letter) => {
    const letterCode = letter.charCodeAt(0);
    const token = getToken(letter, letterCode);
    switch (token) {
      case Token.Empty: {
        return "";
      }
      case Token.CompleteHangul: {
        const [cho, jung, jong] = seperateHan(letterCode);
        if (!isInData(cho, jung, jong)) {
          return "";
        } else if (jung >= 8 && jung != 20) {
          return data.jong[jong] + data.jung[jung - 8] + data.cho[cho];
        }
        return data.jong[jong]! + data.cj[Math.min(8, jung)][cho];
      }
      case Token.NotCompleteHangul: {
        return data.han[letterCode - 12593];
      }
      case Token.EnglishUpper: {
        return data.englishUpper[letterCode - 65];
      }
      case Token.EnglishLower: {
        return data.englishLower[letterCode - 97];
      }
      case Token.Number: {
        return data.number[letterCode - 48];
      }
      case Token.SpecialLetter: {
        return data.special["?!.^-".indexOf(letter)];
      }
    }
    return "";
  }).join("\n")
}