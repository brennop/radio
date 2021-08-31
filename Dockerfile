FROM node:12

RUN apt update && apt install --no-install-recommends -y ffmpeg

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 8080
CMD ["node", "index.js"]
