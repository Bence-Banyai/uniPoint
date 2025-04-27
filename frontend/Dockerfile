# syntax=docker/dockerfile:1

# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci --prefer-offline --no-audit && npm run build

# Production stage
FROM nginx:1.25-debian-slim
COPY --from=builder /app/.output/public /usr/share/nginx/html
COPY --from=builder /app/.output /app/.output
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
