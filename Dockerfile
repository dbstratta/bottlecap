FROM node:10.6.0@sha256:65aa96a65c7187a0253b5e2fef6a1e155bb89889bab0ee990bbbe3a3e990ce65 AS builder
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production=false
COPY . .
RUN yarn build

# ---

FROM node:10.6.0-alpine@sha256:e771c64a6bd0d64179de2c803c1af491ca4ce2dc418428525f2f7216495b18be
LABEL maintainer="strattadb@gmail.com"
ENV NODE_ENV=${NODE_ENV:-production}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install && \
    mkdir -p dist
COPY --from=builder /usr/src/app/dist/ dist
CMD ["yarn", "start:prod"]
