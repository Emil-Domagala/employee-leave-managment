# Use official Node.js LTS image
FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose app port (adjust if not 3000)
EXPOSE 3000

# Run the app in dev mode by default
CMD ["npm", "run", "dev"]
