# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN apk add --no-available --sync --no-cache python3 make g++ && \
    npm install

COPY . .
RUN npm run build
RUN npm prune --production

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# If you have other assets like ml-models that are needed at runtime:
COPY --from=builder /app/ml-models ./ml-models

EXPOSE 5000

CMD ["npm", "start"]
