FROM node:20  AS builder
WORKDIR /app

ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary

RUN npm config set strict-ssl false
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Copy package.json and package-lock.json before installing dependencies
COPY package*.json ./

# Clean npm cache and install dependencies with retry logic
RUN npm install --retry 3 --no-optional

# Copy Prisma schema file and related files
COPY prisma ./prisma

# Run Prisma generate to generate Prisma client
RUN npx prisma generate
RUN npx prisma db push
RUN npx  prisma db seed
# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]

