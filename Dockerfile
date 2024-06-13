# Use official Node.js image as base
FROM node:latest

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the .env file to the working directory
COPY .env .env

# Copy the rest of the application code
COPY /src ./src/

# Expose port 8686 to the outside world
EXPOSE 8686

# Command to run the application
CMD [ "node", "src/app.js" ]