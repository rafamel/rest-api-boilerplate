# Use Node 8 (Alpine) as parent image
FROM node:8-alpine

# Labels
LABEL version="0.1.0"
LABEL author="rafamel"

# Broadcast NODE_ENV
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
# We'll identify whether to apply the docker config via this env variable at
# ./src/utils/config-utils.js
ENV APP_DOCKER 1 

# Set workdir and copy all app files over
WORKDIR /usr/src/app
COPY . ./

# Install and migrate the database if needed
# If already up to date, there are no side effects
RUN npm install

# Expose port
EXPOSE 3000

# Run as node user
USER node

# Run app
CMD npx pm2-docker start index.js