const raw = await Deno.readTextFile("./dataset/src/data.json");
type Range = { start: number, end: number };
type Data = {
  cho: string[],
  jong: string[],
  jung: string[],
  cj: string[][],
  han: string[],
  englishUpper: string[],
  englishLower: string[],
  number: string[],
  special: string[],
  range: {
    completeHangul: Range,
    notCompleteHangul: Range,
    uppercase: Range,
    lowercase: Range,
    number: Range,
    special: number[]
  }
}
export const data = JSON.parse(raw) as Data;
