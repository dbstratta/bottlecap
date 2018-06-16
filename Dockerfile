FROM node:10.4.1 AS builder

ENV NODE_ENV=${NODE_ENV:-production}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production=false

# Bundle app source.
COPY . .

RUN yarn build

FROM node:10.4.1

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install && \
    mkdir -p dist

COPY --from=builder /usr/src/app/dist/ dist

RUN node index.js
