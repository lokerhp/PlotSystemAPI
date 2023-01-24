FROM node:19.4-alpine3.16

WORKDIR /etc/buildtheearth/plotsystem-api

COPY . ./

RUN npm install

RUN npm run build

ENV NODE_ENV production

CMD ["node", "dist/index.js"]