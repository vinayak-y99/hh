# Use the official Node 18 image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Change ownership of the working directory to the 'node' user
RUN chown -R node:node /app

# Switch to the 'node' user to install dependencies
USER node

# Install dependencies (with --legacy-peer-deps to resolve any peer dependency issues)
# --unsafe-perm=true is added to ensure permission issues are avoided
RUN npm install --legacy-peer-deps --unsafe-perm=true

# Ensure all scripts in node_modules/.bin are executable (important for next.js)
RUN chmod -R 755 /app/node_modules/.bin

# Also ensure that the node_modules directory itself has the right permissions
RUN chmod -R 755 /app/node_modules

# Explicitly set permissions for the next binary in node_modules/.bin
#RUN chmod +x /app/node_modules/.bin/next

# Copy the rest of the application files (after installing dependencies)
COPY --chown=node:node . .

# Build the application
RUN npm run build

# Expose port 3000 for the Next.js application
EXPOSE 5173

# Command to run the application in production mode
CMD ["npm", "run", "dev"]