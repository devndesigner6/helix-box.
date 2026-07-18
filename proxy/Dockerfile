FROM oven/bun:latest
WORKDIR /app
COPY proxy/package.json ./
RUN bun install
COPY proxy/ .
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
