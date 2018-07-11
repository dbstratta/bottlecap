FROM node:10.6.0@sha256:65aa96a65c7187a0253b5e2fef6a1e155bb89889bab0ee990bbbe3a3e990ce65 AS builder
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production=false
COPY . .
RUN yarn build

# ---

FROM node:10.6.0-alpine@sha256:c30b9a5bb5faba796d4df5c74310702e25bcca227786310dae9b5a08498b5e4a
LABEL maintainer="strattadb@gmail.com"
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install && \
    mkdir -p dist
COPY --from=builder /usr/src/app/dist/ dist
CMD ["yarn", "start:prod"]
