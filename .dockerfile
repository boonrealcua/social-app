FROM node:latest

WORKDIR /app

COPY . .

RUN yarn

CMD ["npm", "start"]
