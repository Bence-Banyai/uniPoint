# syntax=docker/dockerfile:1

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci --prefer-offline --no-audit && npm run generate

# Production stage
FROM nginx:1.25-alpine
COPY --from=builder /app/.output/public /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]