FROM node:10.7.0@sha256:cf2e3cd5251273c53bd5497b1a912a9956fb775710df8e015c835719f2ce7e14 AS builder
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production=false
COPY . .
RUN yarn build

# ---

FROM node:10.7.0-alpine@sha256:cf2e3cd5251273c53bd5497b1a912a9956fb775710df8e015c835719f2ce7e14
LABEL maintainer="strattadb@gmail.com"
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install && \
    mkdir -p dist
COPY --from=builder /usr/src/app/dist/ dist
CMD ["yarn", "start:prod"]
