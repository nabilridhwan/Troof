FROM node:20-alpine

WORKDIR /app

# Install build tools needed for native npm modules (e.g. @swc/core)
RUN apk add --no-cache python3 make g++

# Copy the entire monorepo, including .env at the root
COPY . .

RUN npm install

# Install all dependencies (dev + prod needed for turbo build)
RUN npm ci

# Generate Prisma client from schema (no DB connection needed, just reads schema)
RUN npm run prisma:generate

# Build all apps and packages via turborepo
RUN npm run build:all
