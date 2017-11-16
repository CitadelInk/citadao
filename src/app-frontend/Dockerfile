FROM node:carbon

COPY package.json /src/package.json
WORKDIR /src
RUN npm install -g http-server
ADD ./public .

EXPOSE 8080

ENTRYPOINT ["node", "server.js"]