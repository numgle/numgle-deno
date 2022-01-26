import { convert } from "./converter.ts";
import { getData, updateData } from "./data.ts";
import { HttpError } from "./errors.ts";

type Method = "POST" | "GET";
type Route = {
  pattern: RegExp;
  handlers: {
    [index in Method]?: (reqeust: Request, params: string[]) => Promise<string> | string;
  };
};
const routes: Route[] = [
  {
    pattern: /^\/admin\/dataset?$/,
    handlers: {
      "POST": async () => {
        await updateData();
        return "updated!";
      },
    },
  },
  {
    pattern: /^\/([^/]+?)$/,
    handlers: {
      "GET": (_request, [input]) => {
        const data = getData();
        if (data == null) {
          throw new HttpError(503, "Service Unavailable", {
            "Retry-After": "1",
          });
        }
        return convert(input, data);
      },
    },
  },
];

// deno-lint-ignore require-await
export const handle = async (request: Request) => {
  const url = new URL(request.url);
  for (const route of routes) {
    const matched = url.pathname.match(route.pattern);
    if (matched == null) {
      continue;
    }
    const method = request.method as Method;
    const handler = route.handlers[method];
    if (handler == null) {
      throw new HttpError(405, "Method Not Allowed", {
        "Allow": Object.keys(route.handlers).join(", "),
      });
    }
    return handler(request, matched.slice(1).map(decodeURI));
  }
  throw new HttpError(400, "주소창에 `/:넘어질글자`를 입력해주세요!");
};
