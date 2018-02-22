# Use Node 8 (Alpine) as parent image
FROM node:8-alpine

# Labels
LABEL version="0.1.0"

# Broadcast NODE_ENV
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# In case we need to identify whether the app is running on docker
ENV APP_DOCKER 1 

# Set workdir and copy all app files over
WORKDIR /usr/src/app
COPY . ./

# If building for production
# RUN npm install --only-production
RUN npm install
RUN mkdir logs
RUN chown node: logs

# Expose port
EXPOSE 3000

# Run as node user
USER node

# Run app
CMD npx pm2-docker start index.js