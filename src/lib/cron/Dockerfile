# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lockfile first for caching dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of app
COPY . .

# Command to run the cron job script
CMD ["node", "manager.js"]
