import { assertEquals } from "https://Deno.land/std/testing/asserts.ts";
import { convert } from "./converter.ts";

Deno.test("Token.Empty", () => {
  assertEquals(convert("  "), `\n`);
  assertEquals(convert("\n\n"), `\n`);
  assertEquals(convert("라\r\n로"), `「뉘\n\n\nㅏru`);
});
Deno.test("Token.CompleteHangul", () => {
  assertEquals(convert("라로"), `「뉘\nㅏru`);
  assertEquals(convert("하이"), `위-\n으`);
});
Deno.test("Token.NotCompleteHangul", () => {
  assertEquals(convert("ㄱㅣ"), `J\nㅡ`);
  assertEquals(convert("ㅁㄴㅇㄹ"), `ㅁ\nr\nㅇ\nru`);
  assertEquals(convert("ㅋㅋㅋ"), `ㅚ\nㅚ\nㅚ`);
});
Deno.test("Token.English", () => {
  assertEquals(convert("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), `ᗆ\nϖ\n∩\nᗜ\nm\nㄲ\nᘏ\n工\nㅡ\n(__\nㅈ\n┌-\nᕒ\nZ\nO\n‾ᗜ\n,O\n7ᗜ\n∽\n-ㅓ\n⊂\n<\nε\nX\n-<\nN`);
  assertEquals(convert("abcdefghijklmnopqrstuvwxyz"), `ჹ\nᓂ\nᴒ\nᓇ\nര\nႵ\nڡ\nፓ\n-·\nㄴ.\nㅈ\nㅡ\nᴟ\nᴝ\no\nᓀ\nᓄ\nㄱ\nᔥ\n-+\nㄷ\n<\nꗨ\nx\nﻋ\nᴺ`);
})
Deno.test("Token.Number", () => {
  assertEquals(convert("0123456789"), `o\nㅡ\nru\nω\n-F\nUT\n0‾‾\n__|\n∞\n__0`);
})
Deno.test("Token.SpecialLetter", () => {
  assertEquals(convert("?!.^-"), `·-J\n·ㅡ\n.\n>\nㅣ`);
})