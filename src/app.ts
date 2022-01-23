import { convert } from "./converter.ts";
import { HttpError } from "./errors.ts";

// deno-lint-ignore require-await
export const handle = async (request: Request) => {
  const url = new URL(request.url);
  const pattern = /^\/([^/]+?)$/;
  const matched = url.pathname.match(pattern);
  if (matched == null) {
    throw new HttpError(400, "Bad Request");
  }
  const input = decodeURI(matched[1]);
  return convert(input);
};
