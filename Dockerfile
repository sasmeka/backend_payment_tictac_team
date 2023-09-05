#! buat image container
# FROM node:18-alpine3.18 AS build
FROM node:18-alpine3.18

#! buat folder untuk niympan code
WORKDIR /nodezwallet

#! Copy semua file
COPY . .

#! install depedency and build
COPY package*.json ./
RUN npm install

EXPOSE 8001

ENTRYPOINT ["node","server.js"]

# docker build -t sasmeka/tictacwallet .