# Build stage
FROM node:20-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# Production stage
FROM node:20-slim

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

COPY . .

EXPOSE 5003

CMD ["npm", "start"]