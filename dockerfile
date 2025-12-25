# ===== STEP 1: BUILD =====
    FROM node:20-alpine AS builder

    WORKDIR /app

    COPY package.json pnpm-lock.yaml ./
    RUN npm install -g pnpm && pnpm install

    COPY . .
    RUN pnpm build


# ===== STEP 2: RUNTIME =====
    FROM node:20-alpine

    WORKDIR /app

    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules ./node_modules

    CMD ["node", "dist/main.js"]


