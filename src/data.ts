const raw = await Deno.readTextFile("../dataset/src/data.json");
type Data = {
  cho: string[],
  jong: string[],
  jung: string[],
  cj: string[][],
  han: string[],
  englishUpper: string[],
  englishLower: string[],
  number: string[],
  special: string[]
}
export const data = JSON.parse(raw) as Data;
