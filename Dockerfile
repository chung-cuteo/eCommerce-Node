# Use an official Node.js runtime as a parent image
FROM node:latest

RUN mkdir -p /usr/src/ecommerce-app

WORKDIR /usr/src/ecommerce-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
