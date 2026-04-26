  - name: Build and push Docker image
    uses: docker/build-push-action@v5
    with:
      context: .
      file: Dockerfile
      push: true
      platforms: linux/amd64,linux/arm64
      tags: ghcr.io/${{ env.OWNER_LC }}/discord-bot:latest
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .


# Environment variables are set at runtime (docker-compose or --env)

CMD ["bun", "run", "start"]
