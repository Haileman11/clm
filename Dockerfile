FROM node:20  AS builder
WORKDIR /app

ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV DATABASE_URL=postgres://postgres:pass@10.109.0.20:5432/clm?schema=public

#Install netcat for DB readiness check
# RUN apt-get update && apt-get install -y netcat
RUN npm config set strict-ssl false
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Copy package.json and package-lock.json before installing dependencies
COPY package*.json ./

# Clean npm cache and install dependencies with retry logic
RUN npm install --retry 3 --no-optional --legacy-peer-deps
# Copy Prisma schema file and related files
COPY prisma ./prisma

# Run Prisma generate to generate Prisma client

RUN npx prisma generate

COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app

# Use bash to run the entrypoint
CMD ["bash", "./entrypoint.sh"]