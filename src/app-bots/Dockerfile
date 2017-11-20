FROM node:boron

COPY package.json /src/package.json
WORKDIR /src
RUN npm install
ADD ./ .

ENTRYPOINT ["node", "index.js"]