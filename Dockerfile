FROM denoland/deno:alpine-1.18.1
WORKDIR /app
USER deno
COPY src .
CMD ["run", "--allow-read", "--allow-net", "index.ts"]