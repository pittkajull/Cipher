FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
