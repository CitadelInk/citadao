FROM node:carbon

COPY package.json /src/package.json
WORKDIR /src
RUN npm install express --no-save
RUN yarn global add http-server
ADD ./public .

EXPOSE 8080

ENTRYPOINT ["node", "server.js"]