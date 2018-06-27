FROM node:10.5.0@sha256:1201e1478ae2146ef699835a5726b1586e954b568962f5f937378d48de2e3014 AS builder
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production=false
COPY . .
RUN yarn build

# ---

FROM node:10.5.0-alpine@sha256:21b58de0d309e8b793fb508e610762e522074a3bd5bef6f3ff74b7bade338aec
LABEL maintainer="strattadb@gmail.com"
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install && \
    mkdir -p dist
COPY --from=builder /usr/src/app/dist/ dist
CMD ["yarn", "start:prod"]
