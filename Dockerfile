FROM node:12-alpine

RUN apk add ffmpeg

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 8080
CMD ["node", "index.js"]
