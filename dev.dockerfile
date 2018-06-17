FROM node:10.4.1

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]
