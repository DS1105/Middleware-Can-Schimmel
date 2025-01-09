# Use the official Node.js image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire source code into the container
COPY . .

# Expose port 3000
EXPOSE 3000

# Set the default command to start the application
CMD ["node", "src/app/page.js"]  
