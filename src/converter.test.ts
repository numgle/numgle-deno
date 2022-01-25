import { assertEquals } from "https://Deno.land/std/testing/asserts.ts";
import { convert } from "./converter.ts";
import { getData, updateData } from "./data.ts";

await updateData();

Deno.test("Token.Empty", () => {
  const data = getData()!;
  assertEquals(convert("  ", data), `\n`);
  assertEquals(convert("\n\n", data), `\n`);
  assertEquals(convert("라\r\n로", data), `「뉘\n\n\nㅏru`);
});
Deno.test("Token.CompleteHangul", () => {
  const data = getData()!;
  assertEquals(convert("라로", data), `「뉘\nㅏru`);
  assertEquals(convert("하이", data), `위-\n으`);
});
Deno.test("Token.NotCompleteHangul", () => {
  const data = getData()!;
  assertEquals(convert("ㄱㅣ", data), `J\nㅡ`);
  assertEquals(convert("ㅁㄴㅇㄹ", data), `ㅁ\nr\nㅇ\nru`);
  assertEquals(convert("ㅋㅋㅋ", data), `ㅚ\nㅚ\nㅚ`);
});
Deno.test("Token.English", () => {
  const data = getData()!;
  assertEquals(convert("ABCDEFGHIJKLMNOPQRSTUVWXYZ", data), `ᗆ\nϖ\n∩\nᗜ\nm\nㄲ\nᘏ\n工\nㅡ\n(__\nㅈ\n┌-\nᕒ\nZ\nO\n‾ᗜ\n,O\n7ᗜ\n∽\n-ㅓ\n⊂\n<\nε\nX\n-<\nN`);
  assertEquals(convert("abcdefghijklmnopqrstuvwxyz", data), `ჹ\nᓂ\nᴒ\nᓇ\nര\nႵ\nڡ\nፓ\n-·\nㄴ.\nㅈ\nㅡ\nᴟ\nᴝ\no\nᓀ\nᓄ\nㄱ\nᔥ\n-+\nㄷ\n<\nꗨ\nx\nﻋ\nᴺ`);
})
Deno.test("Token.Number", () => {
  const data = getData()!;
  assertEquals(convert("0123456789", data), `o\nㅡ\nru\nω\n-F\nUT\n0‾‾\n__|\n∞\n__0`);
})
Deno.test("Token.SpecialLetter", () => {
  const data = getData()!;
  assertEquals(convert("?!.^-", data), `·-J\n·ㅡ\n.\n>\nㅣ`);
})