# Use Node 8 (Alpine) as parent image
FROM node:8-alpine

# Set workdir and copy all app files over
WORKDIR /usr/src/app
COPY ./* /usr/src/app/

RUN npm install --only-production
RUN npm cache clean
RUN mkdir logs
RUN chown node: logs

# Environment variables
ENV APP_DOCKER 1
ENV NODE_ENV production
ENV PORT 80

# Expose port
EXPOSE 80

# Run as node user
USER node
CMD npx pm2-docker start index.js