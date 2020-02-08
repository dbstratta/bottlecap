FROM node:10.19.0@sha256:06e80d0a45ea264fa69296cce992bc6f9c6956ff18f314c6211ba5b0db34e468 AS builder
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production=false
COPY . .
RUN yarn build

# ---

FROM node:10.19.0-alpine@sha256:ca59a7a6abfdfe8f2fb62b14c24be5eac33a0acda20fd3d5e5bf2a942de57bad
LABEL maintainer="strattadb@gmail.com"
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install && \
    mkdir -p dist
COPY --from=builder /usr/src/app/dist/ dist
CMD ["yarn", "start:prod"]
