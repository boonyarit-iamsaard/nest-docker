#-----------------------#
# BUILD FOR DEVELOPMENT #
#-----------------------#

# Base image
FROM node:16 As development

# Require for Prisma Client to work in the container
RUN apt-get update && apt-get install -y openssl

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock 
COPY --chown=node:node package.json .

COPY --chown=node:node yarn.lock .

# Install app dependencies using `yarn install --frozen-lockfile` to ensure that the lockfile is not updated
RUN rm -rf node_modules \
    && yarn install --frozen-lockfile 

# Bundle app source
COPY --chown=node:node . .

# Generate Prisma Client
RUN yarn prisma:generate

# Use the node user from the base image instead of root
USER node

#-----------------------#
# BUILD FOR PRODUCTION  #
#-----------------------#

FROM node:16-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package.json .

COPY --chown=node:node yarn.lock .

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV=production

RUN rm -rf node_modules \
    && yarn install --production --frozen-lockfile \
    && yarn cache clean --all

USER node

#-----------------------#
# PRODUCTION            #
#-----------------------#

FROM node:16-alpine As production

# Copy th bundle code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules

# Start the server using the production build
CMD [ "node", "dist/main.js" ]