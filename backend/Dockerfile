# ---------- Builder: install deps, generate Prisma client ----------
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

# ---------- Runner: minimal runtime image ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
# tsx is needed at runtime (dev script), so install all deps
RUN npm ci

COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 5000

CMD ["npm", "run", "start"]
