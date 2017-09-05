FROM node:boron

COPY package.json /src/package.json
WORKDIR /src
RUN npm install
RUN npm install -g http-server
ADD ./public .

EXPOSE 8080

ENTRYPOINT ["hs", "-p 8080"]