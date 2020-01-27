FROM node

# make sure directory exists.
RUN mkdir /usr/src/app
WORKDIR /usr/src/app


ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV MONGODB_URI_LOCAL=mongodb://mongo:27017/tracker-api

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 8080

RUN npm run tsc

CMD ["node", "./dist/index.js"]