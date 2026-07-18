FROM oven/bun:latest
WORKDIR /app
COPY manager/package.json ./
RUN bun install
COPY manager/ .
EXPOSE 8080
CMD ["bun", "run", "src/index.ts"]
