FROM node:22-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

COPY --from=build /app/dist ./dist

# Bake runtime env into the image from a BuildKit secret.
RUN --mount=type=secret,id=app_env,required \
	/bin/sh -c "cat /run/secrets/app_env > /app/.env"

EXPOSE 5000

CMD ["node", "dist/server.js"]
