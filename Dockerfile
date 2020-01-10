# FROM node:alpine

# RUN mkdir -p /usr/src/app 

# WORKDIR /usr/src/app

# COPY . /usr/src/app 


# RUN apk --no-cache --virtual build-dependencies add \
#     python \
#     make \
#     g++ \
#     && npm install \
#     && apk del build-dependencies

# WORKDIR /home/node/app

# WORKDIR /usr/src/app

# COPY package*.json ./


# USER node
# RUN npm install

# COPY  --chown=node:node . .
# ADD . /home/node/app

# compiles to javascript
# RUN npm run tsc

# EXPOSE 8080
# COPY --chown=node:node . .

# pm2 start ./dist/index.js
# CMD [ "node", "./dist/index.js" ]

FROM node

# make sure directory exists.
RUN mkdir /usr/src/app
WORKDIR /usr/src/app


ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 8080

RUN npm run tsc

CMD ["node", "./dist/index.js"]