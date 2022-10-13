# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json .

# Install app dependencies using yarn that comes with node image
RUN yarn install

# Bundle app source
COPY . .

# Create a 'dist' folder with the production build
RUN yarn build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]