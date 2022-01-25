import { handle } from "./app.ts";
import { updateData } from "./data.ts";
import { HttpError } from "./errors.ts";

const PORT = 3000;
const UPDATE_INTERVAL = 3600;

updateData();
setInterval(() => {
  updateData();
}, UPDATE_INTERVAL * 1000);

const server = Deno.listen({ port: PORT });

for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      try {
        const body = await handle(requestEvent.request);
        requestEvent.respondWith(
          new Response(body, { status: 200 }),
        );
      } catch (error) {
        if (error instanceof HttpError) {
          requestEvent.respondWith(
            new Response(error.message, {
              status: error.status,
              headers: error.headers,
            }),
          );
        }
        console.error(error);
      }
    }
  })();
}
