FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@9.15.5 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:20-bookworm-slim AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.5 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY src ./src

RUN pnpm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN corepack enable && corepack prepare pnpm@9.15.5 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist

# Bake runtime env into the image from a BuildKit secret.
RUN --mount=type=secret,id=app_env,required \
	/bin/sh -c "cat /run/secrets/app_env > /app/.env"

EXPOSE 5000

CMD ["node", "dist/server.js"]
