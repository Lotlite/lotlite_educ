FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose port 8080 (Azure App Service Linux default)
EXPOSE 8080

# Bind to all network interfaces and explicitly use port 8080
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

CMD ["npm", "start"]
