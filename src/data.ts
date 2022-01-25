import { HttpError, ValidationError } from "./errors.ts";

export type Range = { start: number; end: number };
export type Data = {
  cho: string[];
  jong: string[];
  jung: string[];
  cj: string[][];
  han: string[];
  englishUpper: string[];
  englishLower: string[];
  number: string[];
  special: string[];
  range: {
    completeHangul: Range;
    notCompleteHangul: Range;
    uppercase: Range;
    lowercase: Range;
    number: Range;
    special: number[];
  };
};
let data: Data | null = null;
export function getData() {
  return data;
}
// deno-lint-ignore no-unused-vars
export function isData(data: unknown): data is Data {
  // TODO
  return true;
}
export async function updateData() {
  const url =
    "https://raw.githubusercontent.com/numgle/dataset/main/src/data.json";
  const raw = await fetch(url);
  if (raw.status >= 400) {
    throw new HttpError(raw.status, raw.statusText);
  }
  const fetchedData = await raw.json();
  if (!isData(fetchedData)) {
    throw new ValidationError("The data is invalid");
  }
  data = fetchedData;
}
