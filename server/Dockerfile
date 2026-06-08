FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy package files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy source code
COPY . .

EXPOSE 6431

CMD ["node", "server.js"]
