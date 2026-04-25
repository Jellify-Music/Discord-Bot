# Dockerfile for Discord-Bot (Bun)
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .


# Environment variables are set at runtime (docker-compose or --env)

CMD ["bun", "run", "start"]
