FROM node:10.9.0@sha256:576446f0ea880126f39392c492ff449a8cf3903530ac57a3a1d84494a6cc2a64 AS builder
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production=false
COPY . .
RUN yarn build

# ---

FROM node:10.9.0-alpine@sha256:a4212307484e6b662806a538ec6352182aaf8b4b748644aaa7f6e87bda159097
LABEL maintainer="strattadb@gmail.com"
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install && \
    mkdir -p dist
COPY --from=builder /usr/src/app/dist/ dist
CMD ["yarn", "start:prod"]
