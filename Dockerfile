# Set the base image to Ubuntu
FROM node:boron

# Install nodemon
RUN npm install -g nodemon

# Provides cached layer for node_modules
# todo: we can't provide cached layer because of https://github.com/balderdashy/sails/issues/4066
# ADD package.json /tmp/package.json
# RUN cd /tmp && npm install
# RUN mkdir -p /usr/src && cp -a /tmp/node_modules /usr/src

RUN mkdir -p /usr/src

# Define working directory
WORKDIR /usr/src
