FROM node:latest
RUN mkdir -p /src/app
WORKDIR /src/app
RUN ["npm", "install"]
RUN ["npm", "install", "-g", "nodemon"]
