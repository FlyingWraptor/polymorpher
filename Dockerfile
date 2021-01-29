FROM node:current-alpine
WORKDIR /usr/src/polymorpher

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]