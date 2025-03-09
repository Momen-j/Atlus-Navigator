# Use the official Node.js image with support for TypeScript
FROM node:20.15.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Install TypeScript globally (for compiling)
RUN npm install -g typescript

# Copy all files (including TypeScript files) into the container
COPY . .

# Copy config.json into the container
COPY config.json /app/config.json

# Compile TypeScript to JavaScript
RUN tsc

# Final image (optional optimization with multi-stage builds)
FROM node:20.15.0 AS final

# Set the working directory for the final image
WORKDIR /app

# Copy only the necessary files (from the build stage)
# Make sure to copy config.json
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json /app/
COPY --from=build /app/config.json /app/config.json  

# Install only production dependencies in the final image
RUN npm install --production

# Start the bot with the compiled JavaScript code
CMD ["node", "dist/index.js"]
