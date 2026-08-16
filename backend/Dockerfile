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

# 1. Install tsx globally
RUN npm install -g tsx

COPY package*.json ./
# 2. Install production dependencies
RUN npm ci --omit=dev

# 3. Copy everything from builder (Fixes the Prisma error cleanly)
COPY --from=builder /app /app

EXPOSE 5000

# 4. Use npx to force Node to look at the global tsx binary path
CMD ["npx", "tsx", "src/index.ts"]
