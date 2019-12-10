FROM node:13.2-alpine

WORKDIR /app

COPY package.json /app/package.json
RUN yarn install

CMD ["yarn", "start"]