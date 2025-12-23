# 1. Use Node Alpine (Lightweight)
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the code
COPY . .

# 5. Expose the Backend Port (Usually 5000 or 8080)
EXPOSE 5000

# 6. Run the server (Make sure you have "start": "node index.js" in package.json)
CMD ["npm", "start"]