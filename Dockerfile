FROM node:8.11.2
RUN mkdir -p /usr/src/store-vuejs

COPY dist /usr/src/store-vuejs/dist

COPY authMiddleware.js /usr/src/store-vuejs/
COPY data.json /usr/src/store-vuejs/
COPY server.js /usr/src/store-vuejs/server.js
COPY deploy-package.json /usr/src/store-vuejs/package.json

WORKDIR /usr/src/store-vuejs

RUN npm install

CMD ["node", "server.js"]