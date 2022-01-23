import { handle } from "./app.ts";
import { HttpError } from "./errors.ts";

const server = Deno.listen({ port: 8080 });

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
            new Response(error.message, { status: error.status }),
          );
        }
      }
    }
  })();
}
