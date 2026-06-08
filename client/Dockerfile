# ─── Build Stage ───────────────────────────────────────────────
FROM node:22 AS builder

WORKDIR /app

# Copy package.json first to leverage Docker layer caching
COPY package.json ./

# Use npm for install — handles platform-specific optional deps correctly
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build Nuxt app → generates .output/
RUN npm run build

# ─── Production Stage ──────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# Copy only the self-contained Nitro build output (~no node_modules needed)
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
