FROM node:carbon

COPY package.json /src/package.json
WORKDIR /src

RUN mkdir -p ./botsPersistence
RUN npm install

ADD ./public .

ENTRYPOINT ["node", "bot.js"]
