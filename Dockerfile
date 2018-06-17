FROM node:10.4.1@sha256:2cda73dd26369c2ec69130ddda6f83ff4980fd6fc8e73b5e670a7670d4c86ba0 AS builder

ENV NODE_ENV=${NODE_ENV:-production}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production=false

# Bundle app source.
COPY . .

RUN yarn build

FROM node:10.4.1@sha256:2cda73dd26369c2ec69130ddda6f83ff4980fd6fc8e73b5e670a7670d4c86ba0

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install && \
    mkdir -p dist

COPY --from=builder /usr/src/app/dist/ dist

CMD ["node", "index.js"]
