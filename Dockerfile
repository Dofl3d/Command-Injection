FROM node:18-alpine

# Install necessary packages for ping and other utilities
RUN apk update && apk add --no-cache \
    iputils-ping \
    bash \
    curl \
    wget

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application files
COPY . .

# Copy flag file to root (typical CTF setup)
COPY flag.txt /root/flag.txt

# Set proper permissions for flag
RUN chmod 600 /root/flag.txt

# Create a non-root user for the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory to nodejs user
RUN chown -R nodejs:nodejs /usr/src/app

# Switch to nodejs user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "start"]